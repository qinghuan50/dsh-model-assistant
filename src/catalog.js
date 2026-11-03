import { createHash } from "node:crypto";

const LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
const text = (...values) => values.find((v) => typeof v === "string" && v.trim())?.trim();
const number = (...values) => values.find((v) => typeof v === "number" && Number.isFinite(v) && v >= 0);
const capacity = (...values) => values.find((v) => Number.isSafeInteger(v) && v > 0);
const boolean = (...values) => values.find((v) => typeof v === "boolean");
const present = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));

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
    const levels = raw.reasoning_efforts ?? raw.reasoningEfforts ?? raw.supported_reasoning_efforts ?? raw.reasoning?.efforts ?? raw.reasoning?.levels ?? caps?.reasoning_efforts;
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
    const defaultEffort = text(raw.default_reasoning_effort, raw.reasoning?.defaultEffort, raw.reasoning?.default_effort);
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
  }
  dispose() { this.lifetime.abort(); this.cache.clear(); this.pending.clear(); }
  profile(entry) {
    const section = this.ctx.settings.describe({ redactSecrets: false }).find((s) => s.ns === entry.settingsNs);
    let value = section?.value;
    for (const key of entry.settingsPath || []) value = value?.[key];
    return { value, revision: section?.revision, ns: entry.settingsNs };
  }
  async request(entry, force) {
    const profile = this.profile(entry), value = profile.value;
    const baseURL = value?.baseURL ?? entry.baseURL;
    if (!baseURL) return null;
    const url = modelsUrl(baseURL);
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
      const result = { models: parseModels(JSON.parse(Buffer.concat(chunks).toString("utf8"))), fetchedAt: Date.now(), cached: false };
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
  async catalog(force = false) {
    if (typeof force !== "boolean") throw new Error("INVALID_REQUEST");
    const directory = this.ctx.llm.listConfigurableProviders();
    const failures = [];
    const groups = await Promise.all(this.ctx.llm.listProviders().map(async (provider) => {
      let local = [];
      try {
        local = await this.ctx.llm.listModels(provider.id);
        local = await Promise.all(local.map(async (m) => {
          const info = await this.ctx.llm.resolveModelInfo(provider.id, m.id);
          return { id: m.id, name: m.name, ...(info.reasoning ? { reasoning: info.reasoning } : {}) };
        }));
      } catch { /* A working endpoint can still supply the directory when the local catalog is invalid. */ }
      const entry = directory.find((e) => e.provider === provider.id);
      try {
        const live = entry ? await this.request(entry, force) : null;
        if (live) {
          if (live.stale) failures.push({ id: provider.id, code: live.code });
          const names = new Map(local.map((m) => [m.id, m.name]));
          return { id: provider.id, name: provider.name, source: live.stale ? "stale" : "live", fetchedAt: live.fetchedAt, cached: live.cached,
            models: live.models.map(({ wires, input, ...m }) => ({ ...m, name: m.name || names.get(m.id) || m.id })) };
        }
      } catch (error) { failures.push({ id: provider.id, code: safeError(error) }); }
      return { id: provider.id, name: provider.name, source: "local", models: local };
    }));
    return { groups, failures };
  }
  /** Admit only a model advertised by this configured endpoint; preserve all existing model settings. */
  async prepare(provider, modelId, effort) {
    if (typeof provider !== "string" || typeof modelId !== "string" || !(effort === null || typeof effort === "string")) throw new Error("INVALID_REQUEST");
    const entry = this.ctx.llm.listConfigurableProviders().find((e) => e.provider === provider);
    if (!entry) return { changed: false };
    const live = await this.request(entry, false);
    if (!live || live.stale) return { changed: false };
    const model = live.models.find((m) => m.id === modelId);
    if (!model) throw new Error("MODEL_NOT_ADVERTISED");
    if (effort !== null && !model.reasoning?.efforts.some((e) => e.id === effort)) throw new Error("UNSUPPORTED_EFFORT");
    const profile = this.profile(entry);
    const resolved = await this.ctx.llm.resolveModelInfo(provider, modelId).catch(() => null);
    if (resolved && (effort === null || resolved.reasoning?.efforts.some((e) => e.id === effort))) return { changed: false };
    let rows = Array.isArray(profile.value?.models) ? profile.value.models : [];
    if (!rows.length) {
      const inherited = await this.ctx.llm.listModels(provider).catch(() => []);
      rows = inherited.map((m) => ({ id: m.id, name: m.name }));
    }
    const previous = rows.find((m) => m.id === modelId);
    const override = profile.value?.modelOverrides?.[modelId];
    const existing = previous ? { ...previous, ...override, id: modelId } : undefined;
    const row = { ...(existing || { id: model.id, name: model.name || model.id }),
      ...(!existing ? present({ contextWindow: model.metadata.contextWindow, maxTokens: model.metadata.maxTokens, input: model.input?.length ? model.input : undefined }) : {}),
      ...(effort !== null && model.wires ? { reasoningEfforts: model.wires } : {}),
    };
    const models = existing ? rows.map((m) => m.id === modelId ? row : m) : [...rows, row];
    const ops = [{ op: "set", path: [...entry.settingsPath, "models"], value: models }];
    if (override && effort !== null && model.wires)
      ops.push({ op: "set", path: [...entry.settingsPath, "modelOverrides", modelId, "reasoningEfforts"], value: model.wires });
    await this.ctx.settings.mutate(entry.settingsNs, ops, profile.revision);
    return { changed: true };
  }
}
function safeError(error) {
  return /^(HTTP_\d{3}|INVALID_ENDPOINT|INVALID_MODEL_LIST|MISSING_CREDENTIAL|INVALID_CREDENTIAL_REFERENCE|REPLY_TOO_LARGE)$/.test(error?.message)
    ? error.message : "DISCOVERY_FAILED";
}
