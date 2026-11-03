import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import css from "./styles.css";

const NS = "local-model-assistant";
const PANEL = "local-model-assistant";
class ViewBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <div className="ma-error" role="alert">
        Model Assistant: {String(this.state.error?.message || this.state.error)}
      </div>
    ) : (
      this.props.children
    );
  }
}
const dictionaries = {
  zh: {
    title: "模型助手",
    intro: "管理聊天框中的模型信息展示与筛选功能。",
    back: "返回对话",
    enabled: "启用模型助手",
    enabledHint: "展示渠道、厂商、上下文、倍率与能力，并支持分类筛选。",
    sidebar: "在侧栏显示入口",
    sidebarHint: "隐藏后仍可从设置中的「模型助手」进入。",
    saved: "设置自动保存。关闭功能后使用宿主原有模型选择器。",
    loading: "正在加载…",
    unavailable: "插件设置不可用，请在插件页检查加载状态。",
    saveFailed: "保存失败，请重试。",
    search: "搜索模型、渠道、厂商…",
    clear: "清空搜索",
    channels: "全部渠道",
    suppliers: "全部厂商",
    capability: "能力",
    context: "上下文",
    capacity: "上下文 / 最大输出",
    maxTokens: "最大输出（token）",
    maxInputTokens: "最大输入（token）",
    inputLimit: "输入上限",
    route: "模型与来源",
    ratio: "倍率（入 / 出）",
    unknown: "未知",
    unknownSupplier: "未知厂商",
    reasoning: "深度推理",
    tools: "工具调用",
    vision: "图像理解",
    text: "文本",
    streaming: "流式输出",
    empty: "没有匹配的模型",
    reset: "重置筛选",
    select: "选择模型",
    close: "关闭模型选择",
    retry: "重试",
    error: "操作失败，请重试。",
    selectFailed: "选模失败，未改变当前模型。",
    defaultEffort: "默认",
    providerDefault: "default",
    refresh: "刷新接口模型列表",
    liveCatalog: "接口模型列表",
    fallbackCatalog: "部分渠道请求失败，正在使用缓存或本地参考资料。",
    unlistedCurrent: "当前模型未在最新接口列表中，当前会话选择仍保留。",
    sourceLive: "/v1/models",
    sourceStale: "接口缓存（请求失败）",
    noEfforts: "当前模型未配置推理等级，可在宿主「设置 → 模型」中配置。",
    effort: "推理等级",
    foot: "倍率相对于各渠道基准，非最终单价；未知资料未做推断。",
    metadata: "补充模型资料",
    metadataHint:
      "按渠道和模型 ID 单独保存；仅用于展示与筛选，不会改变请求路由或计费。",
    chooseRoute: "选择模型路线",
    supplier: "供应厂商",
    contextTokens: "上下文（token）",
    inputMultiplier: "输入倍率",
    outputMultiplier: "输出倍率",
    saveMetadata: "保存模型资料",
    metadataSaved: "模型资料已保存",
    positive: "上下文和最大输出需为正整数，倍率需为非负数。",
    supported: "支持",
    unsupported: "不支持",
    source: "资料来源",
    sourceHost: "宿主配置",
    sourceManual: "手动资料",
    sourceUnknown: "未提供",
    metadataEmpty: "当前没有可用模型路线。",
    loadFailed: "模型目录加载失败。",
    all: "全部",
    name: "模型名",
    openSettings: "模型助手设置",
  },
  en: {
    title: "Model Assistant",
    intro: "Manage model information and filters in the chat composer.",
    back: "Back to chat",
    enabled: "Enable Model Assistant",
    enabledHint:
      "Show channel, supplier, context, multipliers and capabilities with filters.",
    sidebar: "Show sidebar entry",
    sidebarHint: "If hidden, open Model Assistant from Settings.",
    saved:
      "Changes save automatically. Turning this off restores the native model selector.",
    loading: "Loading…",
    unavailable: "Plugin settings are unavailable. Check the plugin inventory.",
    saveFailed: "Could not save. Please retry.",
    search: "Search models, channels, suppliers…",
    clear: "Clear search",
    channels: "All channels",
    suppliers: "All suppliers",
    capability: "Capability",
    context: "Context",
    capacity: "Context / max output",
    maxTokens: "Max output (tokens)",
    maxInputTokens: "Max input (tokens)",
    inputLimit: "Max input",
    route: "Model and source",
    ratio: "Multipliers (in / out)",
    unknown: "Unknown",
    unknownSupplier: "Unknown supplier",
    reasoning: "Reasoning",
    tools: "Tools",
    vision: "Vision",
    text: "Text",
    streaming: "Streaming",
    empty: "No matching models",
    reset: "Reset filters",
    select: "Select model",
    close: "Close model selection",
    retry: "Retry",
    error: "Operation failed. Please retry.",
    selectFailed: "Selection failed; the active model was not changed.",
    defaultEffort: "Default",
    providerDefault: "default",
    refresh: "Refresh endpoint models",
    liveCatalog: "Endpoint model catalog",
    fallbackCatalog: "Some endpoints failed. Cached or local reference data is shown.",
    unlistedCurrent: "The current model is absent from the latest endpoint list. The session selection is retained.",
    sourceLive: "/v1/models",
    sourceStale: "Endpoint cache (request failed)",
    noEfforts: "No reasoning levels are configured for this model. Configure them in Settings → Models.",
    effort: "Reasoning effort",
    foot: "Multipliers use each channel’s own base rate, not final prices. Missing metadata is unknown.",
    metadata: "Add model metadata",
    metadataHint:
      "Saved per channel and model ID. Display and filtering only; routing and billing are unchanged.",
    chooseRoute: "Model route",
    supplier: "Supplier",
    contextTokens: "Context (tokens)",
    inputMultiplier: "Input multiplier",
    outputMultiplier: "Output multiplier",
    saveMetadata: "Save metadata",
    metadataSaved: "Metadata saved",
    positive: "Context and max output must be positive integers and multipliers nonnegative.",
    supported: "Supported",
    unsupported: "Unsupported",
    source: "Metadata source",
    sourceHost: "Host configuration",
    sourceManual: "Manual metadata",
    sourceUnknown: "Not provided",
    metadataEmpty: "No model routes are available.",
    loadFailed: "Could not load the model catalog.",
    all: "All",
    name: "Model name",
    openSettings: "Model Assistant settings",
  },
};

