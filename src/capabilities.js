const DEFAULT_EFFORTS = { off: null, low: "low", medium: "medium", high: "high" };
const MODALITIES = ["text", "image"];
const clean = (value) => Object.fromEntries(Object.entries(value || {}).filter(([, field]) => field !== undefined));
const validWires = (value) => value && typeof value === "object" && !Array.isArray(value) && Object.entries(value).some(([key, wire]) => key !== "off" && typeof wire === "string" && wire.length > 0);

/** Match the host's input checkboxes and reasoning switch using endpoint facts, never web/manual references. */
export function capabilityPatch(model, configured, api) {
  const patch = {};
  const metadata = model.metadata || {};
  const input = model.input?.filter((value) => MODALITIES.includes(value));
  if (input?.length) patch.input = input;
  else if (typeof metadata.vision === "boolean" || typeof metadata.text === "boolean") {
    const previous = configured.input?.length ? configured.input : ["text"];
    const next = MODALITIES.filter((value) => {
      const supported = metadata[value === "image" ? "vision" : "text"];
      return typeof supported === "boolean" ? supported : previous.includes(value);
    });
    if (next.length) patch.input = next;
  }
  if (metadata.reasoning === false) patch.reasoningEfforts = false;
  else if (metadata.reasoning === true) {
    if (validWires(configured.reasoningEfforts)) patch.reasoningEfforts = { ...configured.reasoningEfforts };
    else if (validWires(model.wires)) patch.reasoningEfforts = { ...model.wires };
    // These are exactly the mappings the host creates when its OpenAI-compatible switch is enabled.
    else if (["openai-completions", "openai-responses"].includes(api)) patch.reasoningEfforts = { ...DEFAULT_EFFORTS };
  }
  return patch;
}

/** Plan narrow updates for already configured rows; only explicit model selection may add a row. */
export function capabilityOperations(entry, profile, advertised, { addModelId, inherited = [], enabled = true } = {}) {
  const models = Array.isArray(profile?.models) ? profile.models : [];
  const updates = [];
  const catalog = new Map(advertised.map((model) => [model.id, model]));
  let rows = models;
  if (addModelId && !models.some((model) => model.id === addModelId)) {
    const model = catalog.get(addModelId);
    if (!model) throw new Error("MODEL_NOT_ADVERTISED");
    const base = models.length ? models : inherited.map((model) => ({ id: model.id, name: model.name }));
    const previous = base.find((row) => row.id === addModelId);
    rows = previous ? base : [...base, { id: model.id, name: model.name || model.id,
      ...clean({ contextWindow: model.metadata?.contextWindow, maxTokens: model.metadata?.maxTokens }) }];
  }
  rows = rows.map((row, index) => {
    const model = catalog.get(row.id);
    if (!model || !enabled || addModelId && row.id !== addModelId) return row;
    const override = clean(profile?.modelOverrides?.[row.id]);
    const configured = { ...clean(row), ...override };
    const patch = capabilityPatch(model, configured, profile?.api);
    const next = { ...row, ...patch };
    for (const [field, value] of Object.entries(patch)) {
      if (JSON.stringify(row[field]) !== JSON.stringify(value)) updates.push({ op: "set", path: [...entry.settingsPath, "models", String(index), field], value });
      if (Object.hasOwn(override, field) && JSON.stringify(override[field]) !== JSON.stringify(value))
        updates.push({ op: "set", path: [...entry.settingsPath, "modelOverrides", row.id, field], value });
    }
    return next;
  });
  if (addModelId && !models.some((model) => model.id === addModelId)) {
    // Materializing inherited rows must preserve native request controls, not just their display names.
    return [{ op: "set", path: [...entry.settingsPath, "models"], value: rows }, ...updates.filter((op) => op.path[entry.settingsPath.length] === "modelOverrides")];
  }
  return updates;
}

/** UI capabilities come from the exact route the host will use for request admission and dispatch. */
export function effectiveCapabilities(info) {
  const input = info?.inputModalities;
  return {
    ...(info?.context?.contextWindow ? { contextWindow: info.context.contextWindow } : {}),
    ...(info?.defaultMaxTokens ? { maxTokens: info.defaultMaxTokens } : {}),
    ...(input?.length ? { text: input.includes("text"), vision: input.includes("image") } : { vision: false }),
    reasoning: !!info?.reasoning?.efforts?.some((effort) => effort.id !== "off"),
  };
}
