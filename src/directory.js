const keyOf = (provider, model) => JSON.stringify([provider, model]);

/** Track native route/config changes without depending on plugin reference saves or transient loading state. */
export function directoryVersion(groups, document) {
  return JSON.stringify([
    groups.map((group) => [group.id, group.name, group.models.map((model) => [model.id, model.name, model.reasoning])]),
    (document?.view?.namespaces || []).filter((section) => section.value?.providers)
      .map((section) => [section.ns, Object.entries(section.value.providers).map(([id, provider]) => [id,
        provider.api, provider.baseURL, provider.apiKeyEnv, provider.defaultInput, provider.models, provider.modelOverrides])]),
  ]);
}

/** Native groups own configured routes/controls; successful endpoint lists own advertised membership. */
export function reconcileDirectory(remote, nativeGroups, providerKinds, providerKind) {
  if (!remote) return nativeGroups.map((group) => ({ ...group,
    kind: providerKind(group.id, undefined, providerKinds?.[group.id]) ?? group.kind }));
  const native = new Map(nativeGroups.map((group) => [group.id, group]));
  return remote.groups.flatMap((group) => {
    const host = native.get(group.id);
    if (!host) return [];
    const kind = providerKind(group.id, undefined, providerKinds?.[group.id]) ?? group.kind;
    // A native-only directory must follow additions/removals immediately, not its previous RPC snapshot.
    if (group.source === "local") {
      const previous = new Map(group.models.map((model) => [model.id, model]));
      return [{ ...group, kind, name: host.name, models: host.models.map((model) => {
        const { reasoning, ...saved } = previous.get(model.id) || {};
        return { ...saved, ...model, effective: { ...saved.effective,
          reasoning: !!model.reasoning?.efforts?.some((effort) => effort.id !== "off") }, researchEligible: true };
      }) }];
    }
    const models = new Map(host.models.map((model) => [model.id, model]));
    return [{ ...group, kind, name: host.name, models: group.models.map((model) => {
      const resolved = models.get(model.id);
      const { reasoning, effective, ...rest } = model;
      // Removed/unprepared native routes must not retain image or reasoning badges from an old snapshot.
      return { ...rest, effective: resolved ? { ...effective,
        reasoning: !!resolved.reasoning?.efforts?.some((effort) => effort.id !== "off") }
        : { vision: false, reasoning: false }, researchEligible: !!resolved,
        ...(resolved?.reasoning ? { reasoning: resolved.reasoning } : {}) };
    }) }];
  }).concat(nativeGroups.filter((group) => !remote.groups.some((item) => item.id === group.id)).map((group) => ({
    ...group, source: "local", kind: providerKind(group.id, undefined, providerKinds?.[group.id]) ?? group.kind,
  })));
}

/** Retain session identity for removed models, but never advertise their previous usable controls. */
export function missingSelection(current, nativeGroups) {
  if (!current) return null;
  const group = nativeGroups.find((item) => item.id === current.provider);
  const model = group?.models.find((item) => keyOf(group.id, item.id) === keyOf(current.provider, current.model));
  return { group: group || { id: current.provider, name: current.provider, models: [] },
    model: { id: current.model, name: model?.name || current.model, effective: { vision: false, reasoning: false } },
    unlisted: true };
}
