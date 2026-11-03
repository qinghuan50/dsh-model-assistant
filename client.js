window.__ModuleLoader__.load({id:'@local/dsh-model-assistant',factory(require){const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");

// src/styles.css
var styles_default = '.ma-page {\n  box-sizing: border-box;\n  height: 100%;\n  overflow: auto;\n  color: var(--dsw-alias-label-primary);\n  padding: calc(28px + var(--dsh-frame-top-clearance, 0px))\n    clamp(20px, 4vw, 48px) 48px;\n  font-size: 13px;\n}\n.ma-page-content {\n  max-width: 780px;\n  margin: 0 auto;\n}\n.ma-page h1 {\n  font-size: 22px;\n  font-weight: 500;\n  line-height: 30px;\n  margin: 24px 0 10px;\n}\n.ma-intro,\n.ma-note {\n  color: var(--dsw-alias-label-tertiary);\n  line-height: 1.7;\n}\n.ma-note {\n  font-size: 12px;\n  margin-top: 18px;\n}\n.ma-back {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  padding: 4px 0;\n  font: inherit;\n}\n.ma-settings {\n  margin-top: 28px;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 16px;\n}\n.ma-setting-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  padding: 24px;\n}\n.ma-setting-row + .ma-setting-row {\n  border-top: 0.5px solid var(--dsw-alias-border-l2);\n}\n.ma-setting-row > div {\n  min-width: 0;\n}\n.ma-setting-row > div > span {\n  font-size: 14px;\n  font-weight: 500;\n}\n.ma-setting-row p {\n  font-size: 12px;\n  line-height: 1.7;\n  margin: 8px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n}\n.ma-switch {\n  width: 42px;\n  height: 24px;\n  padding: 2px;\n  border: 0;\n  border-radius: 24px;\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  background: var(--dsw-alias-interactive-bg-hover);\n  cursor: pointer;\n}\n.ma-switch > span {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--dsw-alias-label-secondary);\n  transition: transform 0.15s;\n}\n.ma-switch[aria-checked="true"] {\n  background: var(--dsw-alias-state-business-primary);\n}\n.ma-switch[aria-checked="true"] > span {\n  transform: translateX(18px);\n  background: var(--dsw-alias-label-primary-foreground);\n}\n.ma-page button:disabled,\n.ma-menu button:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n.ma-page button:focus-visible,\n.ma-page input:focus-visible,\n.ma-page select:focus-visible,\n.ma-menu button:focus-visible,\n.ma-menu input:focus-visible,\n.ma-menu select:focus-visible,\n.ma-trigger:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n.ma-effort-compact:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n.ma-seat {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n}\n.ma-effort-compact {\n  max-width: 125px;\n  height: 28px;\n  background: none;\n  color: var(--dsw-alias-label-secondary);\n  border: 0;\n  border-radius: 6px;\n  padding: 2px 4px;\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n.ma-effort-compact:hover { background: var(--dsw-alias-interactive-bg-hover); }\n.ma-effort-compact:disabled { opacity: 0.55; cursor: default; }\n.ma-seat-error { color: var(--dsw-alias-state-error-primary); font-size: 11px; }\n.ma-trigger {\n  max-width: min(530px, 55cqw);\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  padding: 2px 4px 2px 8px;\n  border: 0;\n  border-radius: 6px;\n  height: 28px;\n  background: none;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  font-size: 13px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.ma-trigger > span:first-child {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ma-trigger:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.ma-trigger:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n.ma-badges {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ma-badge {\n  border: 0.5px solid var(--dsw-alias-border-l3);\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 5px;\n  padding: 1px 6px;\n  font-size: 11px;\n  line-height: 17px;\n  max-width: 150px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.ma-channel {\n  color: var(--dsw-alias-state-business-primary);\n  border-color: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 40%,\n    transparent\n  );\n  background: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 6%,\n    var(--dsw-alias-bg-base)\n  );\n}\n.ma-cap-icons {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  flex-shrink: 0;\n  color: var(--dsw-alias-label-caption);\n}\n.ma-menu {\n  box-sizing: border-box;\n  position: fixed;\n  z-index: 1200;\n  display: flex;\n  flex-direction: column;\n  width: min(900px, calc(100vw - 24px));\n  max-height: calc(100dvh - 32px);\n  padding: 16px 10px 0;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 16px;\n  box-shadow: var(--dsw-elevation-prominent);\n  font-size: 13px;\n  line-height: 1.5;\n}\n.ma-search {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin: 0 8px;\n  background: var(--dsw-alias-bg-module-platform);\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 9px;\n  padding: 8px 11px;\n  color: var(--dsw-alias-label-tertiary);\n  flex-shrink: 0;\n}\n.ma-search input {\n  min-width: 0;\n  flex: 1;\n  outline: 0 !important;\n  border: 0;\n  padding: 0;\n  background: none;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n}\n.ma-search button {\n  padding: 0;\n  background: none;\n  border: 0;\n  color: inherit;\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n}\n.ma-filters {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  flex-wrap: wrap;\n  padding: 15px 8px 17px;\n  flex-shrink: 0;\n}\n.ma-filters select {\n  max-width: 180px;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 18px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  padding: 5px 12px;\n  cursor: pointer;\n}\n.ma-table-head,\n.ma-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 125px 125px 140px 20px;\n  gap: 12px;\n  align-items: center;\n  padding: 10px 16px;\n}\n.ma-table-head {\n  font-size: 12px;\n  color: var(--dsw-alias-label-caption);\n  padding-top: 4px;\n  padding-bottom: 7px;\n}\n.ma-rows {\n  min-height: 0;\n  max-height: 340px;\n  overflow: auto;\n}\n.ma-row {\n  width: 100%;\n  background: none;\n  border: 0;\n  border-radius: 10px;\n  min-height: 56px;\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  text-align: left;\n}\n.ma-row:hover,\n.ma-row:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.ma-row[aria-pressed="true"] {\n  background: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 10%,\n    var(--dsw-alias-bg-base)\n  );\n}\n.ma-model {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-width: 0;\n}\n.ma-model strong {\n  font-weight: 500;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  min-width: 0;\n}\n.ma-context,\n.ma-ratio {\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n.ma-input-limit { display: block; font-size: 10px; color: var(--dsw-alias-label-caption); }\n.ma-caps {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  flex-wrap: wrap;\n}\n.ma-caps > span {\n  font-size: 11px;\n  line-height: 17px;\n  padding: 1px 5px;\n  border-radius: 6px;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n}\n.ma-caps small {\n  color: var(--dsw-alias-label-caption);\n  font-size: 12px;\n}\n.ma-check {\n  color: var(--dsw-alias-state-business-primary);\n  display: flex;\n  justify-content: center;\n}\n.ma-foot {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 11px;\n  color: var(--dsw-alias-label-caption);\n  margin: 8px 12px 0;\n  padding: 13px 0 15px;\n  border-top: 0.5px solid var(--dsw-alias-border-l2);\n  flex-shrink: 0;\n}\n.ma-foot svg {\n  flex-shrink: 0;\n}\n.ma-error {\n  padding: 10px;\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 12px;\n  overflow-wrap: anywhere;\n}\n.ma-error button {\n  margin-left: 12px;\n  color: inherit;\n  font: inherit;\n  background: none;\n  border: 0;\n  cursor: pointer;\n  text-decoration: underline;\n}\n.ma-empty {\n  text-align: center;\n  padding: 35px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.ma-effort {\n  padding: 9px 16px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n}\n.ma-effort-note {\n  color: var(--dsw-alias-label-caption);\n  font-size: 11px;\n  margin: 0;\n}\n.ma-effort-choices { display: flex; flex-wrap: wrap; gap: 6px; }\n.ma-effort-choices button {\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 7px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-secondary);\n  padding: 4px 10px;\n  font: inherit;\n  cursor: pointer;\n}\n.ma-effort-choices button[aria-pressed="true"] {\n  color: var(--dsw-alias-state-business-primary);\n  border-color: var(--dsw-alias-state-business-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, var(--dsw-alias-bg-base));\n}\n.ma-text-button {\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-state-business-primary);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n.ma-editor {\n  margin-top: 34px;\n  border-top: 0.5px solid var(--dsw-alias-border-l2);\n  padding-top: 20px;\n}\n.ma-editor summary {\n  cursor: pointer;\n  font-size: 14px;\n}\n.ma-editor > p {\n  color: var(--dsw-alias-label-tertiary);\n  line-height: 1.7;\n  font-size: 12px;\n}\n.ma-field {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n  margin-top: 16px;\n}\n.ma-field input,\n.ma-field select {\n  box-sizing: border-box;\n  min-width: 0;\n  width: 100%;\n  height: 34px;\n  font: inherit;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 7px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  padding: 5px 9px;\n}\n.ma-fields {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0 18px;\n}\n.ma-primary {\n  font: inherit;\n  font-size: 12px;\n  background: var(--dsw-alias-state-business-primary);\n  color: var(--dsw-alias-label-primary-foreground);\n  border: 0;\n  border-radius: 7px;\n  padding: 8px 13px;\n  margin-top: 23px;\n  cursor: pointer;\n}\n@media (max-width: 850px) {\n  .ma-table-head,\n  .ma-row {\n    grid-template-columns: minmax(0, 1fr) 120px 115px 105px 18px;\n    gap: 7px;\n  }\n  .ma-model {\n    gap: 7px;\n    flex-wrap: wrap;\n  }\n  .ma-badge {\n    max-width: 110px;\n  }\n  .ma-trigger .ma-badge {\n    max-width: 90px;\n  }\n}\n@media (max-width: 650px) {\n  .ma-table-head {\n    display: none;\n  }\n  .ma-row {\n    grid-template-columns: 1fr auto 18px;\n    grid-template-rows: auto auto;\n    gap: 8px;\n    padding: 12px;\n    min-height: 82px;\n  }\n  .ma-model {\n    grid-column: 1/3;\n  }\n  .ma-context {\n    grid-row: 2;\n    grid-column: 1;\n    font-size: 11px;\n    color: var(--dsw-alias-label-secondary);\n  }\n  .ma-ratio {\n    grid-row: 2;\n    grid-column: 1;\n    margin-left: 140px;\n    font-size: 11px;\n    color: var(--dsw-alias-label-secondary);\n  }\n  .ma-caps {\n    grid-row: 2;\n    grid-column: 2;\n  }\n  .ma-check {\n    grid-row: 1/3;\n    grid-column: 3;\n  }\n  .ma-caps > span {\n    font-size: 10px;\n    padding: 0 4px;\n  }\n  .ma-filters {\n    gap: 6px;\n    flex-wrap: nowrap;\n    overflow: auto;\n  }\n  .ma-filters select {\n    font-size: 11px;\n    max-width: 140px;\n    padding: 5px 7px;\n  }\n  .ma-page {\n    padding-inline: 20px;\n  }\n  .ma-setting-row {\n    padding: 20px 16px;\n  }\n  .ma-setting-row p {\n    font-size: 11px;\n  }\n  .ma-trigger {\n    max-width: 65cqw;\n    font-size: 12px;\n    gap: 5px;\n  }\n  .ma-trigger .ma-cap-icons {\n    display: none;\n  }\n  .ma-fields {\n    grid-template-columns: 1fr;\n  }\n  .ma-foot {\n    font-size: 10px;\n  }\n  .ma-badge {\n    max-width: 100px;\n  }\n}\n\n.ma-embedded-page .ma-page { height: auto; padding: 8px 0 24px; }\n.ma-embedded-page .ma-back { display: none; }\n.ma-embedded-page .ma-page h1 { margin-top: 0; font-size: 18px; }\n';

// src/client.jsx
var NS = "local-model-assistant";
var PANEL = "local-model-assistant";
var ViewBoundary = class extends import_react.default.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-error", role: "alert" }, "Model Assistant: ", String(this.state.error?.message || this.state.error)) : this.props.children;
  }
};
var dictionaries = {
  zh: {
    title: "\u6A21\u578B\u52A9\u624B",
    intro: "\u7BA1\u7406\u804A\u5929\u6846\u4E2D\u7684\u6A21\u578B\u4FE1\u606F\u5C55\u793A\u4E0E\u7B5B\u9009\u529F\u80FD\u3002",
    back: "\u8FD4\u56DE\u5BF9\u8BDD",
    enabled: "\u542F\u7528\u6A21\u578B\u52A9\u624B",
    enabledHint: "\u5C55\u793A\u6E20\u9053\u3001\u5382\u5546\u3001\u4E0A\u4E0B\u6587\u3001\u500D\u7387\u4E0E\u80FD\u529B\uFF0C\u5E76\u652F\u6301\u5206\u7C7B\u7B5B\u9009\u3002",
    sidebar: "\u5728\u4FA7\u680F\u663E\u793A\u5165\u53E3",
    sidebarHint: "\u9690\u85CF\u540E\u4ECD\u53EF\u4ECE\u8BBE\u7F6E\u4E2D\u7684\u300C\u6A21\u578B\u52A9\u624B\u300D\u8FDB\u5165\u3002",
    saved: "\u8BBE\u7F6E\u81EA\u52A8\u4FDD\u5B58\u3002\u5173\u95ED\u529F\u80FD\u540E\u4F7F\u7528\u5BBF\u4E3B\u539F\u6709\u6A21\u578B\u9009\u62E9\u5668\u3002",
    loading: "\u6B63\u5728\u52A0\u8F7D\u2026",
    unavailable: "\u63D2\u4EF6\u8BBE\u7F6E\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5728\u63D2\u4EF6\u9875\u68C0\u67E5\u52A0\u8F7D\u72B6\u6001\u3002",
    saveFailed: "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
    search: "\u641C\u7D22\u6A21\u578B\u3001\u6E20\u9053\u3001\u5382\u5546\u2026",
    clear: "\u6E05\u7A7A\u641C\u7D22",
    channels: "\u5168\u90E8\u6E20\u9053",
    suppliers: "\u5168\u90E8\u5382\u5546",
    capability: "\u80FD\u529B",
    context: "\u4E0A\u4E0B\u6587",
    capacity: "\u4E0A\u4E0B\u6587 / \u6700\u5927\u8F93\u51FA",
    maxTokens: "\u6700\u5927\u8F93\u51FA\uFF08token\uFF09",
    maxInputTokens: "\u6700\u5927\u8F93\u5165\uFF08token\uFF09",
    inputLimit: "\u8F93\u5165\u4E0A\u9650",
    route: "\u6A21\u578B\u4E0E\u6765\u6E90",
    ratio: "\u500D\u7387\uFF08\u5165 / \u51FA\uFF09",
    unknown: "\u672A\u77E5",
    unknownSupplier: "\u672A\u77E5\u5382\u5546",
    reasoning: "\u6DF1\u5EA6\u63A8\u7406",
    tools: "\u5DE5\u5177\u8C03\u7528",
    vision: "\u56FE\u50CF\u7406\u89E3",
    text: "\u6587\u672C",
    streaming: "\u6D41\u5F0F\u8F93\u51FA",
    empty: "\u6CA1\u6709\u5339\u914D\u7684\u6A21\u578B",
    reset: "\u91CD\u7F6E\u7B5B\u9009",
    select: "\u9009\u62E9\u6A21\u578B",
    close: "\u5173\u95ED\u6A21\u578B\u9009\u62E9",
    retry: "\u91CD\u8BD5",
    error: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
    selectFailed: "\u9009\u6A21\u5931\u8D25\uFF0C\u672A\u6539\u53D8\u5F53\u524D\u6A21\u578B\u3002",
    defaultEffort: "\u9ED8\u8BA4",
    providerDefault: "default",
    refresh: "\u5237\u65B0\u63A5\u53E3\u6A21\u578B\u5217\u8868",
    liveCatalog: "\u63A5\u53E3\u6A21\u578B\u5217\u8868",
    fallbackCatalog: "\u90E8\u5206\u6E20\u9053\u8BF7\u6C42\u5931\u8D25\uFF0C\u6B63\u5728\u4F7F\u7528\u7F13\u5B58\u6216\u672C\u5730\u53C2\u8003\u8D44\u6599\u3002",
    unlistedCurrent: "\u5F53\u524D\u6A21\u578B\u672A\u5728\u6700\u65B0\u63A5\u53E3\u5217\u8868\u4E2D\uFF0C\u5F53\u524D\u4F1A\u8BDD\u9009\u62E9\u4ECD\u4FDD\u7559\u3002",
    sourceLive: "/v1/models",
    sourceStale: "\u63A5\u53E3\u7F13\u5B58\uFF08\u8BF7\u6C42\u5931\u8D25\uFF09",
    noEfforts: "\u5F53\u524D\u6A21\u578B\u672A\u914D\u7F6E\u63A8\u7406\u7B49\u7EA7\uFF0C\u53EF\u5728\u5BBF\u4E3B\u300C\u8BBE\u7F6E \u2192 \u6A21\u578B\u300D\u4E2D\u914D\u7F6E\u3002",
    effort: "\u63A8\u7406\u7B49\u7EA7",
    foot: "\u500D\u7387\u76F8\u5BF9\u4E8E\u5404\u6E20\u9053\u57FA\u51C6\uFF0C\u975E\u6700\u7EC8\u5355\u4EF7\uFF1B\u672A\u77E5\u8D44\u6599\u672A\u505A\u63A8\u65AD\u3002",
    metadata: "\u8865\u5145\u6A21\u578B\u8D44\u6599",
    metadataHint: "\u6309\u6E20\u9053\u548C\u6A21\u578B ID \u5355\u72EC\u4FDD\u5B58\uFF1B\u4EC5\u7528\u4E8E\u5C55\u793A\u4E0E\u7B5B\u9009\uFF0C\u4E0D\u4F1A\u6539\u53D8\u8BF7\u6C42\u8DEF\u7531\u6216\u8BA1\u8D39\u3002",
    chooseRoute: "\u9009\u62E9\u6A21\u578B\u8DEF\u7EBF",
    supplier: "\u4F9B\u5E94\u5382\u5546",
    contextTokens: "\u4E0A\u4E0B\u6587\uFF08token\uFF09",
    inputMultiplier: "\u8F93\u5165\u500D\u7387",
    outputMultiplier: "\u8F93\u51FA\u500D\u7387",
    saveMetadata: "\u4FDD\u5B58\u6A21\u578B\u8D44\u6599",
    metadataSaved: "\u6A21\u578B\u8D44\u6599\u5DF2\u4FDD\u5B58",
    positive: "\u4E0A\u4E0B\u6587\u548C\u6700\u5927\u8F93\u51FA\u9700\u4E3A\u6B63\u6574\u6570\uFF0C\u500D\u7387\u9700\u4E3A\u975E\u8D1F\u6570\u3002",
    supported: "\u652F\u6301",
    unsupported: "\u4E0D\u652F\u6301",
    source: "\u8D44\u6599\u6765\u6E90",
    sourceHost: "\u5BBF\u4E3B\u914D\u7F6E",
    sourceManual: "\u624B\u52A8\u8D44\u6599",
    sourceUnknown: "\u672A\u63D0\u4F9B",
    metadataEmpty: "\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u6A21\u578B\u8DEF\u7EBF\u3002",
    loadFailed: "\u6A21\u578B\u76EE\u5F55\u52A0\u8F7D\u5931\u8D25\u3002",
    all: "\u5168\u90E8",
    name: "\u6A21\u578B\u540D",
    openSettings: "\u6A21\u578B\u52A9\u624B\u8BBE\u7F6E"
  },
  en: {
    title: "Model Assistant",
    intro: "Manage model information and filters in the chat composer.",
    back: "Back to chat",
    enabled: "Enable Model Assistant",
    enabledHint: "Show channel, supplier, context, multipliers and capabilities with filters.",
    sidebar: "Show sidebar entry",
    sidebarHint: "If hidden, open Model Assistant from Settings.",
    saved: "Changes save automatically. Turning this off restores the native model selector.",
    loading: "Loading\u2026",
    unavailable: "Plugin settings are unavailable. Check the plugin inventory.",
    saveFailed: "Could not save. Please retry.",
    search: "Search models, channels, suppliers\u2026",
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
    noEfforts: "No reasoning levels are configured for this model. Configure them in Settings \u2192 Models.",
    effort: "Reasoning effort",
    foot: "Multipliers use each channel\u2019s own base rate, not final prices. Missing metadata is unknown.",
    metadata: "Add model metadata",
    metadataHint: "Saved per channel and model ID. Display and filtering only; routing and billing are unchanged.",
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
    openSettings: "Model Assistant settings"
  }
};
function Icon({ kind = "box", size = 18, ...props }) {
  const paths = {
    box: "m12 3 9 5v9l-9 5-9-5V8Zm-9 5 9 5 9-5M12 13v9",
    down: "m6 9 6 6 6-6",
    back: "m10 5-7 7 7 7M3 12h18",
    check: "m5 12 4 4L19 6",
    tools: "m14 6 4-3 3 3-3 4-3-1-8 10-3-3 9-8-1-3Z",
    reasoning: "M8 4a3 3 0 0 0-5 3 4 4 0 0 0 0 7 3 3 0 0 0 5 5m8-15a3 3 0 0 1 5 3 4 4 0 0 1 0 7 3 3 0 0 1-5 5M9 3v18m6-18v18M3 9h4m-4 6h4m10-6h4m-4 6h4",
    vision: "M3 5h18v14H3Zm0 10 5-5 5 5 3-3 5 5M16 8h.01",
    streaming: "m13 2-9 12h7l-1 8 10-13h-7Z",
    info: "M12 11v6m0-10v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    close: "m6 6 12 12M6 18 18 6"
  };
  return /* @__PURE__ */ import_react.default.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props
    },
    /* @__PURE__ */ import_react.default.createElement("path", { d: paths[kind] || paths.box })
  );
}
var keyOf = (provider, model) => JSON.stringify([provider, model]);
var knownNumber = (value) => typeof value === "number" && Number.isFinite(value);
var formatContext = (value) => !knownNumber(value) ? null : value >= 1e6 ? `${+(value / 1e6).toFixed(2)}M` : value >= 1e3 ? `${+(value / 1e3).toFixed(1)}K` : String(value);
function metadataOf(group, model, prefs, hostDocument) {
  let configured, input;
  for (const section of hostDocument?.view?.namespaces || []) {
    const provider = section.value?.providers?.[group.id];
    if (!provider || !Array.isArray(provider.models) && !provider.modelOverrides)
      continue;
    const candidate = provider.models?.find((item) => item.id === model.id) ?? provider.modelOverrides?.[model.id];
    if (candidate) {
      configured = candidate;
      input = [candidate.input, provider.defaultInput].find(
        (value) => Array.isArray(value) && value.length > 0
      );
      break;
    }
  }
  const manual = prefs?.metadata?.[keyOf(group.id, model.id)] || {};
  const info = {
    ...configured?.contextWindow === void 0 ? {} : { contextWindow: configured.contextWindow },
    ...configured?.maxTokens === void 0 ? {} : { maxTokens: configured.maxTokens },
    ...input === void 0 ? configured ? { text: true } : {} : {
      text: input.includes("text"),
      vision: input.includes("image")
    },
    ...model.reasoning ? { reasoning: true } : configured?.reasoningEfforts === false ? { reasoning: false } : {},
    ...manual,
    ...model.metadata
  };
  const slash = model.id.indexOf("/");
  const prefix = slash > 0 ? model.id.slice(0, slash).trim() : void 0;
  info.supplier = group.source === "live" || group.source === "stale" ? prefix : typeof info.supplier === "string" && info.supplier.trim() ? info.supplier.trim() : prefix;
  info.source = group.source === "live" ? "sourceLive" : group.source === "stale" ? "sourceStale" : Object.keys(manual).length ? "sourceManual" : configured || model.reasoning || prefix ? "sourceHost" : "sourceUnknown";
  info.contextSource = model.metadata?.contextWindow !== void 0 ? info.source : manual.contextWindow !== void 0 ? "sourceManual" : "sourceHost";
  info.outputSource = model.metadata?.maxTokens !== void 0 ? info.source : manual.maxTokens !== void 0 ? "sourceManual" : "sourceHost";
  return info;
}
function RouteBadges({ group, info, t }) {
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-badges" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-badge ma-channel", title: group.id }, group.name), /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-badge" }, info.supplier || t("unknownSupplier")));
}
function Capabilities({ info, t, icons = false }) {
  const keys = ["text", "reasoning", "tools", "vision", "streaming"];
  const supported = keys.filter((key) => info[key] === true && (!icons || key !== "text"));
  const title = keys.map(
    (key) => `${t(key)}: ${info[key] === void 0 ? t("unknown") : info[key] ? t("supported") : t("unsupported")}`
  ).join("\n");
  return /* @__PURE__ */ import_react.default.createElement("span", { className: icons ? "ma-cap-icons" : "ma-caps", title }, supported.length ? supported.map(
    (key) => icons ? /* @__PURE__ */ import_react.default.createElement(Icon, { key, kind: key, size: 15 }) : /* @__PURE__ */ import_react.default.createElement("span", { key }, t(key))
  ) : icons ? null : /* @__PURE__ */ import_react.default.createElement("small", null, t("unknown")));
}
function ReasoningSelect({ reasoning, effort, disabled, onChange, t, compact = false }) {
  return /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      className: compact ? "ma-effort-compact" : void 0,
      "aria-label": t("effort"),
      title: t("effort"),
      disabled,
      value: effort ?? "",
      onChange: (e) => onChange(e.target.value || null)
    },
    reasoning.defaultEffort === void 0 ? /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("providerDefault")) : null,
    reasoning.efforts.map((item) => /* @__PURE__ */ import_react.default.createElement("option", { key: item.id, value: item.id, title: item.description }, item.name))
  );
}
function MetadataEditor({ form, usePreferences, loadCatalog, t }) {
  const settings = usePreferences((s) => s);
  const [catalog, setCatalog] = (0, import_react.useState)(null);
  const [routeKey, setRouteKey] = (0, import_react.useState)("");
  const [draft, setDraft] = (0, import_react.useState)({});
  const [message, setMessage] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    let live = true;
    Promise.resolve().then(loadCatalog).then((result) => {
      if (!live) return;
      if (!result.ok) {
        setMessage(t("loadFailed"));
        return;
      }
      setCatalog(result.value);
    }).catch(() => {
      if (live) setMessage(t("loadFailed"));
    });
    return () => {
      live = false;
    };
  }, [loadCatalog, t]);
  const routes = (catalog?.groups || []).flatMap(
    (group) => group.models.map((model) => ({
      group,
      model,
      key: keyOf(group.id, model.id)
    }))
  );
  const chosen = routeKey || routes[0]?.key || "";
  (0, import_react.useEffect)(() => {
    setDraft(settings.value?.metadata?.[chosen] || {});
  }, [chosen, settings.value?.metadata]);
  (0, import_react.useEffect)(() => {
    setMessage("");
  }, [chosen]);
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
      "outputMultiplier"
    ]) {
      if (draft[name] === void 0 || draft[name] === "") continue;
      const n = Number(draft[name]);
      if (!Number.isFinite(n) || n < 0 || ["contextWindow", "maxTokens"].includes(name) && (!Number.isInteger(n) || n === 0)) {
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
        { op: "set", path: ["metadata", chosen], value }
      ]);
      setMessage(t(ok ? "metadataSaved" : "saveFailed"));
    } catch {
      setMessage(t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("details", { className: "ma-editor" }, /* @__PURE__ */ import_react.default.createElement("summary", null, t("metadata")), /* @__PURE__ */ import_react.default.createElement("p", null, t("metadataHint")), !catalog ? /* @__PURE__ */ import_react.default.createElement("p", { role: "status" }, message || t("loading")) : !routes.length ? /* @__PURE__ */ import_react.default.createElement("p", null, t("metadataEmpty")) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", { className: "ma-field" }, t("chooseRoute"), /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      value: chosen,
      onChange: (e) => setRouteKey(e.target.value)
    },
    routes.map(({ key, group, model }) => /* @__PURE__ */ import_react.default.createElement("option", { key, value: key }, group.name, " / ", model.name, " \xB7 ", model.id))
  )), /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-fields" }, [
    "supplier",
    "contextWindow",
    "maxTokens",
    "inputMultiplier",
    "outputMultiplier"
  ].map((name) => /* @__PURE__ */ import_react.default.createElement("label", { key: name, className: "ma-field" }, t(name === "contextWindow" ? "contextTokens" : name), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: name === "supplier" ? "text" : "number",
      min: ["contextWindow", "maxTokens"].includes(name) ? 1 : 0,
      step: ["contextWindow", "maxTokens"].includes(name) ? 1 : "any",
      placeholder: t("unknown"),
      value: draft[name] ?? "",
      onChange: (e) => edit(name, e.target.value)
    }
  ))), ["text", "reasoning", "tools", "vision", "streaming"].map((name) => /* @__PURE__ */ import_react.default.createElement("label", { key: name, className: "ma-field" }, t(name), /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      value: draft[name] === true ? "yes" : draft[name] === false ? "no" : "unknown",
      onChange: (e) => edit(
        name,
        e.target.value === "unknown" ? void 0 : e.target.value === "yes"
      )
    },
    /* @__PURE__ */ import_react.default.createElement("option", { value: "unknown" }, t("unknown")),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "yes" }, t("supported")),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "no" }, t("unsupported"))
  )))), /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: "ma-primary",
      disabled: busy || !settings.writable,
      onClick: save
    },
    t("saveMetadata")
  ), message ? /* @__PURE__ */ import_react.default.createElement("p", { role: "status" }, message) : null));
}
function SettingsPage({ usePreferences, form, back, loadCatalog, t }) {
  const state = usePreferences((s) => s);
  const [busy, setBusy] = (0, import_react.useState)(false), [error, setError] = (0, import_react.useState)("");
  async function toggle(field) {
    setBusy(true);
    setError("");
    try {
      if (!await form.set(field, !state.value[field]))
        setError(t("saveFailed"));
    } catch {
      setError(t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "ma-page", "aria-label": t("openSettings") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-page-content" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "ma-back", onClick: back }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "back" }), t("back")), /* @__PURE__ */ import_react.default.createElement("h1", null, t("openSettings")), /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-intro" }, t("intro")), state.status !== "ready" ? /* @__PURE__ */ import_react.default.createElement("p", { role: "status" }, t(state.status === "loading" ? "loading" : "unavailable")) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-settings" }, [
    ["enabled", "enabled", "enabledHint"],
    ["showSidebar", "sidebar", "sidebarHint"]
  ].map(([field, label, hint]) => /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-setting-row", key: field }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { id: `ma-${field}` }, t(label)), /* @__PURE__ */ import_react.default.createElement("p", { id: `ma-${field}-hint` }, t(hint))), /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      role: "switch",
      "aria-labelledby": `ma-${field}`,
      "aria-describedby": `ma-${field}-hint`,
      "aria-checked": state.value[field],
      disabled: busy || !state.writable,
      onClick: () => toggle(field),
      className: "ma-switch"
    },
    /* @__PURE__ */ import_react.default.createElement("span", null)
  )))), /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-note" }, t("saved")), error ? /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-error", role: "alert" }, error) : null, /* @__PURE__ */ import_react.default.createElement(
    MetadataEditor,
    {
      usePreferences,
      form,
      loadCatalog,
      t
    }
  ))));
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
  t
}) {
  const nativeState = useDirectory((s) => s), preferences = usePreferences((s) => s.value), hostSettings = useHostSettings((s) => s);
  const [open, setOpen] = (0, import_react.useState)(false), [query, setQuery] = (0, import_react.useState)(""), [channel, setChannel] = (0, import_react.useState)(""), [supplier, setSupplier] = (0, import_react.useState)(""), [capability, setCapability] = (0, import_react.useState)(""), [minContext, setMinContext] = (0, import_react.useState)(""), [error, setError] = (0, import_react.useState)(""), [position, setPosition] = (0, import_react.useState)(null), [active, setActive] = (0, import_react.useState)(-1);
  const [remoteCatalog, setRemoteCatalog] = (0, import_react.useState)(null);
  const [refreshing, setRefreshing] = (0, import_react.useState)(false);
  const [preparing, setPreparing] = (0, import_react.useState)(false);
  const requestSeq = (0, import_react.useRef)(0);
  const state = { ...nativeState, groups: remoteCatalog?.groups ?? nativeState.groups };
  const trigger = (0, import_react.useRef)(null), menu = (0, import_react.useRef)(null), search = (0, import_react.useRef)(null), rows = (0, import_react.useRef)([]);
  (0, import_react.useEffect)(() => {
    if (available) load().catch(() => setError(t("loadFailed")));
  }, [available, load, t]);
  (0, import_react.useEffect)(() => {
    if (!available) return;
    const seq = ++requestSeq.current;
    const abort = new AbortController();
    loadRemote(false, abort.signal).then((result) => {
      if (!abort.signal.aborted && requestSeq.current === seq) {
        if (result.ok) setRemoteCatalog(result.value);
        else setError(t("loadFailed"));
      }
    }).catch(() => {
      if (!abort.signal.aborted && requestSeq.current === seq) setError(t("loadFailed"));
    });
    return () => {
      abort.abort();
      requestSeq.current++;
    };
  }, [available, loadRemote, t]);
  async function refreshRemote(force) {
    const seq = ++requestSeq.current;
    setRefreshing(true);
    try {
      const result = await loadRemote(force);
      if (requestSeq.current !== seq) return;
      if (result.ok) {
        setRemoteCatalog(result.value);
        setError("");
      } else setError(t("loadFailed"));
    } catch {
      if (requestSeq.current === seq) setError(t("loadFailed"));
    } finally {
      if (requestSeq.current === seq) setRefreshing(false);
    }
  }
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const outside = (e) => {
      if (!menu.current?.contains(e.target) && !trigger.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    const frame = requestAnimationFrame(() => search.current?.focus());
    return () => {
      document.removeEventListener("pointerdown", outside);
      cancelAnimationFrame(frame);
    };
  }, [open]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open) return;
    const place = () => {
      if (!trigger.current || !menu.current) return;
      const r = trigger.current.getBoundingClientRect(), w = menu.current.offsetWidth, h = menu.current.offsetHeight;
      setPosition({
        left: Math.max(12, Math.min(r.right - w, innerWidth - w - 12)),
        top: Math.max(12, Math.min(r.top - h - 8, innerHeight - h - 12))
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
  const all = (0, import_react.useMemo)(
    () => state.groups.flatMap(
      (group) => group.models.map((model) => ({
        group,
        model,
        info: metadataOf(group, model, preferences, hostSettings),
        key: keyOf(group.id, model.id)
      }))
    ),
    [state.groups, preferences, hostSettings]
  );
  let current = all.find(
    (row) => row.group.id === state.current?.provider && row.model.id === state.current.model
  );
  if (!current && nativeState.current) {
    const group = nativeState.groups.find((g) => g.id === nativeState.current.provider);
    const model = group?.models.find((m) => m.id === nativeState.current.model);
    if (group && model) current = { group, model: { id: model.id, name: model.name }, info: metadataOf(group, model, preferences, hostSettings), unlisted: true };
  }
  const reasoning = current?.model.reasoning;
  const effectiveEffort = reasoning?.efforts.some((e) => e.id === state.current?.reasoningEffort) ? state.current.reasoningEffort : reasoning?.defaultEffort;
  const q = query.trim().toLowerCase();
  const filtered = all.filter(
    (row) => (!q || `${row.group.name} ${row.group.id} ${row.model.name} ${row.model.id} ${row.info.supplier || ""}`.toLowerCase().includes(q)) && (!channel || row.group.id === channel) && (!supplier || (row.info.supplier || "__unknown") === supplier) && (!capability || row.info[capability] === true) && (!minContext || knownNumber(row.info.contextWindow) && row.info.contextWindow >= Number(minContext))
  );
  (0, import_react.useEffect)(() => {
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
    const same = state.current?.provider === row.group.id && state.current.model === row.model.id;
    const reasoningEffort = !row.model.reasoning?.efforts.length || effort === null ? void 0 : effort !== void 0 ? effort : same ? effectiveEffort : row.model.reasoning?.defaultEffort;
    setError("");
    setPreparing(true);
    try {
      const ready = await prepare(row.group.id, row.model.id, reasoningEffort ?? null);
      if (!ready.ok) throw new Error("prepare failed");
      if (ready.value.changed) await load();
      const result = await select({
        provider: row.group.id,
        model: row.model.id,
        ...reasoningEffort === void 0 ? {} : { reasoningEffort }
      });
      if (result?.ok) close();
      else setError(t("selectFailed"));
    } catch {
      setError(t("selectFailed"));
    } finally {
      setPreparing(false);
    }
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
      const n = e.key === "ArrowDown" ? (active + 1) % filtered.length : active <= 0 ? filtered.length - 1 : active - 1;
      setActive(n);
      rows.current[n]?.focus();
    } else if (e.key === "Enter" && e.target === search.current && filtered.length) {
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
  const ratio = (n) => knownNumber(n) ? `\xD7${n}` : t("unknown");
  const popup = /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      ref: menu,
      className: "ma-menu",
      role: "dialog",
      "aria-label": t("select"),
      onKeyDown,
      style: position || { left: 0, top: 0, visibility: "hidden" }
    },
    /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-search" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "search" }), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        ref: search,
        "aria-label": t("search"),
        placeholder: t("search"),
        value: query,
        onChange: (e) => setQuery(e.target.value)
      }
    ), query ? /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        "aria-label": t("clear"),
        onClick: () => {
          setQuery("");
          search.current?.focus();
        }
      },
      /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "close", size: 15 })
    ) : null, /* @__PURE__ */ import_react.default.createElement("button", { "aria-label": t("close"), onClick: close }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "close", size: 16 }))),
    /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-filters" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "ma-text-button", disabled: refreshing || busy, onClick: () => refreshRemote(true) }, refreshing ? t("loading") : t("refresh")), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        "aria-label": t("channels"),
        value: channel,
        onChange: (e) => setChannel(e.target.value)
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("channels")),
      state.groups.map((group) => /* @__PURE__ */ import_react.default.createElement("option", { key: group.id, value: group.id }, group.name))
    ), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        "aria-label": t("suppliers"),
        value: supplier,
        onChange: (e) => setSupplier(e.target.value)
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("suppliers")),
      [...new Set(all.map((row) => row.info.supplier || "__unknown"))].map(
        (value) => /* @__PURE__ */ import_react.default.createElement("option", { key: value, value }, value === "__unknown" ? t("unknownSupplier") : value)
      )
    ), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        "aria-label": t("capability"),
        value: capability,
        onChange: (e) => setCapability(e.target.value)
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("capability")),
      ["text", "reasoning", "tools", "vision", "streaming"].map((key) => /* @__PURE__ */ import_react.default.createElement("option", { key, value: key }, t(key)))
    ), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        "aria-label": t("context"),
        value: minContext,
        onChange: (e) => setMinContext(e.target.value)
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("context")),
      [64e3, 128e3, 1e6].map((value) => /* @__PURE__ */ import_react.default.createElement("option", { key: value, value }, "\u2265 ", formatContext(value)))
    ), query || channel || supplier || capability || minContext ? /* @__PURE__ */ import_react.default.createElement("button", { className: "ma-text-button", onClick: reset }, t("reset")) : null),
    /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-table-head" }, /* @__PURE__ */ import_react.default.createElement("span", null, t("route")), /* @__PURE__ */ import_react.default.createElement("span", null, t("capacity")), /* @__PURE__ */ import_react.default.createElement("span", null, t("ratio")), /* @__PURE__ */ import_react.default.createElement("span", null, t("capability")), /* @__PURE__ */ import_react.default.createElement("span", null)),
    /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-rows" }, filtered.map((row, i) => {
      const selected = row.group.id === state.current?.provider && row.model.id === state.current.model;
      return /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          ref: (node) => {
            rows.current[i] = node;
          },
          key: row.key,
          className: "ma-row",
          "aria-pressed": selected,
          disabled: busy || locked,
          onFocus: () => setActive(i),
          onClick: () => choose(row),
          "aria-label": `${row.model.name}, ${row.group.name}, ${row.info.supplier || t("unknownSupplier")}, ${row.model.id}`
        },
        /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-model" }, /* @__PURE__ */ import_react.default.createElement("strong", { title: row.model.id }, row.model.name), /* @__PURE__ */ import_react.default.createElement(RouteBadges, { group: row.group, info: row.info, t })),
        /* @__PURE__ */ import_react.default.createElement(
          "span",
          {
            className: "ma-context",
            title: `${t("contextTokens")}: ${row.info.contextWindow ?? t("unknown")} (${t(row.info.contextSource)}) \xB7 ${t("maxInputTokens")}: ${row.info.maxInputTokens ?? t("unknown")} \xB7 ${t("maxTokens")}: ${row.info.maxTokens ?? t("unknown")} (${t(row.info.outputSource)})`
          },
          formatContext(row.info.contextWindow) || t("unknown"),
          " /",
          " ",
          formatContext(row.info.maxTokens) || t("unknown"),
          knownNumber(row.info.maxInputTokens) ? /* @__PURE__ */ import_react.default.createElement("small", { className: "ma-input-limit" }, t("inputLimit"), " ", formatContext(row.info.maxInputTokens)) : null
        ),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-ratio" }, ratio(row.info.inputMultiplier), " /", " ", ratio(row.info.outputMultiplier)),
        /* @__PURE__ */ import_react.default.createElement(Capabilities, { info: row.info, t }),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-check" }, selected ? /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "check", size: 17 }) : null)
      );
    }), !filtered.length ? /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-empty", role: "status" }, state.status === "loading" ? t("loading") : t("empty")) : null),
    error || state.error || state.failures.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-error", role: "alert" }, error || state.error || t("loadFailed"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => load().catch(() => setError(t("loadFailed"))) }, t("retry"))) : null,
    current ? /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-effort" }, /* @__PURE__ */ import_react.default.createElement("span", null, t("effort")), /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-effort-choices", role: "group", "aria-label": t("effort") }, [
      ...reasoning?.defaultEffort === void 0 ? [{ id: null, name: t("providerDefault") }] : [],
      ...reasoning?.efforts || []
    ].map((item) => /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        key: item.id ?? "provider-default",
        disabled: busy || locked || current.unlisted,
        title: item.description,
        "aria-label": `${t("effort")} ${item.name}`,
        "aria-pressed": (effectiveEffort ?? null) === item.id,
        onClick: () => choose(current, item.id)
      },
      item.name
    )))) : null,
    remoteCatalog?.failures.length ? /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-effort ma-effort-note", role: "status" }, t("fallbackCatalog"), " ", remoteCatalog.failures.map((f) => `${f.id}: ${f.code}`).join(" \xB7 ")) : null,
    current?.unlisted ? /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-effort ma-effort-note", role: "status" }, t("unlistedCurrent")) : null,
    /* @__PURE__ */ import_react.default.createElement("p", { className: "ma-foot" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "info", size: 14 }), t("foot"))
  );
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-seat" }, /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      ref: trigger,
      className: "ma-trigger",
      disabled: locked || busy,
      "aria-label": `${t("select")}: ${current?.model.name || t("unknown")}`,
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      onClick: () => {
        if (!open) {
          reset();
          setPosition(null);
          refreshRemote(false);
        }
        setOpen((value) => !value);
      }
    },
    /* @__PURE__ */ import_react.default.createElement("span", null, current?.model.name || t("select")),
    current ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement(RouteBadges, { group: current.group, info: current.info, t }), /* @__PURE__ */ import_react.default.createElement(Capabilities, { info: current.info, t, icons: true })) : null,
    /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "down", size: 13 })
  ), current ? /* @__PURE__ */ import_react.default.createElement(
    ReasoningSelect,
    {
      compact: true,
      reasoning: reasoning || { efforts: [] },
      effort: effectiveEffort,
      disabled: busy || locked || current.unlisted,
      onChange: (effort) => choose(current, effort),
      t
    }
  ) : null, !open && error ? /* @__PURE__ */ import_react.default.createElement("span", { className: "ma-seat-error", role: "alert" }, error) : null, open ? (0, import_react_dom.createPortal)(popup, document.body) : null);
}
var inject = [
  "slots",
  "locale",
  "layout",
  "configForms",
  "modelDirectories",
  "sessions",
  "remote",
  "remote.session",
  "connection"
];
function apply(ctx) {
  ctx.effect(
    () => ctx.locale.register(NS, dictionaries),
    "model-assistant: locale"
  );
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.modelAssistant = "";
    style.textContent = styles_default;
    document.head.append(style);
    return () => style.remove();
  }, "model-assistant: styles");
  const t = ctx.locale.bind(NS), form = ctx.configForms.get(NS), mirror = ctx.configForms.describe();
  const loadRemote = (force = false, signal) => ctx.connection.rpc.call("/api", "modelAssistant/catalog", { args: { force } }, signal);
  const loadCatalog = () => loadRemote(false);
  ctx.slots.inject(
    "main",
    () => ctx.slots.register(
      {
        name: "main",
        key: PANEL,
        locale: NS,
        inject: () => ({
          hooks: { preferences: form },
          form,
          back: () => ctx.layout.selectPanel(null),
          loadCatalog
        })
      },
      (props) => /* @__PURE__ */ import_react.default.createElement(ViewBoundary, null, /* @__PURE__ */ import_react.default.createElement(SettingsPage, { ...props }))
    )
  );
  ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register(
      {
        name: "settings.section",
        id: PANEL,
        order: 80,
        label: () => t("title"),
        locale: NS,
        inject: () => ({ hooks: { preferences: form }, form, loadCatalog })
      },
      (props) => /* @__PURE__ */ import_react.default.createElement("div", { className: "ma-embedded-page" }, /* @__PURE__ */ import_react.default.createElement(ViewBoundary, null, /* @__PURE__ */ import_react.default.createElement(SettingsPage, { ...props, back: () => {
        props.close();
        ctx.layout.selectPanel(null);
      } })))
    )
  );
  let removeSidebar, removeSeat;
  function reconcile() {
    const prefs = form.getSnapshot().value;
    if (!prefs) return;
    if (prefs.showSidebar && !removeSidebar)
      removeSidebar = ctx.slots.inject(
        "sidebar.panellist",
        () => ctx.slots.register(
          {
            name: "sidebar.panellist",
            id: PANEL,
            order: -5,
            label: () => t("title"),
            locale: NS
          },
          ({ size }) => /* @__PURE__ */ import_react.default.createElement(Icon, { size })
        )
      );
    if (!prefs.showSidebar && removeSidebar) {
      removeSidebar();
      removeSidebar = void 0;
    }
    if (prefs.enabled && !removeSeat)
      removeSeat = ctx.slots.inject(
        "conversation.input.model",
        () => ctx.slots.register(
          {
            name: "conversation.input.model",
            priority: -100,
            locale: NS,
            inject: (sessionId) => {
              const directory = ctx.modelDirectories.directoryFor(sessionId);
              return {
                available: ctx.sessions.subagentAddress(sessionId) === void 0,
                hooks: {
                  directory: directory.store,
                  preferences: form,
                  hostSettings: mirror
                },
                load: () => directory.load(),
                loadRemote,
                prepare: (provider, modelId, effort) => ctx.connection.rpc.call("/api", "modelAssistant/prepare", { args: { provider, modelId, effort } }),
                select: (selection) => directory.select(selection)
              };
            }
          },
          ModelSeat
        )
      );
    if (!prefs.enabled && removeSeat) {
      removeSeat();
      removeSeat = void 0;
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

return module.exports;}});
