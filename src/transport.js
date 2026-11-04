/** Preserve the v1 directory RPC contract; optional research must never discard a successful directory. */
export async function loadCatalogRPC(rpc, force = false, signal, researchProvider = null, preferredModel = null) {
  const directory = await rpc.call("/api", "modelAssistant/catalog", { args: { force } }, signal);
  if (!directory.ok || !force || !researchProvider) return directory;
  const unavailable = (code) => ({ ...directory, value: { ...directory.value, research: { code } } });
  if (directory.value.version !== 2) return unavailable("HOST_RELOAD_REQUIRED");
  try {
    const result = await rpc.call("/api", "modelAssistant/refreshReferences", { args: { provider: researchProvider, preferredModel } }, signal);
    return result.ok ? result : unavailable("RESEARCH_FAILED");
  } catch { return unavailable("RESEARCH_FAILED"); }
}
