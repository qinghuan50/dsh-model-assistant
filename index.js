var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/host.js
import z from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/catalog.js
import { createHash } from "node:crypto";
var LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
var text = (...values) => values.find((v) => typeof v === "string" && v.trim())?.trim();
var number = (...values) => values.find((v) => typeof v === "number" && Number.isFinite(v) && v >= 0);
var capacity = (...values) => values.find((v) => Number.isSafeInteger(v) && v > 0);
var boolean = (...values) => values.find((v) => typeof v === "boolean");
var present = (object) => Object.fromEntries(Object.entries(object).filter(([, v]) => v !== void 0));
function modelsUrl(baseURL) {
  const url = new URL(baseURL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error("INVALID_ENDPOINT");
  let path = url.pathname.replace(/\/+$/, "").replace(/\/(?:chat\/completions|responses|models)$/, "");
  url.pathname = `${path || "/v1"}/models`;
  return url.href;
}
function parseModels(body) {
  const entries = Array.isArray(body?.data) ? body.data.map((raw) => [void 0, raw]) : Array.isArray(body?.models) ? body.models.map((raw) => [void 0, raw]) : body?.models && typeof body.models === "object" ? Object.entries(body.models) : null;
  if (!entries || entries.length > 5e3) throw new Error("INVALID_MODEL_LIST");
  const seen = /* @__PURE__ */ new Set();
  return entries.flatMap(([key, raw]) => {
    if (!raw || typeof raw !== "object") return [];
    const id = text(key, raw.id);
    if (!id || id.length > 512 || seen.has(id)) return [];
    seen.add(id);
    const caps = raw.capabilities;
    const has = (name) => Array.isArray(caps) && caps.includes(name) ? true : void 0;
    const input = [raw.inputModalities, raw.input_modalities, raw.input, raw.modalities?.input, raw.architecture?.input_modalities].find((v) => Array.isArray(v) && v.length > 0);
    const levels = raw.reasoning_efforts ?? raw.reasoningEfforts ?? raw.supported_reasoning_efforts ?? raw.reasoning?.efforts ?? raw.reasoning?.levels ?? caps?.reasoning_efforts;
    const wires = {};
    const efforts = [];
    for (const level of LEVELS) {
      const entry = Array.isArray(levels) ? levels.find((v) => (typeof v === "string" ? v : v?.id) === level) : void 0;
      const wire = entry !== void 0 ? typeof entry === "string" ? entry : entry.value ?? entry.id : levels && typeof levels === "object" ? levels[level] : void 0;
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
      text: input ? input.includes("text") : void 0,
      vision: boolean(caps?.vision, caps?.image, raw.vision, input ? input.includes("image") : void 0, has("vision")),
      tools: boolean(caps?.tools, caps?.tool_calling, caps?.tool_call, caps?.function_calling, raw.tools, raw.tool_calling, raw.function_calling, raw.supports_tools, raw.supports_function_calling, has("tools"), has("tool_calling")),
      streaming: boolean(caps?.streaming, raw.streaming, raw.supports_streaming, has("streaming")),
      reasoning: boolean(typeof raw.reasoning === "boolean" ? raw.reasoning : raw.reasoning?.supported, raw.supports_reasoning, caps?.reasoning, has("reasoning"), hasEfforts ? true : void 0),
      inputMultiplier: number(raw.input_multiplier, raw.inputMultiplier, raw.multipliers?.input, raw.pricing?.input_multiplier),
      outputMultiplier: number(raw.output_multiplier, raw.outputMultiplier, raw.multipliers?.output, raw.pricing?.output_multiplier)
    });
    return [{
      id,
      name: text(raw.name, raw.display_name, raw.displayName)?.slice(0, 160),
      metadata,
      ...hasEfforts ? { reasoning: { efforts, ...efforts.some((v) => v.id === defaultEffort) ? { defaultEffort } : {} }, wires } : {},
      ...input ? { input: input.filter((v) => ["text", "image"].includes(v)) } : {}
    }];
  });
}
var ModelDiscovery = class {
  constructor(ctx, fetcher = fetch) {
    this.ctx = ctx;
    this.fetcher = fetcher;
    this.cache = /* @__PURE__ */ new Map();
    this.pending = /* @__PURE__ */ new Map();
    this.lifetime = new AbortController();
  }
  dispose() {
    this.lifetime.abort();
    this.cache.clear();
    this.pending.clear();
  }
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
    if (!force && cached && Date.now() - cached.fetchedAt < 3e5) return { ...cached, cached: true };
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
      const response = await this.fetcher(url, { headers, redirect: "error", signal: AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(15e3)]) });
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`HTTP_${response.status}`);
      }
      const limit = 8 * 1024 * 1024;
      if (Number(response.headers.get("content-length")) > limit) {
        await response.body?.cancel();
        throw new Error("REPLY_TOO_LARGE");
      }
      const reader = response.body.getReader();
      let size = 0;
      const chunks = [];
      try {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > limit) throw new Error("REPLY_TOO_LARGE");
          chunks.push(Buffer.from(part.value));
        }
      } finally {
        await reader.cancel().catch(() => {
        });
      }
      const result = { models: parseModels(JSON.parse(Buffer.concat(chunks).toString("utf8"))), fetchedAt: Date.now(), cached: false };
      this.cache.set(signature, result);
      this.ctx.logger?.info("model-assistant catalog: channel=%s models=%d elapsedMs=%d", entry.provider, result.models.length, Date.now() - started);
      return result;
    })();
    this.pending.set(signature, operation);
    try {
      return await operation;
    } catch (error) {
      this.ctx.logger?.warn?.("model-assistant catalog: channel=%s code=%s elapsedMs=%d", entry.provider, safeError(error), Date.now() - started);
      if (cached) return { ...cached, stale: true, code: safeError(error) };
      throw error;
    } finally {
      this.pending.delete(signature);
    }
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
          return { id: m.id, name: m.name, ...info.reasoning ? { reasoning: info.reasoning } : {} };
        }));
      } catch {
      }
      const entry = directory.find((e) => e.provider === provider.id);
      try {
        const live = entry ? await this.request(entry, force) : null;
        if (live) {
          if (live.stale) failures.push({ id: provider.id, code: live.code });
          const names = new Map(local.map((m) => [m.id, m.name]));
          return {
            id: provider.id,
            name: provider.name,
            source: live.stale ? "stale" : "live",
            fetchedAt: live.fetchedAt,
            cached: live.cached,
            models: live.models.map(({ wires, input, ...m }) => ({ ...m, name: m.name || names.get(m.id) || m.id }))
          };
        }
      } catch (error) {
        failures.push({ id: provider.id, code: safeError(error) });
      }
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
    const existing = previous ? { ...previous, ...override, id: modelId } : void 0;
    const row = {
      ...existing || { id: model.id, name: model.name || model.id },
      ...!existing ? present({ contextWindow: model.metadata.contextWindow, maxTokens: model.metadata.maxTokens, input: model.input?.length ? model.input : void 0 }) : {},
      ...effort !== null && model.wires ? { reasoningEfforts: model.wires } : {}
    };
    const models = existing ? rows.map((m) => m.id === modelId ? row : m) : [...rows, row];
    const ops = [{ op: "set", path: [...entry.settingsPath, "models"], value: models }];
    if (override && effort !== null && model.wires)
      ops.push({ op: "set", path: [...entry.settingsPath, "modelOverrides", modelId, "reasoningEfforts"], value: model.wires });
    await this.ctx.settings.mutate(entry.settingsNs, ops, profile.revision);
    return { changed: true };
  }
};
function safeError(error) {
  return /^(HTTP_\d{3}|INVALID_ENDPOINT|INVALID_MODEL_LIST|MISSING_CREDENTIAL|INVALID_CREDENTIAL_REFERENCE|REPLY_TOO_LARGE)$/.test(error?.message) ? error.message : "DISCOVERY_FAILED";
}