function Icon({ kind = "box", size = 18, ...props }) {
  const paths = {
    box: "m12 3 9 5v9l-9 5-9-5V8Zm-9 5 9 5 9-5M12 13v9",
    down: "m6 9 6 6 6-6",
    back: "m10 5-7 7 7 7M3 12h18",
    check: "m5 12 4 4L19 6",
    tools: "m14 6 4-3 3 3-3 4-3-1-8 10-3-3 9-8-1-3Z",
    reasoning:
      "M8 4a3 3 0 0 0-5 3 4 4 0 0 0 0 7 3 3 0 0 0 5 5m8-15a3 3 0 0 1 5 3 4 4 0 0 1 0 7 3 3 0 0 1-5 5M9 3v18m6-18v18M3 9h4m-4 6h4m10-6h4m-4 6h4",
    vision: "M3 5h18v14H3Zm0 10 5-5 5 5 3-3 5 5M16 8h.01",
    streaming: "m13 2-9 12h7l-1 8 10-13h-7Z",
    info: "M12 11v6m0-10v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    close: "m6 6 12 12M6 18 18 6",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[kind] || paths.box} />
    </svg>
  );
}
const keyOf = (provider, model) => JSON.stringify([provider, model]);
const knownNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);
const formatContext = (value) =>
  !knownNumber(value)
    ? null
    : value >= 1000000
      ? `${+(value / 1000000).toFixed(2)}M`
      : value >= 1000
        ? `${+(value / 1000).toFixed(1)}K`
        : String(value);

