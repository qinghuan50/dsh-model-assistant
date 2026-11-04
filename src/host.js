import z from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { ModelDiscovery } from "./catalog.js";

const route = z.object({
  supplier: z.string(), contextWindow: z.number().step(1).min(1), maxTokens: z.number().step(1).min(1),
  inputMultiplier: z.number().min(0), outputMultiplier: z.number().min(0),
  reasoning: z.boolean(), text: z.boolean(), tools: z.boolean(), vision: z.boolean(), streaming: z.boolean(),
  maxInputTokens: z.number().step(1).min(1), knowledgeCutoff: z.string(),
});
export const Config = z.object({
  enabled: z.boolean().default(true).volatile(),
  showSidebar: z.boolean().default(true).volatile(),
  metadata: z.dict(route).default({}).volatile(),
  providerKinds: z.dict(z.union(["official", "thirdParty", "custom"])).default({}).volatile(),
  researchModel: z.string().default("").volatile(),
  researchCheckedAt: z.dict(z.number()).default({}).volatile(),
  references: z.dict(z.object({
    metadata: route,
    sources: z.array(z.object({ field: z.string(), url: z.string(), title: z.string(), quote: z.string(), official: z.boolean() })),
    fetchedAt: z.number(),
  })).default({}).volatile(),
});

/** Authenticated Host RPC. Only configured endpoints and sanitized catalog fields are exposed. */
class ModelAssistantService extends TypertRemoteService {
  static inject = ["settings", "llm", "credentials"];
  constructor(ctx) {
    super(ctx, "modelAssistant");
    this.discovery = new ModelDiscovery(ctx);
    ctx.effect(() => () => this.discovery.dispose());
  }
  @Remote
  async catalog(force) { return this.discovery.catalog(force); }
  /** Explicit web research is separate from directory refresh to preserve older Client/Host compatibility. */
  @Remote
  async refreshReferences(provider, preferredModel) { return this.discovery.catalog(false, provider, preferredModel); }
  @Remote
  async prepare(provider, modelId, effort) {
    try { return await this.discovery.prepare(provider, modelId, effort); }
    catch { throw new Error("MODEL_PREPARATION_FAILED"); }
  }
}
export const inject = ["settings", "llm", "credentials"];
export function apply(ctx) {
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber));
  ctx.plugin(ModelAssistantService);
  ctx.inject(["tools", "modelAssistant"], (child) => {
    child.tools.register({
      name: "model_assistant_catalog",
      description: "Read configured providers' sanitized native or API model catalog, or prepare one advertised API model for native selection. Web research runs only on explicit UI refresh. Never returns API keys or headers.",
      parameters: {
        type: "object", additionalProperties: false, required: ["action"],
        properties: {
          action: { type: "string", enum: ["list", "prepare"] },
          force: { type: "boolean" }, provider: { type: "string" }, modelId: { type: "string" }, effort: { type: "string" },
        },
      },
      output: { schema: { type: "string" }, render: (_args, value) => [{ type: "text", text: value }] },
      isConcurrencySafe: (args) => args.action === "list",
      async execute(args) {
        if (!["list", "prepare"].includes(args.action)) throw new Error("INVALID_ACTION");
        const result = args.action === "prepare"
          ? await child.modelAssistant.prepare(args.provider, args.modelId, args.effort === "default" ? null : args.effort ?? null)
          : await child.modelAssistant.catalog(args.force ?? false);
        return JSON.stringify(result);
      },
    });
  });
}
