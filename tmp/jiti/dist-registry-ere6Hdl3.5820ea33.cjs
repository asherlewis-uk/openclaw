"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = normalizeAnyChannelId;exports.i = listRegisteredChannelPluginIds;exports.n = formatChannelSelectionLine;exports.o = normalizeChannelId;exports.r = getRegisteredChannelPluginMeta;exports.t = formatChannelPrimerLine;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _idsDFu3Ho6n = require("./ids-DFu3Ho6n.js");
require("./chat-meta-DTmQp8Tt.js");
var _registryLookupDrgM4VYY = require("./registry-lookup-DrgM4VYY.js");
//#region src/channels/registry.ts
function normalizeChannelId(raw) {
  return (0, _idsDFu3Ho6n.r)(raw);
}
function normalizeAnyChannelId(raw) {
  const key = (0, _stringCoerceLndEvhRk.s)(raw);
  if (!key) return null;
  return (0, _registryLookupDrgM4VYY.t)(key)?.plugin.id ?? null;
}
function listRegisteredChannelPluginIds() {
  return (0, _registryLookupDrgM4VYY.r)().flatMap((entry) => {
    const id = (0, _stringCoerceLndEvhRk.c)(entry.plugin.id);
    return id ? [id] : [];
  });
}
function getRegisteredChannelPluginMeta(id) {
  return (0, _registryLookupDrgM4VYY.n)(id)?.plugin.meta ?? null;
}
function formatChannelPrimerLine(meta) {
  return `${meta.label}: ${meta.blurb}`;
}
function formatChannelSelectionLine(meta, docsLink) {
  const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
  const docsLabel = meta.docsLabel ?? meta.id;
  const docs = meta.selectionDocsOmitLabel ? docsLink(meta.docsPath) : docsLink(meta.docsPath, docsLabel);
  const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
  return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
//#endregion /* v9-d4decd8191704309 */