/** Read exact-route capacities and input types; supplier is the ID prefix defined by the channel. */
function metadataOf(group, model, prefs, hostDocument) {
  let configured, input;
  for (const section of hostDocument?.view?.namespaces || []) {
    const provider = section.value?.providers?.[group.id];
    if (
      !provider ||
      (!Array.isArray(provider.models) && !provider.modelOverrides)
    )
      continue;
    const candidate =
      provider.models?.find((item) => item.id === model.id) ??
      provider.modelOverrides?.[model.id];
    if (candidate) {
      configured = candidate;
      // The settings mirror can expose an unset array as []; the native editor treats it as inherited.
      input = [candidate.input, provider.defaultInput].find(
        (value) => Array.isArray(value) && value.length > 0,
      );
      break;
    }
  }
  const manual = prefs?.metadata?.[keyOf(group.id, model.id)] || {};
  const info = {
    ...(configured?.contextWindow === undefined
      ? {}
      : { contextWindow: configured.contextWindow }),
    ...(configured?.maxTokens === undefined
      ? {}
      : { maxTokens: configured.maxTokens }),
    ...(input === undefined
      // Match the host editor's text floor; do not infer image support for an inherited model.
      ? configured
        ? { text: true }
        : {}
      : {
          text: input.includes("text"),
          vision: input.includes("image"),
        }),
    ...(model.reasoning
      ? { reasoning: true }
      : configured?.reasoningEfforts === false
        ? { reasoning: false }
        : {}),
    ...manual,
    ...model.metadata,
  };
  const slash = model.id.indexOf("/");
  const prefix = slash > 0 ? model.id.slice(0, slash).trim() : undefined;
  info.supplier =
    group.source === "live" || group.source === "stale" ? prefix : typeof info.supplier === "string" && info.supplier.trim()
      ? info.supplier.trim()
      : prefix;
  info.source = group.source === "live" ? "sourceLive" : group.source === "stale" ? "sourceStale" : Object.keys(manual).length
    ? "sourceManual"
    : configured || model.reasoning || prefix
      ? "sourceHost"
      : "sourceUnknown";
  info.contextSource = model.metadata?.contextWindow !== undefined ? info.source : manual.contextWindow !== undefined ? "sourceManual" : "sourceHost";
  info.outputSource = model.metadata?.maxTokens !== undefined ? info.source : manual.maxTokens !== undefined ? "sourceManual" : "sourceHost";
  return info;
}
function RouteBadges({ group, info, t }) {
  return (
    <span className="ma-badges">
      <span className="ma-badge ma-channel" title={group.id}>
        {group.name}
      </span>
      <span className="ma-badge">{info.supplier || t("unknownSupplier")}</span>
    </span>
  );
}
function Capabilities({ info, t, icons = false }) {
  const keys = ["text", "reasoning", "tools", "vision", "streaming"];
  const supported = keys.filter((key) => info[key] === true && (!icons || key !== "text"));
  const title = keys
    .map(
      (key) =>
        `${t(key)}: ${info[key] === undefined ? t("unknown") : info[key] ? t("supported") : t("unsupported")}`,
    )
    .join("\n");
  return (
    <span className={icons ? "ma-cap-icons" : "ma-caps"} title={title}>
      {supported.length ? (
        supported.map((key) =>
          icons ? (
            <Icon key={key} kind={key} size={15} />
          ) : (
            <span key={key}>{t(key)}</span>
          ),
        )
      ) : icons ? null : (
        <small>{t("unknown")}</small>
      )}
    </span>
  );
}