// src/host.js
var route = z.object({
  supplier: z.string(),
  contextWindow: z.number().step(1).min(1),
  maxTokens: z.number().step(1).min(1),
  inputMultiplier: z.number().min(0),
  outputMultiplier: z.number().min(0),
  reasoning: z.boolean(),
  text: z.boolean(),
  tools: z.boolean(),
  vision: z.boolean(),
  streaming: z.boolean()
});
var Config = z.object({
  enabled: z.boolean().default(true).volatile(),
  showSidebar: z.boolean().default(true).volatile(),
  metadata: z.dict(route).default({}).volatile()
});
var _prepare_dec, _catalog_dec, _a, _init;
var ModelAssistantService = class extends (_a = TypertRemoteService, _catalog_dec = [Remote], _prepare_dec = [Remote], _a) {
  constructor(ctx) {
    super(ctx, "modelAssistant");
    __runInitializers(_init, 5, this);
    this.discovery = new ModelDiscovery(ctx);
    ctx.effect(() => () => this.discovery.dispose());
  }
  async catalog(force) {
    return this.discovery.catalog(force);
  }
  async prepare(provider, modelId, effort) {
    try {
      return await this.discovery.prepare(provider, modelId, effort);
    } catch {
      throw new Error("MODEL_PREPARATION_FAILED");
    }
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "catalog", _catalog_dec, ModelAssistantService);
__decorateElement(_init, 1, "prepare", _prepare_dec, ModelAssistantService);
__decoratorMetadata(_init, ModelAssistantService);
__publicField(ModelAssistantService, "inject", ["settings", "llm", "credentials"]);
var inject = ["settings", "llm", "credentials"];
function apply(ctx) {
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber));
  ctx.plugin(ModelAssistantService);
  ctx.inject(["tools", "modelAssistant"], (child) => {
    child.tools.register({
      name: "model_assistant_catalog",
      description: "Read configured providers' sanitized /v1/models catalog, or prepare one advertised model for native selection. Never returns API keys or headers.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: ["action"],
        properties: {
          action: { type: "string", enum: ["list", "prepare"] },
          force: { type: "boolean" },
          provider: { type: "string" },
          modelId: { type: "string" },
          effort: { type: "string" }
        }
      },
      output: { schema: { type: "string" }, render: (_args, value) => [{ type: "text", text: value }] },
      isConcurrencySafe: (args) => args.action === "list",
      async execute(args) {
        if (!["list", "prepare"].includes(args.action)) throw new Error("INVALID_ACTION");
        const result = args.action === "prepare" ? await child.modelAssistant.prepare(args.provider, args.modelId, args.effort === "default" ? null : args.effort ?? null) : await child.modelAssistant.catalog(args.force ?? false);
        return JSON.stringify(result);
      }
    });
  });
}
export {
  Config,
  apply,
  inject
};
