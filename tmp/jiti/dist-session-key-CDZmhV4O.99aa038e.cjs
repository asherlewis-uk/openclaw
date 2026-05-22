"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveSessionKey;exports.t = deriveSessionKey;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _utilsCKsuXgDI = require("./utils-CKsuXgDI.js");
var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _messageChannelSARuKR = require("./message-channel-s-A-ruKR.js");
var _registryBdfZSqhE = require("./registry-BdfZSqhE2.js");
var _store3qAZ3Zl = require("./store-3qAZ3Zl6.js");
require("./plugins-YTdL-Pji.js");
//#region src/config/sessions/explicit-session-key-normalization.ts
function resolveExplicitSessionKeyNormalizerCandidates(sessionKey, ctx) {
  const normalizedProvider = (0, _stringCoerceLndEvhRk.s)(ctx.Provider);
  const normalizedSurface = (0, _stringCoerceLndEvhRk.s)(ctx.Surface);
  const normalizedFrom = (0, _stringCoerceLndEvhRk.a)(ctx.From);
  const candidates = /* @__PURE__ */new Set();
  const maybeAdd = (value) => {
    const normalized = (0, _messageChannelSARuKR.u)(value);
    if (normalized) candidates.add(normalized);
  };
  maybeAdd(normalizedSurface);
  maybeAdd(normalizedProvider);
  maybeAdd(normalizedFrom.split(":", 1)[0]);
  for (const plugin of (0, _registryBdfZSqhE.i)()) {
    const pluginId = (0, _messageChannelSARuKR.u)(plugin.id);
    if (!pluginId) continue;
    if (sessionKey.startsWith(`${pluginId}:`) || sessionKey.includes(`:${pluginId}:`)) candidates.add(pluginId);
  }
  return [...candidates];
}
function normalizeExplicitSessionKey(sessionKey, ctx) {
  const normalized = (0, _stringCoerceLndEvhRk.a)(sessionKey);
  for (const channelId of resolveExplicitSessionKeyNormalizerCandidates(normalized, ctx)) {
    const normalize = (0, _registryBdfZSqhE.n)(channelId)?.messaging?.normalizeExplicitSessionKey;
    const next = normalize?.({
      sessionKey: normalized,
      ctx
    });
    if (typeof next === "string" && next.trim()) return (0, _stringCoerceLndEvhRk.a)(next);
  }
  return normalized;
}
//#endregion
//#region src/config/sessions/session-key.ts
function deriveSessionKey(scope, ctx) {
  if (scope === "global") return "global";
  const resolvedGroup = (0, _store3qAZ3Zl.g)(ctx);
  if (resolvedGroup) return resolvedGroup.key;
  return (ctx.From ? (0, _utilsCKsuXgDI.l)(ctx.From) : "") || "unknown";
}
/**
* Resolve the session key with a canonical direct-chat bucket (default: "main").
* All non-group direct chats collapse to this bucket; groups stay isolated.
*/
function resolveSessionKey(scope, ctx, mainKey, agentId = _sessionKeyDFEyR49L.t) {
  const explicit = ctx.SessionKey?.trim();
  if (explicit) return normalizeExplicitSessionKey(explicit, ctx);
  const raw = deriveSessionKey(scope, ctx);
  if (scope === "global") return raw;
  const canonicalAgentId = (0, _sessionKeyDFEyR49L.c)(agentId);
  const canonical = (0, _sessionKeyDFEyR49L.r)({
    agentId: canonicalAgentId,
    mainKey: (0, _sessionKeyDFEyR49L.l)(mainKey)
  });
  if (!(raw.includes(":group:") || raw.includes(":channel:"))) return canonical;
  return `agent:${canonicalAgentId}:${raw}`;
}
//#endregion /* v9-bdbaa07bd331b07d */
