/** Stable adapter route identities remain authoritative when an older Host omits source metadata. */
export const isOfficialProvider = (provider) => ["deepseek-account", "deepseek-official"].includes(provider);

/** Only adapter declarations or an explicit user choice classify non-official routes. */
export function providerKind(provider, entry, override) {
  if (isOfficialProvider(provider)) return "official";
  if (["official", "thirdParty", "custom"].includes(override)) return override;
  return entry?.declared === true ? "custom" : entry?.declared === false ? "thirdParty" : undefined;
}
