"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = resolveAgentIdByWorkspacePath;exports.c = resolveAgentModelPrimary;exports.d = resolveFallbackAgentId;exports.f = resolveRunModelFallbacksOverride;exports.h = setAgentEffectiveModelPrimary;exports.i = resolveAgentExplicitModelPrimary;exports.l = resolveAgentSkillsFilter;exports.m = resolveSessionAgentIds;exports.n = resolveAgentEffectiveModelPrimary;exports.o = resolveAgentIdsByWorkspacePath;exports.p = resolveSessionAgentId;exports.r = resolveAgentExecutionContract;exports.s = resolveAgentModelFallbacksOverride;exports.t = hasConfiguredModelFallbacks;exports.u = resolveEffectiveModelFallbacks;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _pathB5B_oAT = require("./path-B5B-_oAT.js");
var _utilsCKsuXgDI = require("./utils-CKsuXgDI.js");
var _modelInputB9pBobB = require("./model-input-B9p-bobB.js");
require("./path-guards-DOGmBasP.js");
var _sessionKeyUtilsQDNZHCY = require("./session-key-utils-qD-NZHCY.js");
var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _agentScopeConfig26EcJVc = require("./agent-scope-config-26EcJVc0.js");
var _agentFilterDDYttCiF = require("./agent-filter-DDYttCiF.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/agents/agent-scope.ts
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
  return s.replace(/\0/g, "");
}
function resolveSessionAgentIds(params) {
  const defaultAgentId = (0, _agentScopeConfig26EcJVc.c)(params.config ?? {});
  const explicitAgentIdRaw = (0, _stringCoerceLndEvhRk.a)(params.agentId);
  const explicitAgentId = explicitAgentIdRaw ? (0, _sessionKeyDFEyR49L.c)(explicitAgentIdRaw) : null;
  const sessionKey = params.sessionKey?.trim();
  const normalizedSessionKey = sessionKey ? (0, _stringCoerceLndEvhRk.a)(sessionKey) : void 0;
  const parsed = normalizedSessionKey ? (0, _sessionKeyUtilsQDNZHCY.o)(normalizedSessionKey) : null;
  return {
    defaultAgentId,
    sessionAgentId: explicitAgentId ?? (parsed?.agentId ? (0, _sessionKeyDFEyR49L.c)(parsed.agentId) : defaultAgentId)
  };
}
function resolveSessionAgentId(params) {
  return resolveSessionAgentIds(params).sessionAgentId;
}
function resolveAgentExecutionContract(cfg, agentId) {
  const defaultContract = cfg?.agents?.defaults?.embeddedPi?.executionContract;
  if (!cfg || !agentId) return defaultContract;
  return (0, _agentScopeConfig26EcJVc.r)(cfg, agentId)?.embeddedPi?.executionContract ?? defaultContract;
}
function resolveAgentSkillsFilter(cfg, agentId) {
  return (0, _agentFilterDDYttCiF.t)(cfg, agentId);
}
function resolveAgentExplicitModelPrimary(cfg, agentId) {
  const raw = (0, _agentScopeConfig26EcJVc.r)(cfg, agentId)?.model;
  return (0, _stringCoerceLndEvhRk.p)(raw);
}
function resolveAgentEffectiveModelPrimary(cfg, agentId) {
  return resolveAgentExplicitModelPrimary(cfg, agentId) ?? (0, _stringCoerceLndEvhRk.p)(cfg.agents?.defaults?.model);
}
function findMutableAgentEntry(cfg, agentId) {
  const id = (0, _sessionKeyDFEyR49L.c)(agentId);
  return cfg.agents?.list?.find((entry) => (0, _sessionKeyDFEyR49L.c)(entry?.id) === id);
}
function updateAgentModelPrimary(existing, primary) {
  if (existing && typeof existing === "object" && !Array.isArray(existing)) return {
    ...existing,
    primary
  };
  return primary;
}
function setAgentEffectiveModelPrimary(cfg, agentId, primary) {
  const id = (0, _sessionKeyDFEyR49L.c)(agentId);
  if (resolveAgentExplicitModelPrimary(cfg, id)) {
    const entry = findMutableAgentEntry(cfg, id);
    if (entry) {
      entry.model = updateAgentModelPrimary(entry.model, primary);
      return "agent";
    }
  }
  cfg.agents ??= {};
  cfg.agents.defaults ??= {};
  cfg.agents.defaults.model = updateAgentModelPrimary(cfg.agents.defaults.model, primary);
  return "defaults";
}
/** @deprecated Prefer explicit/effective helpers at new call sites. */
function resolveAgentModelPrimary(cfg, agentId) {
  return resolveAgentExplicitModelPrimary(cfg, agentId);
}
function resolveAgentModelFallbacksOverride(cfg, agentId) {
  const raw = (0, _agentScopeConfig26EcJVc.r)(cfg, agentId)?.model;
  if (!raw) return;
  if (typeof raw === "string") return (0, _stringCoerceLndEvhRk.p)(raw) ? [] : void 0;
  if (!Object.hasOwn(raw, "fallbacks")) return Object.hasOwn(raw, "primary") && (0, _stringCoerceLndEvhRk.p)(raw) ? [] : void 0;
  return Array.isArray(raw.fallbacks) ? raw.fallbacks : void 0;
}
function resolveFallbackAgentId(params) {
  const explicitAgentId = (0, _stringCoerceLndEvhRk.c)(params.agentId) ?? "";
  if (explicitAgentId) return (0, _sessionKeyDFEyR49L.c)(explicitAgentId);
  return (0, _sessionKeyDFEyR49L.u)(params.sessionKey);
}
function resolveRunModelFallbacksOverride(params) {
  if (!params.cfg) return;
  return resolveAgentModelFallbacksOverride(params.cfg, resolveFallbackAgentId({
    agentId: params.agentId,
    sessionKey: params.sessionKey
  }));
}
function hasConfiguredModelFallbacks(params) {
  const fallbacksOverride = resolveRunModelFallbacksOverride(params);
  const defaultFallbacks = (0, _modelInputB9pBobB.r)(params.cfg?.agents?.defaults?.model);
  return (fallbacksOverride ?? defaultFallbacks).length > 0;
}
function resolveEffectiveModelFallbacks(params) {
  const agentFallbacksOverride = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
  if (!params.hasSessionModelOverride) return agentFallbacksOverride;
  if (params.modelOverrideSource !== "auto") return [];
  const defaultFallbacks = (0, _modelInputB9pBobB.r)(params.cfg.agents?.defaults?.model);
  return agentFallbacksOverride ?? defaultFallbacks;
}
function normalizePathForComparison(input) {
  const resolved = _nodePath.default.resolve(stripNullBytes((0, _utilsCKsuXgDI.p)(input)));
  let normalized = resolved;
  try {
    normalized = _nodeFs.default.realpathSync.native(resolved);
  } catch {}
  if (process.platform === "win32") return (0, _stringCoerceLndEvhRk.r)(normalized);
  return normalized;
}
function resolveAgentIdsByWorkspacePath(cfg, workspacePath) {
  const normalizedWorkspacePath = normalizePathForComparison(workspacePath);
  const ids = (0, _agentScopeConfig26EcJVc.n)(cfg);
  const matches = [];
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const workspaceDir = normalizePathForComparison((0, _agentScopeConfig26EcJVc.o)(cfg, id));
    if (!(0, _pathB5B_oAT.i)(workspaceDir, normalizedWorkspacePath)) continue;
    matches.push({
      id,
      workspaceDir,
      order: index
    });
  }
  matches.sort((left, right) => {
    const workspaceLengthDelta = right.workspaceDir.length - left.workspaceDir.length;
    if (workspaceLengthDelta !== 0) return workspaceLengthDelta;
    return left.order - right.order;
  });
  return matches.map((entry) => entry.id);
}
function resolveAgentIdByWorkspacePath(cfg, workspacePath) {
  return resolveAgentIdsByWorkspacePath(cfg, workspacePath)[0];
}
//#endregion /* v9-3b5185977e37dc43 */
