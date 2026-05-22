"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = resolveSessionStoreKey;exports.i = resolveSessionStoreAgentId;exports.n = canonicalizeSessionKeyForAgent;exports.o = resolveStoredSessionKeyForAgentStore;exports.r = canonicalizeSpawnedByForAgent;exports.s = resolveStoredSessionOwnerAgentId;exports.t = loadCombinedSessionStoreForGateway;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _sessionKeyUtilsQDNZHCY = require("./session-key-utils-qD-NZHCY.js");
var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _agentScopeConfig26EcJVc = require("./agent-scope-config-26EcJVc0.js");
require("./agent-scope-C1Fl7gAf.js");
var _mainSessionBkilxHe = require("./main-session-BkilxHe0.js");
var _pathsKGAxo7MN = require("./paths-kGAxo7MN.js");
var _storeLoadCmAGD4uk = require("./store-load-cmAGD4uk.js");
var _targetsDaLztPKR = require("./targets-DaLztPKR.js");
//#region src/gateway/session-store-key.ts
function canonicalizeSessionKeyForAgent(agentId, key) {
  const lowered = (0, _stringCoerceLndEvhRk.a)(key);
  if (lowered === "global" || lowered === "unknown") return lowered;
  if (lowered.startsWith("agent:")) return lowered;
  return `agent:${(0, _sessionKeyDFEyR49L.c)(agentId)}:${lowered}`;
}
function resolveDefaultStoreAgentId(cfg) {
  return (0, _sessionKeyDFEyR49L.c)((0, _agentScopeConfig26EcJVc.c)(cfg));
}
function shouldRemapLegacyDefaultMainAlias(cfg, parsed, options) {
  if ((0, _sessionKeyDFEyR49L.c)(parsed.agentId) !== "main" || (0, _agentScopeConfig26EcJVc.n)(cfg).includes("main")) return false;
  const defaultAgentId = resolveDefaultStoreAgentId(cfg);
  if (options?.storeAgentId && (0, _sessionKeyDFEyR49L.c)(options.storeAgentId) !== defaultAgentId) return false;
  const rest = (0, _stringCoerceLndEvhRk.a)(parsed.rest);
  const mainKey = (0, _sessionKeyDFEyR49L.l)(cfg.session?.mainKey);
  return rest === "main" || rest === mainKey;
}
function resolveParsedSessionStoreKey(cfg, raw, parsed, options) {
  if (!shouldRemapLegacyDefaultMainAlias(cfg, parsed, options)) return {
    agentId: (0, _sessionKeyDFEyR49L.c)(parsed.agentId),
    sessionKey: (0, _stringCoerceLndEvhRk.a)(raw)
  };
  const agentId = resolveDefaultStoreAgentId(cfg);
  return {
    agentId,
    sessionKey: `agent:${agentId}:${(0, _stringCoerceLndEvhRk.a)(parsed.rest)}`
  };
}
function resolveSessionStoreKey(params) {
  const raw = (0, _stringCoerceLndEvhRk.c)(params.sessionKey) ?? "";
  if (!raw) return raw;
  const rawLower = (0, _stringCoerceLndEvhRk.a)(raw);
  if (rawLower === "global" || rawLower === "unknown") return rawLower;
  const parsed = (0, _sessionKeyUtilsQDNZHCY.o)(raw);
  if (parsed) {
    const resolved = resolveParsedSessionStoreKey(params.cfg, raw, parsed, { storeAgentId: params.storeAgentId });
    const canonical = (0, _mainSessionBkilxHe.t)({
      cfg: params.cfg,
      agentId: resolved.agentId,
      sessionKey: resolved.sessionKey
    });
    if (canonical !== resolved.sessionKey) return canonical;
    return resolved.sessionKey;
  }
  const lowered = (0, _stringCoerceLndEvhRk.a)(raw);
  const rawMainKey = (0, _sessionKeyDFEyR49L.l)(params.cfg.session?.mainKey);
  if (lowered === "main" || lowered === rawMainKey) return (0, _mainSessionBkilxHe.i)(params.cfg);
  return canonicalizeSessionKeyForAgent(resolveDefaultStoreAgentId(params.cfg), lowered);
}
function resolveSessionStoreAgentId(cfg, canonicalKey) {
  if (canonicalKey === "global" || canonicalKey === "unknown") return resolveDefaultStoreAgentId(cfg);
  const parsed = (0, _sessionKeyUtilsQDNZHCY.o)(canonicalKey);
  if (parsed?.agentId) return (0, _sessionKeyDFEyR49L.c)(parsed.agentId);
  return resolveDefaultStoreAgentId(cfg);
}
function resolveStoredSessionKeyForAgentStore(params) {
  const raw = (0, _stringCoerceLndEvhRk.c)(params.sessionKey) ?? "";
  if (!raw) return raw;
  const lowered = (0, _stringCoerceLndEvhRk.a)(raw);
  if (lowered === "global" || lowered === "unknown") return lowered;
  const key = (0, _sessionKeyUtilsQDNZHCY.o)(raw) ? raw : canonicalizeSessionKeyForAgent(params.agentId, raw);
  return resolveSessionStoreKey({
    cfg: params.cfg,
    sessionKey: key,
    storeAgentId: params.agentId
  });
}
function resolveStoredSessionOwnerAgentId(params) {
  const canonicalKey = resolveStoredSessionKeyForAgentStore(params);
  if (canonicalKey === "global" || canonicalKey === "unknown") return null;
  return resolveSessionStoreAgentId(params.cfg, canonicalKey);
}
function canonicalizeSpawnedByForAgent(cfg, agentId, spawnedBy) {
  const raw = (0, _stringCoerceLndEvhRk.c)(spawnedBy) ?? "";
  if (!raw) return;
  const lower = (0, _stringCoerceLndEvhRk.a)(raw);
  if (lower === "global" || lower === "unknown") return lower;
  let result;
  if (lower.startsWith("agent:")) result = lower;else
  result = `agent:${(0, _sessionKeyDFEyR49L.c)(agentId)}:${lower}`;
  const parsed = (0, _sessionKeyUtilsQDNZHCY.o)(result);
  return (0, _mainSessionBkilxHe.t)({
    cfg,
    agentId: parsed?.agentId ? (0, _sessionKeyDFEyR49L.c)(parsed.agentId) : agentId,
    sessionKey: result
  });
}
//#endregion
//#region src/config/sessions/combined-store-gateway.ts
function isStorePathTemplate(store) {
  return typeof store === "string" && store.includes("{agentId}");
}
function mergeSessionEntryIntoCombined(params) {
  const { cfg, combined, entry, agentId, canonicalKey } = params;
  const existing = combined[canonicalKey];
  if (existing && (existing.updatedAt ?? 0) > (entry.updatedAt ?? 0)) {
    const spawnedBy = canonicalizeSpawnedByForAgent(cfg, agentId, existing.spawnedBy ?? entry.spawnedBy);
    combined[canonicalKey] = {
      ...entry,
      ...existing,
      spawnedBy
    };
    return;
  }
  const spawnedBy = canonicalizeSpawnedByForAgent(cfg, agentId, entry.spawnedBy ?? existing?.spawnedBy);
  if (!existing && entry.spawnedBy === spawnedBy) combined[canonicalKey] = entry;else
  combined[canonicalKey] = {
    ...existing,
    ...entry,
    spawnedBy
  };
}
function loadCombinedSessionStoreForGateway(cfg, opts = {}) {
  const storeConfig = cfg.session?.store;
  if (storeConfig && !isStorePathTemplate(storeConfig)) {
    const storePath = (0, _pathsKGAxo7MN.u)(storeConfig);
    const defaultAgentId = (0, _sessionKeyDFEyR49L.c)((0, _agentScopeConfig26EcJVc.c)(cfg));
    const store = (0, _storeLoadCmAGD4uk.t)(storePath, { clone: false });
    const combined = {};
    for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
      cfg,
      combined,
      entry,
      agentId: defaultAgentId,
      canonicalKey: resolveStoredSessionKeyForAgentStore({
        cfg,
        agentId: defaultAgentId,
        sessionKey: key
      })
    });
    return {
      storePath,
      store: combined
    };
  }
  const requestedAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? (0, _sessionKeyDFEyR49L.c)(opts.agentId) : void 0;
  const targets = requestedAgentId ? (0, _targetsDaLztPKR.t)(cfg, requestedAgentId) : opts.configuredAgentsOnly === true ? (0, _targetsDaLztPKR.i)(cfg, { allAgents: true }) : (0, _targetsDaLztPKR.r)(cfg);
  const combined = {};
  for (const target of targets) {
    const agentId = target.agentId;
    const storePath = target.storePath;
    const store = (0, _storeLoadCmAGD4uk.t)(storePath, { clone: false });
    for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
      cfg,
      combined,
      entry,
      agentId,
      canonicalKey: resolveStoredSessionKeyForAgentStore({
        cfg,
        agentId,
        sessionKey: key
      })
    });
  }
  return {
    storePath: targets.length === 1 ? targets[0].storePath : typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)",
    store: combined
  };
}
//#endregion /* v9-e23e94e3a12c1ea6 */