/** Only advertise Host-declared effort IDs; an empty value clears an explicit effort. */
function ReasoningSelect({ reasoning, effort, disabled, onChange, t, compact = false }) {
  return (
    <select
      className={compact ? "ma-effort-compact" : undefined}
      aria-label={t("effort")}
      title={t("effort")}
      disabled={disabled}
      value={effort ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      {reasoning.defaultEffort === undefined ? (
        <option value="">{t("providerDefault")}</option>
      ) : null}
      {reasoning.efforts.map((item) => (
        <option key={item.id} value={item.id} title={item.description}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

function MetadataEditor({ form, usePreferences, loadCatalog, t }) {
  const settings = usePreferences((s) => s);
  const [catalog, setCatalog] = useState(null);
  const [routeKey, setRouteKey] = useState("");
  const [draft, setDraft] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    Promise.resolve()
      .then(loadCatalog)
      .then((result) => {
        if (!live) return;
        if (!result.ok) {
          setMessage(t("loadFailed"));
          return;
        }
        setCatalog(result.value);
      })
      .catch(() => {
        if (live) setMessage(t("loadFailed"));
      });
    return () => {
      live = false;
    };
  }, [loadCatalog, t]);
  const routes = (catalog?.groups || []).flatMap((group) =>
    group.models.map((model) => ({
      group,
      model,
      key: keyOf(group.id, model.id),
    })),
  );
  const chosen = routeKey || routes[0]?.key || "";
  useEffect(() => {
    setDraft(settings.value?.metadata?.[chosen] || {});
  }, [chosen, settings.value?.metadata]);
  useEffect(() => { setMessage(""); }, [chosen]);
  const edit = (name, value) => {
    setDraft((old) => ({ ...old, [name]: value }));
    setMessage("");
  };
  async function save() {
    const value = {};
    if (String(draft.supplier || "").trim())
      value.supplier = String(draft.supplier).trim();
    for (const name of [
      "contextWindow",
      "maxTokens",
      "inputMultiplier",
      "outputMultiplier",
    ]) {
      if (draft[name] === undefined || draft[name] === "") continue;
      const n = Number(draft[name]);
      if (
        !Number.isFinite(n) ||
        n < 0 ||
        (["contextWindow", "maxTokens"].includes(name) && (!Number.isInteger(n) || n === 0))
      ) {
        setMessage(t("positive"));
        return;
      }
      value[name] = n;
    }
    for (const name of ["text", "reasoning", "tools", "vision", "streaming"])
      if (draft[name] === true || draft[name] === false)
        value[name] = draft[name];
    setBusy(true);
    try {
      const ok = await form.mutate([
        { op: "set", path: ["metadata", chosen], value },
      ]);
      setMessage(t(ok ? "metadataSaved" : "saveFailed"));
    } catch {
      setMessage(t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="ma-editor">
      <summary>{t("metadata")}</summary>
      <p>{t("metadataHint")}</p>
      {!catalog ? (
        <p role="status">{message || t("loading")}</p>
      ) : !routes.length ? (
        <p>{t("metadataEmpty")}</p>
      ) : (
        <>
          <label className="ma-field">
            {t("chooseRoute")}
            <select
              value={chosen}
              onChange={(e) => setRouteKey(e.target.value)}
            >
              {routes.map(({ key, group, model }) => (
                <option key={key} value={key}>
                  {group.name} / {model.name} · {model.id}
                </option>
              ))}
            </select>
          </label>
          <div className="ma-fields">
            {[
              "supplier",
              "contextWindow",
              "maxTokens",
              "inputMultiplier",
              "outputMultiplier",
            ].map((name) => (
              <label key={name} className="ma-field">
                {t(name === "contextWindow" ? "contextTokens" : name)}
                <input
                  type={name === "supplier" ? "text" : "number"}
                  min={["contextWindow", "maxTokens"].includes(name) ? 1 : 0}
                  step={["contextWindow", "maxTokens"].includes(name) ? 1 : "any"}
                  placeholder={t("unknown")}
                  value={draft[name] ?? ""}
                  onChange={(e) => edit(name, e.target.value)}
                />
              </label>
            ))}
            {["text", "reasoning", "tools", "vision", "streaming"].map((name) => (
              <label key={name} className="ma-field">
                {t(name)}
                <select
                  value={
                    draft[name] === true
                      ? "yes"
                      : draft[name] === false
                        ? "no"
                        : "unknown"
                  }
                  onChange={(e) =>
                    edit(
                      name,
                      e.target.value === "unknown"
                        ? undefined
                        : e.target.value === "yes",
                    )
                  }
                >
                  <option value="unknown">{t("unknown")}</option>
                  <option value="yes">{t("supported")}</option>
                  <option value="no">{t("unsupported")}</option>
                </select>
              </label>
            ))}
          </div>
          <button
            className="ma-primary"
            disabled={busy || !settings.writable}
            onClick={save}
          >
            {t("saveMetadata")}
          </button>
          {message ? <p role="status">{message}</p> : null}
        </>
      )}
    </details>
  );
}

function SettingsPage({ usePreferences, form, back, loadCatalog, t }) {
  const state = usePreferences((s) => s);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function toggle(field) {
    setBusy(true);
    setError("");
    try {
      if (!(await form.set(field, !state.value[field])))
        setError(t("saveFailed"));
    } catch {
      setError(t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="ma-page" aria-label={t("openSettings")}>
      <div className="ma-page-content">
        <button className="ma-back" onClick={back}>
          <Icon kind="back" />
          {t("back")}
        </button>
        <h1>{t("openSettings")}</h1>
        <p className="ma-intro">{t("intro")}</p>
        {state.status !== "ready" ? (
          <p role="status">
            {t(state.status === "loading" ? "loading" : "unavailable")}
          </p>
        ) : (
          <>
            <div className="ma-settings">
              {[
                ["enabled", "enabled", "enabledHint"],
                ["showSidebar", "sidebar", "sidebarHint"],
              ].map(([field, label, hint]) => (
                <div className="ma-setting-row" key={field}>
                  <div>
                    <span id={`ma-${field}`}>{t(label)}</span>
                    <p id={`ma-${field}-hint`}>{t(hint)}</p>
                  </div>
                  <button
                    role="switch"
                    aria-labelledby={`ma-${field}`}
                    aria-describedby={`ma-${field}-hint`}
                    aria-checked={state.value[field]}
                    disabled={busy || !state.writable}
                    onClick={() => toggle(field)}
                    className="ma-switch"
                  >
                    <span />
                  </button>
                </div>
              ))}
            </div>
            <p className="ma-note">{t("saved")}</p>
            {error ? (
              <p className="ma-error" role="alert">
                {error}
              </p>
            ) : null}
            <MetadataEditor
              usePreferences={usePreferences}
              form={form}
              loadCatalog={loadCatalog}
              t={t}
            />
          </>
        )}
      </div>
    </section>
  );
}

function ModelSeat({
  locked,
  available,
  useDirectory,
  usePreferences,
  useHostSettings,
  load,
  loadRemote,
  prepare,
  select,
  t,
}) {
  const nativeState = useDirectory((s) => s),
    preferences = usePreferences((s) => s.value),
    hostSettings = useHostSettings((s) => s);
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [channel, setChannel] = useState(""),
    [supplier, setSupplier] = useState(""),
    [capability, setCapability] = useState(""),
    [minContext, setMinContext] = useState(""),
    [error, setError] = useState(""),
    [position, setPosition] = useState(null),
    [active, setActive] = useState(-1);
  const [remoteCatalog, setRemoteCatalog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const requestSeq = useRef(0);
  const state = { ...nativeState, groups: remoteCatalog?.groups ?? nativeState.groups };
  const trigger = useRef(null),
    menu = useRef(null),
    search = useRef(null),
    rows = useRef([]);
  useEffect(() => {
    if (available) load().catch(() => setError(t("loadFailed")));
  }, [available, load, t]);
  useEffect(() => {
    if (!available) return;
    const seq = ++requestSeq.current;
    const abort = new AbortController();
    loadRemote(false, abort.signal).then((result) => {
      if (!abort.signal.aborted && requestSeq.current === seq) {
        if (result.ok) setRemoteCatalog(result.value);
        else setError(t("loadFailed"));
      }
    }).catch(() => { if (!abort.signal.aborted && requestSeq.current === seq) setError(t("loadFailed")); });
    return () => { abort.abort(); requestSeq.current++; };
  }, [available, loadRemote, t]);
  async function refreshRemote(force) {
    const seq = ++requestSeq.current;
    setRefreshing(true);
    try {
      const result = await loadRemote(force);
      if (requestSeq.current !== seq) return;
      if (result.ok) { setRemoteCatalog(result.value); setError(""); }
      else setError(t("loadFailed"));
    } catch { if (requestSeq.current === seq) setError(t("loadFailed")); }
    finally { if (requestSeq.current === seq) setRefreshing(false); }
  }
  useEffect(() => {
    if (!open) return;
    const outside = (e) => {
      if (
        !menu.current?.contains(e.target) &&
        !trigger.current?.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    const frame = requestAnimationFrame(() => search.current?.focus());
    return () => {
      document.removeEventListener("pointerdown", outside);
      cancelAnimationFrame(frame);
    };
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (!trigger.current || !menu.current) return;
      const r = trigger.current.getBoundingClientRect(),
        w = menu.current.offsetWidth,
        h = menu.current.offsetHeight;
      setPosition({
        left: Math.max(12, Math.min(r.right - w, innerWidth - w - 12)),
        top: Math.max(12, Math.min(r.top - h - 8, innerHeight - h - 12)),
      });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(menu.current);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);
  const all = useMemo(
    () =>
      state.groups.flatMap((group) =>
        group.models.map((model) => ({
          group,
          model,
          info: metadataOf(group, model, preferences, hostSettings),
          key: keyOf(group.id, model.id),
        })),
      ),
    [state.groups, preferences, hostSettings],
  );
  let current = all.find(
    (row) =>
      row.group.id === state.current?.provider &&
      row.model.id === state.current.model,
  );
  if (!current && nativeState.current) {
    const group = nativeState.groups.find((g) => g.id === nativeState.current.provider);
    const model = group?.models.find((m) => m.id === nativeState.current.model);
    if (group && model) current = { group, model: { id: model.id, name: model.name }, info: metadataOf(group, model, preferences, hostSettings), unlisted: true };
  }
  const reasoning = current?.model.reasoning;
  const effectiveEffort = reasoning?.efforts.some((e) => e.id === state.current?.reasoningEffort)
    ? state.current.reasoningEffort : reasoning?.defaultEffort;
  const q = query.trim().toLowerCase();
  const filtered = all.filter(
    (row) =>
      (!q ||
        `${row.group.name} ${row.group.id} ${row.model.name} ${row.model.id} ${row.info.supplier || ""}`
          .toLowerCase()
          .includes(q)) &&
      (!channel || row.group.id === channel) &&
      (!supplier || (row.info.supplier || "__unknown") === supplier) &&
      (!capability || row.info[capability] === true) &&
      (!minContext ||
        (knownNumber(row.info.contextWindow) &&
          row.info.contextWindow >= Number(minContext))),
  );
  useEffect(() => {
    setActive(-1);
  }, [query, channel, supplier, capability, minContext]);
  if (!available) return null;
  const busy = state.pending !== null || preparing;
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  async function choose(row, effort) {
    if (busy || locked) return;
    const same =
      state.current?.provider === row.group.id &&
      state.current.model === row.model.id;
    const reasoningEffort =
      !row.model.reasoning?.efforts.length || effort === null
        ? undefined
        : effort !== undefined
          ? effort
          : same
            ? effectiveEffort
            : row.model.reasoning?.defaultEffort;
    setError("");
    setPreparing(true);
    try {
      const ready = await prepare(row.group.id, row.model.id, reasoningEffort ?? null);
      if (!ready.ok) throw new Error("prepare failed");
      if (ready.value.changed) await load();
      const result = await select({
        provider: row.group.id,
        model: row.model.id,
        ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
      });
      if (result?.ok) close();
      else setError(t("selectFailed"));
    } catch {
      setError(t("selectFailed"));
    } finally { setPreparing(false); }
  }
  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
    if (e.target.tagName === "SELECT") return;
    if (["ArrowDown", "ArrowUp"].includes(e.key) && filtered.length) {
      e.preventDefault();
      const n =
        e.key === "ArrowDown"
          ? (active + 1) % filtered.length
          : active <= 0
            ? filtered.length - 1
            : active - 1;
      setActive(n);
      rows.current[n]?.focus();
    } else if (
      e.key === "Enter" &&
      e.target === search.current &&
      filtered.length
    ) {
      e.preventDefault();
      choose(filtered[Math.max(0, active)] || filtered[0]);
    }
  }
  const reset = () => {
    setQuery("");
    setChannel("");
    setSupplier("");
    setCapability("");
    setMinContext("");
  };
  const ratio = (n) => (knownNumber(n) ? `×${n}` : t("unknown"));
  const popup = (
    <div
      ref={menu}
      className="ma-menu"
      role="dialog"
      aria-label={t("select")}
      onKeyDown={onKeyDown}
      style={position || { left: 0, top: 0, visibility: "hidden" }}
    >
      <div className="ma-search">
        <Icon kind="search" />
        <input
          ref={search}
          aria-label={t("search")}
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button
            aria-label={t("clear")}
            onClick={() => {
              setQuery("");
              search.current?.focus();
            }}
          >
            <Icon kind="close" size={15} />
          </button>
        ) : null}
        <button aria-label={t("close")} onClick={close}>
          <Icon kind="close" size={16} />
        </button>
      </div>
      <div className="ma-filters">
        <button className="ma-text-button" disabled={refreshing || busy} onClick={() => refreshRemote(true)}>
          {refreshing ? t("loading") : t("refresh")}
        </button>
        <select
          aria-label={t("channels")}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="">{t("channels")}</option>
          {state.groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <select
          aria-label={t("suppliers")}
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        >
          <option value="">{t("suppliers")}</option>
          {[...new Set(all.map((row) => row.info.supplier || "__unknown"))].map(
            (value) => (
              <option key={value} value={value}>
                {value === "__unknown" ? t("unknownSupplier") : value}
              </option>
            ),
          )}
        </select>
        <select
          aria-label={t("capability")}
          value={capability}
          onChange={(e) => setCapability(e.target.value)}
        >
          <option value="">{t("capability")}</option>
          {["text", "reasoning", "tools", "vision", "streaming"].map((key) => (
            <option key={key} value={key}>
              {t(key)}
            </option>
          ))}
        </select>
        <select
          aria-label={t("context")}
          value={minContext}
          onChange={(e) => setMinContext(e.target.value)}
        >
          <option value="">{t("context")}</option>
          {[64000, 128000, 1000000].map((value) => (
            <option key={value} value={value}>
              ≥ {formatContext(value)}
            </option>
          ))}
        </select>
        {query || channel || supplier || capability || minContext ? (
          <button className="ma-text-button" onClick={reset}>
            {t("reset")}
          </button>
        ) : null}
      </div>
      <div className="ma-table-head">
        <span>{t("route")}</span>
        <span>{t("capacity")}</span>
        <span>{t("ratio")}</span>
        <span>{t("capability")}</span>
        <span />
      </div>
      <div className="ma-rows">
        {filtered.map((row, i) => {
          const selected =
            row.group.id === state.current?.provider &&
            row.model.id === state.current.model;
          return (
            <button
              ref={(node) => {
                rows.current[i] = node;
              }}
              key={row.key}
              className="ma-row"
              aria-pressed={selected}
              disabled={busy || locked}
              onFocus={() => setActive(i)}
              onClick={() => choose(row)}
              aria-label={`${row.model.name}, ${row.group.name}, ${row.info.supplier || t("unknownSupplier")}, ${row.model.id}`}
            >
              <span className="ma-model">
                <strong title={row.model.id}>{row.model.name}</strong>
                <RouteBadges group={row.group} info={row.info} t={t} />
              </span>
              <span
                className="ma-context"
                title={`${t("contextTokens")}: ${row.info.contextWindow ?? t("unknown")} (${t(row.info.contextSource)}) · ${t("maxInputTokens")}: ${row.info.maxInputTokens ?? t("unknown")} · ${t("maxTokens")}: ${row.info.maxTokens ?? t("unknown")} (${t(row.info.outputSource)})`}
              >
                {formatContext(row.info.contextWindow) || t("unknown")} /{" "}
                {formatContext(row.info.maxTokens) || t("unknown")}
                {knownNumber(row.info.maxInputTokens) ? <small className="ma-input-limit">{t("inputLimit")} {formatContext(row.info.maxInputTokens)}</small> : null}
              </span>
              <span className="ma-ratio">
                {ratio(row.info.inputMultiplier)} /{" "}
                {ratio(row.info.outputMultiplier)}
              </span>
              <Capabilities info={row.info} t={t} />
              <span className="ma-check">
                {selected ? <Icon kind="check" size={17} /> : null}
              </span>
            </button>
          );
        })}
        {!filtered.length ? (
          <div className="ma-empty" role="status">
            {state.status === "loading" ? t("loading") : t("empty")}
          </div>
        ) : null}
      </div>
      {error || state.error || state.failures.length > 0 ? (
        <div className="ma-error" role="alert">
          {error || state.error || t("loadFailed")}
          <button onClick={() => load().catch(() => setError(t("loadFailed")))}>
            {t("retry")}
          </button>
        </div>
      ) : null}
      {current ? (
        <div className="ma-effort">
          <span>{t("effort")}</span>
          <div className="ma-effort-choices" role="group" aria-label={t("effort")}>
            {[
              ...(reasoning?.defaultEffort === undefined
                ? [{ id: null, name: t("providerDefault") }]
                : []),
              ...(reasoning?.efforts || []),
            ].map((item) => (
              <button
                key={item.id ?? "provider-default"}
                disabled={busy || locked || current.unlisted}
                title={item.description}
                aria-label={`${t("effort")} ${item.name}`}
                aria-pressed={(effectiveEffort ?? null) === item.id}
                onClick={() => choose(current, item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {remoteCatalog?.failures.length ? <p className="ma-effort ma-effort-note" role="status">{t("fallbackCatalog")} {remoteCatalog.failures.map((f) => `${f.id}: ${f.code}`).join(" · ")}</p> : null}
      {current?.unlisted ? <p className="ma-effort ma-effort-note" role="status">{t("unlistedCurrent")}</p> : null}
      <p className="ma-foot">
        <Icon kind="info" size={14} />
        {t("foot")}
      </p>
    </div>
  );
  return (
    <span className="ma-seat">
      <button
        ref={trigger}
        className="ma-trigger"
        disabled={locked || busy}
        aria-label={`${t("select")}: ${current?.model.name || t("unknown")}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open) {
            reset();
            setPosition(null);
            refreshRemote(false);
          }
          setOpen((value) => !value);
        }}
      >
        <span>{current?.model.name || t("select")}</span>
        {current ? (
          <>
            <RouteBadges group={current.group} info={current.info} t={t} />
            <Capabilities info={current.info} t={t} icons />
          </>
        ) : null}
        <Icon kind="down" size={13} />
      </button>
      {current ? (
        <ReasoningSelect
          compact
          reasoning={reasoning || { efforts: [] }}
          effort={effectiveEffort}
          disabled={busy || locked || current.unlisted}
          onChange={(effort) => choose(current, effort)}
          t={t}
        />
      ) : null}
      {!open && error ? <span className="ma-seat-error" role="alert">{error}</span> : null}
      {open ? createPortal(popup, document.body) : null}
    </span>
  );
}

export const inject = [
  "slots",
  "locale",
  "layout",
  "configForms",
  "modelDirectories",
  "sessions",
  "remote",
  "remote.session",
  "connection",
];
export function apply(ctx) {
  ctx.effect(
    () => ctx.locale.register(NS, dictionaries),
    "model-assistant: locale",
  );
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.modelAssistant = "";
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, "model-assistant: styles");
  const t = ctx.locale.bind(NS),
    form = ctx.configForms.get(NS),
    mirror = ctx.configForms.describe();
  const loadRemote = (force = false, signal) => ctx.connection.rpc.call("/api", "modelAssistant/catalog", { args: { force } }, signal);
  const loadCatalog = () => loadRemote(false);
  ctx.slots.inject("main", () =>
    ctx.slots.register(
      {
        name: "main",
        key: PANEL,
        locale: NS,
        inject: () => ({
          hooks: { preferences: form },
          form,
          back: () => ctx.layout.selectPanel(null),
          loadCatalog,
        }),
      },
      (props) => (
        <ViewBoundary>
          <SettingsPage {...props} />
        </ViewBoundary>
      ),
    ),
  );
  ctx.slots.inject("settings.section", () =>
    ctx.slots.register(
      {
        name: "settings.section",
        id: PANEL,
        order: 80,
        label: () => t("title"),
        locale: NS,
        inject: () => ({ hooks: { preferences: form }, form, loadCatalog }),
      },
      (props) => <div className="ma-embedded-page"><ViewBoundary><SettingsPage {...props} back={() => { props.close(); ctx.layout.selectPanel(null); }} /></ViewBoundary></div>,
    ),
  );
  let removeSidebar, removeSeat;
  function reconcile() {
    const prefs = form.getSnapshot().value;
    if (!prefs) return;
    if (prefs.showSidebar && !removeSidebar)
      removeSidebar = ctx.slots.inject("sidebar.panellist", () =>
        ctx.slots.register(
          {
            name: "sidebar.panellist",
            id: PANEL,
            order: -5,
            label: () => t("title"),
            locale: NS,
          },
          ({ size }) => <Icon size={size} />,
        ),
      );
    if (!prefs.showSidebar && removeSidebar) {
      removeSidebar();
      removeSidebar = undefined;
    }
    if (prefs.enabled && !removeSeat)
      removeSeat = ctx.slots.inject("conversation.input.model", () =>
        ctx.slots.register(
          {
            name: "conversation.input.model",
            priority: -100,
            locale: NS,
            inject: (sessionId) => {
              const directory = ctx.modelDirectories.directoryFor(sessionId);
              return {
                available:
                  ctx.sessions.subagentAddress(sessionId) === undefined,
                hooks: {
                  directory: directory.store,
                  preferences: form,
                  hostSettings: mirror,
                },
                load: () => directory.load(),
                loadRemote,
                prepare: (provider, modelId, effort) => ctx.connection.rpc.call("/api", "modelAssistant/prepare", { args: { provider, modelId, effort } }),
                select: (selection) => directory.select(selection),
              };
            },
          },
          ModelSeat,
        ),
      );
    if (!prefs.enabled && removeSeat) {
      removeSeat();
      removeSeat = undefined;
    }
  }
  ctx.effect(() => {
    const unsubscribe = form.subscribe(reconcile);
    reconcile();
    return () => {
      unsubscribe();
      removeSeat?.();
      removeSidebar?.();
    };
  }, "model-assistant: owned registrations");
}
