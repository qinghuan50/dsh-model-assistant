const STORAGE_KEY = "local-model-assistant:picker-filters:v1";
export const EMPTY_FILTERS = Object.freeze({ kind: "", channel: "", supplier: "", capability: "", minContext: "" });

function normalizeFilters(value) {
  const filters = { ...EMPTY_FILTERS };
  if (!value || typeof value !== "object" || Array.isArray(value)) return filters;
  for (const field of ["channel", "supplier"])
    if (typeof value[field] === "string" && value[field].length <= 512) filters[field] = value[field];
  if (["official", "thirdParty", "custom"].includes(value.kind)) filters.kind = value.kind;
  if (["text", "reasoning", "tools", "vision", "streaming"].includes(value.capability)) filters.capability = value.capability;
  if (["64000", "128000", "1000000"].includes(value.minContext)) filters.minContext = value.minContext;
  if (filters.kind === "official") { filters.channel = ""; filters.supplier = ""; }
  return filters;
}

/** Remember only this browser's picker filters; search text and model/request settings are excluded. */
export function readPickerFilters() {
  try { return normalizeFilters(JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || "null")); }
  catch { return { ...EMPTY_FILTERS }; }
}

/** Storage restrictions must not prevent opening or filtering the model directory. */
export function savePickerFilters(filters) {
  try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalizeFilters(filters))); }
  catch { /* The mounted picker still retains its in-memory filters. */ }
}
