import { createHash } from "node:crypto";
import { ModelResearch, routeKey } from "./research.js";
import { capabilityOperations, effectiveCapabilities } from "./capabilities.js";
import { providerKind, isOfficialProvider } from "./provenance.js";
export { providerKind } from "./provenance.js";

const LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
const text = (...values) => values.find((v) => typeof v === "string" && v.trim())?.trim();
const number = (...values) => values.find((v) => typeof v === "number" && Number.isFinite(v) && v >= 0);
const capacity = (...values) => values.find((v) => Number.isSafeInteger(v) && v > 0);
const boolean = (...values) => values.find((v) => typeof v === "boolean");
const present = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));
const endpointKey = (entry, value) => createHash("sha256").update(JSON.stringify([
  entry.provider, value?.baseURL ?? entry.baseURL, value?.api, value?.apiKeyEnv ?? entry.apiKeyEnv, value?.headers,
])).digest("hex");

/** Append models to the configured API prefix without discarding a gateway's path. */
export function modelsUrl(baseURL) {
  const url = new URL(baseURL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error("INVALID_ENDPOINT");
  let path = url.pathname.replace(/\/+$/, "").replace(/\/(?:chat\/completions|responses|models)$/, "");
  url.pathname = `${path || "/v1"}/models`;
  return url.href;
}

/** Normalize only disclosed fields. Arbitrary response properties never cross to the Client. */
export function parseModels(body) {
  const entries = Array.isArray(body?.data) ? body.data.map((raw) => [undefined, raw])
    : Array.isArray(body?.models) ? body.models.map((raw) => [undefined, raw])
    : body?.models && typeof body.models === "object" ? Object.entries(body.models) : null;
  if (!entries || entries.length > 5000) throw new Error("INVALID_MODEL_LIST");
  const seen = new Set();
  return entries.flatMap(([key, raw]) => {
    if (!raw || typeof raw !== "object") return [];
    const id = text(key, raw.id);
    if (!id || id.length > 512 || seen.has(id)) return [];
    seen.add(id);
    const caps = raw.capabilities;
    const has = (name) => Array.isArray(caps) && caps.includes(name) ? true : undefined;
    const input = [raw.inputModalities, raw.input_modalities, raw.input, raw.modalities?.input, raw.architecture?.input_modalities]
      .find((v) => Array.isArray(v) && v.length > 0);
    const levels = raw.reasoning_efforts ?? raw.reasoningEfforts ?? raw.supported_reasoning_efforts ?? raw.reasoning?.efforts ?? raw.reasoning?.levels ?? caps?.reasoning_efforts ?? raw.effort?.supported_levels;
    const wires = {};
    const efforts = [];
    for (const level of LEVELS) {
      const entry = Array.isArray(levels) ? levels.find((v) => (typeof v === "string" ? v : v?.id) === level) : undefined;
      const wire = entry !== undefined ? (typeof entry === "string" ? entry : entry.value ?? entry.id) : levels && typeof levels === "object" ? levels[level] : undefined;
      if (typeof wire === "string" && wire.length > 0 || level === "off" && wire === null) {
        wires[level] = wire;
        efforts.push({ id: level, name: typeof entry?.name === "string" ? entry.name.slice(0, 80) : level });
      }
    }
    const hasEfforts = raw.reasoning !== false && caps?.reasoning !== false && efforts.some((v) => v.id !== "off");
    const defaultEffort = text(raw.default_reasoning_effort, raw.reasoning?.defaultEffort, raw.reasoning?.default_effort, raw.effort?.default_level);
    const metadata = present({
      contextWindow: capacity(raw.contextWindow, raw.context_window, raw.context_length, raw.limit?.context, raw.limits?.context),
      maxInputTokens: capacity(raw.maxInputTokens, raw.max_input_tokens, raw.limit?.input, raw.limits?.input),
      maxTokens: capacity(raw.maxOutputTokens, raw.max_output_tokens, raw.maxTokens, raw.max_tokens, raw.limit?.output, raw.limits?.output, raw.top_provider?.max_completion_tokens),
      text: input ? input.includes("text") : undefined,
      vision: boolean(caps?.vision, caps?.image, raw.vision, input ? input.includes("image") : undefined, has("vision")),
      tools: boolean(caps?.tools, caps?.tool_calling, caps?.tool_call, caps?.function_calling, raw.tools, raw.tool_calling, raw.function_calling, raw.supports_tools, raw.supports_function_calling, has("tools"), has("tool_calling")),
      streaming: boolean(caps?.streaming, raw.streaming, raw.supports_streaming, has("streaming")),
      reasoning: boolean(typeof raw.reasoning === "boolean" ? raw.reasoning : raw.reasoning?.supported, raw.supports_reasoning, caps?.reasoning, has("reasoning"), hasEfforts ? true : undefined),
      inputMultiplier: number(raw.input_multiplier, raw.inputMultiplier, raw.multipliers?.input, raw.pricing?.input_multiplier),
      outputMultiplier: number(raw.output_multiplier, raw.outputMultiplier, raw.multipliers?.output, raw.pricing?.output_multiplier),
    });
    return [{ id, name: text(raw.name, raw.display_name, raw.displayName)?.slice(0, 160), metadata,
      ...(hasEfforts ? { reasoning: { efforts, ...(efforts.some((v) => v.id === defaultEffort) ? { defaultEffort } : {}) }, wires } : {}),
      ...(input ? { input: input.filter((v) => ["text", "image"].includes(v)) } : {}),
    }];
  });
}

/** Host-only discovery: resolve credentials for the configured destination, bound replies, cache sanitized data. */
export class ModelDiscovery {
  constructor(ctx, fetcher = fetch) {
    this.ctx = ctx;
    this.fetcher = fetcher;
    this.cache = new Map();
    this.pending = new Map();
    this.lifetime = new AbortController();
    this.research = new ModelResearch(ctx, this.lifetime.signal);
    this.syncTail = Promise.resolve();
  }
  dispose() { this.lifetime.abort(); this.cache.clear(); this.pending.clear(); }
  profile(entry) {
    const section = this.ctx.settings.describe({ redactSecrets: false }).find((s) => s.ns === entry.settingsNs);
    let value = section?.value;
    for (const key of entry.settingsPath || []) value = value?.[key];
    return { value, revision: section?.revision, ns: entry.settingsNs };
  }
  async request(entry, force) {
    // Account authentication, native protocols and official listing policy belong to their adapters.
    const prefs = this.research.preferences()?.value;
    if (isOfficialProvider(entry.provider) || providerKind(entry.provider, entry, prefs?.providerKinds?.[entry.provider]) === "official") return null;
    const profile = this.profile(entry), value = profile.value;
    if (value?.api && !["openai-completions", "openai-responses"].includes(value.api)) return null;
    const baseURL = value?.baseURL ?? entry.baseURL;
    if (!baseURL) return null;
    const url = modelsUrl(baseURL);
    const sourceKey = endpointKey(entry, value);
    const signature = createHash("sha256").update(JSON.stringify([entry.provider, url, profile.revision, value?.apiKeyEnv, value?.headers])).digest("hex");
    const cached = this.cache.get(signature);
    if (!force && cached && Date.now() - cached.fetchedAt < 300000) return { ...cached, cached: true };
    if (this.pending.has(signature)) return this.pending.get(signature);
    const started = Date.now();
    const operation = (async () => {
      const ref = value?.apiKeyEnv ?? entry.apiKeyEnv;
      const headers = new Headers(value?.headers || {});
      headers.set("Accept", "application/json");
      if (ref) {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref)) throw new Error("INVALID_CREDENTIAL_REFERENCE");
        const credential = await this.ctx.credentials.resolve(ref);
        if (!credential?.value) throw new Error("MISSING_CREDENTIAL");
        headers.set("Authorization", `Bearer ${credential.value}`);
      }
      const response = await this.fetcher(url, { headers, redirect: "error", signal: AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(15000)]) });
      if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP_${response.status}`); }
      const limit = 8 * 1024 * 1024;
      if (Number(response.headers.get("content-length")) > limit) { await response.body?.cancel(); throw new Error("REPLY_TOO_LARGE"); }
      const reader = response.body.getReader();
      let size = 0;
      const chunks = [];
      try {
        while (true) {
          const part = await reader.read(); if (part.done) break;
          size += part.value.byteLength;
          if (size > limit) throw new Error("REPLY_TOO_LARGE");
          chunks.push(Buffer.from(part.value));
        }
      } finally { await reader.cancel().catch(() => {}); }
      const result = { models: parseModels(JSON.parse(Buffer.concat(chunks).toString("utf8"))), fetchedAt: Date.now(), cached: false,
        endpointKey: sourceKey };
      this.cache.set(signature, result);
      this.ctx.logger?.info("model-assistant catalog: channel=%s models=%d elapsedMs=%d", entry.provider, result.models.length, Date.now() - started);
      return result;
    })();
    this.pending.set(signature, operation);
    try { return await operation; } catch (error) {
      this.ctx.logger?.warn?.("model-assistant catalog: channel=%s code=%s elapsedMs=%d", entry.provider, safeError(error), Date.now() - started);
      if (cached) return { ...cached, stale: true, code: safeError(error) };
      throw error;
    } finally { this.pending.delete(signature); }
  }
  /** Serialize revision-checked profile edits across providers sharing a settings namespace. */
  async syncModels(entry, live, modelId) {
    const operation = this.syncTail.catch(() => {}).then(async () => {
      this.lifetime.signal.throwIfAborted();
      const profile = this.profile(entry);
      // A response from a replaced endpoint must never change the new destination's model controls.
      if (live.endpointKey !== endpointKey(entry, profile.value)) throw new Error("CONFIGURATION_CHANGED");
      const enabled = this.research.preferences()?.value?.enabled !== false;
      const inherited = modelId && !profile.value?.models?.length ? await this.ctx.llm.listModels(entry.provider).catch(() => []) : [];
      const ops = capabilityOperations(entry, profile.value, live.models, { addModelId: modelId, inherited, enabled });
      if (!ops.length) return { changed: false };
      await this.ctx.settings.mutate(entry.settingsNs, ops, profile.revision);
      return { changed: true };
    });
    this.syncTail = operation;
    return operation;
  }
  /** Read the same exact-route controls used by native image admission and reasoning selection. */
  async localModels(provider) {
    const rows = await this.ctx.llm.listModels(provider);
    return Promise.all(rows.map(async (model) => {
      const info = await this.ctx.llm.resolveModelInfo(provider, model.id).catch(() => model);
      const effective = effectiveCapabilities(info);
      return { id: model.id, name: model.name, researchEligible: true, effective, metadata: effective,
        ...(info.reasoning ? { reasoning: info.reasoning } : {}) };
    }));
  }
  /** Refresh endpoint facts and synchronize configured capabilities before advertising native controls. */
  async catalog(force = false, researchProvider = null, preferredModel = null) {
    if (typeof force !== "boolean" || !(researchProvider == null || typeof researchProvider === "string") || !(preferredModel == null || typeof preferredModel === "string")) throw new Error("INVALID_REQUEST");
    const directory = this.ctx.llm.listConfigurableProviders();
    const prefs = this.research.preferences()?.value;
    const failures = [];
    let capabilitiesChanged = false;
    const groups = await Promise.all(this.ctx.llm.listProviders().map(async (provider) => {
      const entry = directory.find((item) => item.provider === provider.id);
      const kind = providerKind(provider.id, entry, prefs?.providerKinds?.[provider.id]);
      let live, local = [];
      try { live = entry ? await this.request(entry, force) : null; }
      catch (error) { failures.push({ id: provider.id, code: safeError(error) }); }
      if (live?.stale) failures.push({ id: provider.id, code: live.code });
      if (live && !live.stale && prefs?.enabled !== false) {
        try { if ((await this.syncModels(entry, live)).changed) capabilitiesChanged = true; }
        catch (error) {
          if (error.message === "CONFIGURATION_CHANGED") live = null;
          failures.push({ id: provider.id, code: "CAPABILITY_SYNC_FAILED" });
        }
      }
      try { local = await this.localModels(provider.id); }
      catch { /* A working endpoint can still advertise models that have not been selected yet. */ }
      if (live) {
        const resolved = new Map(local.map((model) => [model.id, model]));
        return { id: provider.id, name: provider.name, kind, source: live.stale ? "stale" : "live", fetchedAt: live.fetchedAt, cached: live.cached,
          models: live.models.map(({ wires, input, reasoning, ...model }) => {
            const host = resolved.get(model.id);
            return { ...model, name: model.name || host?.name || model.id,
              effective: host?.effective || effectiveCapabilities(null), researchEligible: !!host,
              ...(host?.reasoning ? { reasoning: host.reasoning } : {}) };
          }) };
      }
      return { id: provider.id, name: provider.name, kind, source: "local", models: local };
    }));
    let research;
    if (researchProvider) {
      const group = groups.find((g) => g.id === researchProvider);
      if (!group) throw new Error("INVALID_REQUEST");
      try { research = await this.research.refresh(group, preferredModel); }
      catch (error) { research = { code: researchError(error) }; }
    }
    const references = this.research.preferences()?.value?.references;
    for (const group of groups) for (const model of group.models) {
      const reference = references?.[routeKey(group.id, model.id)];
      if (reference) model.reference = reference;
    }
    return { version: 2, groups, failures, capabilitiesChanged, ...(research ? { research } : {}) };
  }
  /** Prepare advertised models even when already configured, so native admission matches the displayed capability. */
  async prepare(provider, modelId, effort) {
    if (typeof provider !== "string" || typeof modelId !== "string" || !(effort === null || typeof effort === "string")) throw new Error("INVALID_REQUEST");
    const entry = this.ctx.llm.listConfigurableProviders().find((item) => item.provider === provider);
    if (!entry) return { changed: false };
    // Validate membership again at selection: a model may have been delisted since the menu's cached read.
    const live = await this.request(entry, true);
    if (!live) return { changed: false };
    if (live.stale) throw new Error("MODEL_LIST_UNAVAILABLE");
    if (!live.models.some((model) => model.id === modelId)) throw new Error("MODEL_NOT_ADVERTISED");
    const result = await this.syncModels(entry, live, modelId);
    if (effort !== null) {
      const resolved = await this.ctx.llm.resolveModelInfo(provider, modelId);
      if (!resolved.reasoning?.efforts.some((item) => item.id === effort)) throw new Error("UNSUPPORTED_EFFORT");
    }
    return result;
  }

}
function safeError(error) {
  return /^(HTTP_\d{3}|INVALID_ENDPOINT|INVALID_MODEL_LIST|MISSING_CREDENTIAL|INVALID_CREDENTIAL_REFERENCE|REPLY_TOO_LARGE)$/.test(error?.message)
    ? error.message : "DISCOVERY_FAILED";
}
function researchError(error) {
  return /^(WEB_UNAVAILABLE|INVALID_RESEARCH_MODEL|NO_RESEARCH_SOURCES|INVALID_RESEARCH_REPLY|RESEARCH_MODEL_FAILED|NO_VERIFIED_FACTS)$/.test(error?.message)
    ? error.message : "RESEARCH_FAILED";
}
