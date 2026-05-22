"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = readSessionHeaderStartedAtMs;exports.c = extractDeliveryInfo;exports.i = serializeSessionCleanupResult;exports.n = resolveSessionCleanupAction;exports.o = resolveSessionLifecycleTimestamps;exports.r = runSessionsCleanup;exports.s = resolveMainSessionKeyFromConfig;exports.t = purgeAgentSessionStoreEntries;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _sessionKeyUtilsQDNZHCY = require("./session-key-utils-qD-NZHCY.js");
var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _agentScopeConfig26EcJVc = require("./agent-scope-config-26EcJVc0.js");
require("./agent-scope-C1Fl7gAf.js");
var _loggerDIiFDaHc = require("./logger-DIiFDaHc.js");
var _io5xE1dPMK = require("./io-5xE1dPMK.js");
var _mainSessionBkilxHe = require("./main-session-BkilxHe0.js");
var _combinedStoreGatewayCrCDV3An = require("./combined-store-gateway-CrCDV3An.js");
var _deliveryContextSharedDk707JJ = require("./delivery-context.shared-Dk7-07JJ.js");
var _pathsKGAxo7MN = require("./paths-kGAxo7MN.js");
var _storeLoadCmAGD4uk = require("./store-load-cmAGD4uk.js");
var _store3qAZ3Zl = require("./store-3qAZ3Zl6.js");
var _targetsDaLztPKR = require("./targets-DaLztPKR.js");
require("./reset-DB4GrS9r.js");
require("./session-key-CDZmhV4O.js");
require("./session-file-C6TQVMAx.js");
require("./transcript-D34ZH8ZQ.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/config/sessions/delivery-info.ts
function hasRoutableDeliveryContext(context) {
  return Boolean(context?.channel && context?.to);
}
function extractDeliveryInfo(sessionKey, options) {
  const { baseSessionKey, threadId } = (0, _storeLoadCmAGD4uk.C)(sessionKey);
  if (!sessionKey || !baseSessionKey) return {
    deliveryContext: void 0,
    threadId
  };
  let deliveryContext;
  try {
    const lookup = loadDeliverySessionEntry({
      cfg: options?.cfg ?? (0, _io5xE1dPMK.i)(),
      sessionKey,
      baseSessionKey
    });
    let entry = lookup.entry;
    let storedDeliveryContext = (0, _deliveryContextSharedDk707JJ.t)(entry);
    if (!hasRoutableDeliveryContext(storedDeliveryContext) && baseSessionKey !== sessionKey) {
      entry = lookup.baseEntry;
      storedDeliveryContext = (0, _deliveryContextSharedDk707JJ.t)(entry);
    }
    if (hasRoutableDeliveryContext(storedDeliveryContext)) deliveryContext = {
      channel: storedDeliveryContext.channel,
      to: storedDeliveryContext.to,
      accountId: storedDeliveryContext.accountId,
      threadId: storedDeliveryContext.threadId
    };
  } catch {}
  return {
    deliveryContext,
    threadId
  };
}
function resolveDeliveryStorePaths(cfg, agentId) {
  const paths = /* @__PURE__ */new Set();
  paths.add((0, _pathsKGAxo7MN.u)(cfg.session?.store, { agentId }));
  for (const target of (0, _targetsDaLztPKR.r)(cfg)) if (target.agentId === agentId) paths.add(target.storePath);
  return [...paths];
}
function findSessionEntryInStore(store, keys) {
  let normalizedIndex;
  let bestEntry;
  let bestUpdatedAt = 0;
  let bestRoutable = false;
  const acceptCandidate = (candidate) => {
    if (!candidate) return;
    const candidateRoutable = hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(candidate));
    const candidateUpdatedAt = candidate.updatedAt ?? 0;
    if (!bestEntry || candidateRoutable && !bestRoutable || candidateRoutable === bestRoutable && candidateUpdatedAt > bestUpdatedAt) {
      bestEntry = candidate;
      bestUpdatedAt = candidateUpdatedAt;
      bestRoutable = candidateRoutable;
    }
  };
  for (const key of keys) {
    const trimmed = key.trim();
    const normalized = (0, _stringCoerceLndEvhRk.a)(key);
    let foundRoutableCandidate = false;
    if (Object.prototype.hasOwnProperty.call(store, normalized)) {
      foundRoutableCandidate ||= hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(store[normalized]));
      acceptCandidate(store[normalized]);
    }
    if (trimmed !== normalized && Object.prototype.hasOwnProperty.call(store, trimmed)) {
      foundRoutableCandidate ||= hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(store[trimmed]));
      acceptCandidate(store[trimmed]);
    }
    if (trimmed !== normalized || !foundRoutableCandidate) {
      normalizedIndex ??= buildFreshestSessionEntryIndex(store);
      acceptCandidate(normalizedIndex.get(normalized));
    }
  }
  return bestEntry;
}
function buildFreshestSessionEntryIndex(store) {
  const index = /* @__PURE__ */new Map();
  for (const [key, entry] of Object.entries(store)) {
    const normalized = (0, _stringCoerceLndEvhRk.a)(key);
    const existing = index.get(normalized);
    const entryRoutable = hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(entry));
    const existingRoutable = hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(existing));
    if (!existing || entryRoutable && !existingRoutable || entryRoutable === existingRoutable && (entry.updatedAt ?? 0) > (existing.updatedAt ?? 0)) index.set(normalized, entry);
  }
  return index;
}
function loadDeliverySessionEntry(params) {
  const canonicalKey = (0, _combinedStoreGatewayCrCDV3An.a)({
    cfg: params.cfg,
    sessionKey: params.sessionKey
  });
  const canonicalBaseKey = (0, _combinedStoreGatewayCrCDV3An.a)({
    cfg: params.cfg,
    sessionKey: params.baseSessionKey
  });
  const agentId = (0, _combinedStoreGatewayCrCDV3An.i)(params.cfg, canonicalKey);
  const sessionKeys = [params.sessionKey, canonicalKey];
  const baseKeys = [params.baseSessionKey, canonicalBaseKey];
  let fallback;
  for (const storePath of resolveDeliveryStorePaths(params.cfg, agentId)) {
    const store = (0, _storeLoadCmAGD4uk.t)(storePath);
    const entry = findSessionEntryInStore(store, sessionKeys);
    const baseEntry = findSessionEntryInStore(store, baseKeys);
    if (!entry && !baseEntry) continue;
    fallback ??= {
      entry,
      baseEntry
    };
    if (hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(entry)) || hasRoutableDeliveryContext((0, _deliveryContextSharedDk707JJ.t)(baseEntry))) return {
      entry,
      baseEntry
    };
  }
  return fallback ?? {
    entry: void 0,
    baseEntry: void 0
  };
}
//#endregion
//#region src/config/sessions/main-session.runtime.ts
function resolveMainSessionKeyFromConfig() {
  return (0, _mainSessionBkilxHe.i)((0, _io5xE1dPMK.i)());
}
//#endregion
//#region src/config/sessions/lifecycle.ts
function resolveTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function parseTimestampMs(value) {
  if (typeof value === "number") return resolveTimestamp(value);
  if (typeof value !== "string" || !value.trim()) return;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : void 0;
}
function readFirstLine(filePath) {
  try {
    const fd = _nodeFs.default.openSync(filePath, "r");
    try {
      const buffer = Buffer.alloc(8192);
      const bytesRead = _nodeFs.default.readSync(fd, buffer, 0, buffer.length, 0);
      if (bytesRead <= 0) return;
      const chunk = buffer.subarray(0, bytesRead).toString("utf8");
      const newline = chunk.indexOf("\n");
      return newline >= 0 ? chunk.slice(0, newline) : chunk;
    } finally {
      _nodeFs.default.closeSync(fd);
    }
  } catch {
    return;
  }
}
function readSessionHeaderStartedAtMs(params) {
  const sessionId = params.entry?.sessionId?.trim();
  if (!sessionId) return;
  const pathOptions = params.pathOptions ?? (0, _pathsKGAxo7MN.a)({
    agentId: params.agentId,
    storePath: params.storePath
  });
  let sessionFile;
  try {
    sessionFile = (0, _pathsKGAxo7MN.i)(sessionId, params.entry, pathOptions);
  } catch {
    return;
  }
  const firstLine = readFirstLine(sessionFile);
  if (!firstLine) return;
  try {
    const header = JSON.parse(firstLine);
    if (header.type !== "session") return;
    if (typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
    return parseTimestampMs(header.timestamp);
  } catch {
    return;
  }
}
function resolveSessionLifecycleTimestamps(params) {
  const entry = params.entry;
  if (!entry) return {};
  return {
    sessionStartedAt: resolveTimestamp(entry.sessionStartedAt) ?? readSessionHeaderStartedAtMs({
      entry,
      agentId: params.agentId,
      storePath: params.storePath,
      pathOptions: params.pathOptions
    }),
    lastInteractionAt: resolveTimestamp(entry.lastInteractionAt)
  };
}
//#endregion
//#region src/config/sessions/cleanup-service.ts
function resolveSessionCleanupAction(params) {
  if (params.dmScopeRetiredKeys.has(params.key)) return "retire-dm-scope";
  if (params.missingKeys.has(params.key)) return "prune-missing";
  if (params.staleKeys.has(params.key)) return "prune-stale";
  if (params.cappedKeys.has(params.key)) return "cap-overflow";
  if (params.budgetEvictedKeys.has(params.key)) return "evict-budget";
  return "keep";
}
function isMainScopeStaleDirectSessionKey(params) {
  if ((params.cfg.session?.dmScope ?? "main") !== "main") return false;
  if (params.activeKey && params.key === params.activeKey) return false;
  const parsed = (0, _sessionKeyUtilsQDNZHCY.o)(params.key);
  if (!parsed || (0, _sessionKeyDFEyR49L.c)(parsed.agentId) !== (0, _sessionKeyDFEyR49L.c)(params.targetAgentId)) return false;
  const parts = parsed.rest.split(":").filter(Boolean);
  return parts.length === 2 && parts[0] === "direct" || parts.length === 3 && parts[1] === "direct" || parts.length === 4 && parts[2] === "direct";
}
function rememberRemovedSessionFile(removedSessionFiles, entry) {
  if (entry?.sessionId) removedSessionFiles.set(entry.sessionId, entry.sessionFile);
}
function retireMainScopeDirectSessionEntries(params) {
  let retired = 0;
  for (const [key, entry] of Object.entries(params.store)) if (isMainScopeStaleDirectSessionKey({
    cfg: params.cfg,
    targetAgentId: params.targetAgentId,
    key,
    activeKey: params.activeKey
  })) {
    params.onRetired?.(key, entry);
    delete params.store[key];
    retired += 1;
  }
  return retired;
}
function serializeSessionCleanupResult(params) {
  if (params.summaries.length === 1) return params.summaries[0] ?? {};
  return {
    allAgents: true,
    mode: params.mode,
    dryRun: params.dryRun,
    stores: params.summaries
  };
}
function pruneMissingTranscriptEntries(params) {
  const sessionPathOpts = (0, _pathsKGAxo7MN.a)({ storePath: params.storePath });
  let removed = 0;
  for (const [key, entry] of Object.entries(params.store)) {
    if (!entry?.sessionId) continue;
    const transcriptPath = (0, _pathsKGAxo7MN.i)(entry.sessionId, entry, sessionPathOpts);
    if (!_nodeFs.default.existsSync(transcriptPath)) {
      delete params.store[key];
      removed += 1;
      params.onPruned?.(key);
    }
  }
  return removed;
}
function addEntryArtifactPathsToSet(params) {
  const sessionsDir = _nodePath.default.dirname(params.storePath);
  for (const key of params.keys) {
    const entry = params.store[key];
    if (!entry) continue;
    for (const artifactPath of (0, _store3qAZ3Zl.y)({
      sessionsDir,
      entry
    })) params.paths.add(artifactPath);
  }
}
async function previewStoreCleanup(params) {
  const beforeStore = (0, _storeLoadCmAGD4uk.t)(params.target.storePath, { skipCache: true });
  const previewStore = (0, _storeLoadCmAGD4uk.l)(beforeStore);
  const staleKeys = /* @__PURE__ */new Set();
  const cappedKeys = /* @__PURE__ */new Set();
  const missingKeys = /* @__PURE__ */new Set();
  const dmScopeRetiredKeys = /* @__PURE__ */new Set();
  const missing = params.fixMissing === true ? pruneMissingTranscriptEntries({
    store: previewStore,
    storePath: params.target.storePath,
    onPruned: (key) => {
      missingKeys.add(key);
    }
  }) : 0;
  const dmScopeRetired = params.fixDmScope === true ? retireMainScopeDirectSessionEntries({
    cfg: params.cfg,
    store: previewStore,
    targetAgentId: params.target.agentId,
    activeKey: params.activeKey,
    onRetired: (key) => {
      dmScopeRetiredKeys.add(key);
    }
  }) : 0;
  const preserveSessionKeys = (0, _storeLoadCmAGD4uk.i)([params.activeKey]);
  const pruned = (0, _storeLoadCmAGD4uk.y)(previewStore, params.maintenance.pruneAfterMs, {
    log: false,
    preserveKeys: preserveSessionKeys,
    onPruned: ({ key }) => {
      staleKeys.add(key);
    }
  });
  const capped = (0, _storeLoadCmAGD4uk.g)(previewStore, params.maintenance.maxEntries, {
    log: false,
    preserveKeys: preserveSessionKeys,
    onCapped: ({ key }) => {
      cappedKeys.add(key);
    }
  });
  const entryCleanupArtifactPaths = /* @__PURE__ */new Set();
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: staleKeys
  });
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: cappedKeys
  });
  addEntryArtifactPathsToSet({
    paths: entryCleanupArtifactPaths,
    store: beforeStore,
    storePath: params.target.storePath,
    keys: dmScopeRetiredKeys
  });
  const beforeBudgetStore = (0, _storeLoadCmAGD4uk.l)(previewStore);
  const budgetRemovedFilePaths = /* @__PURE__ */new Set();
  const diskBudget = await (0, _store3qAZ3Zl._)({
    store: previewStore,
    storePath: params.target.storePath,
    activeSessionKey: params.activeKey,
    preserveKeys: preserveSessionKeys,
    maintenance: params.maintenance,
    warnOnly: false,
    dryRun: true,
    onRemoveFile: (canonicalPath) => {
      budgetRemovedFilePaths.add(canonicalPath);
    }
  });
  const unreferencedArtifacts = await (0, _store3qAZ3Zl.v)({
    store: previewStore,
    storePath: params.target.storePath,
    olderThanMs: params.maintenance.pruneAfterMs,
    dryRun: true,
    excludeCanonicalPaths: new Set([...budgetRemovedFilePaths, ...entryCleanupArtifactPaths])
  });
  const budgetEvictedKeys = /* @__PURE__ */new Set();
  for (const key of Object.keys(beforeBudgetStore)) if (!Object.hasOwn(previewStore, key)) budgetEvictedKeys.add(key);
  const beforeCount = Object.keys(beforeStore).length;
  const afterPreviewCount = Object.keys(previewStore).length;
  const wouldMutate = missing > 0 || dmScopeRetired > 0 || pruned > 0 || capped > 0 || unreferencedArtifacts.removedFiles > 0 || (diskBudget?.removedEntries ?? 0) > 0 || (diskBudget?.removedFiles ?? 0) > 0;
  return {
    summary: {
      agentId: params.target.agentId,
      storePath: params.target.storePath,
      mode: params.mode,
      dryRun: params.dryRun,
      beforeCount,
      afterCount: afterPreviewCount,
      missing,
      dmScopeRetired,
      pruned,
      capped,
      unreferencedArtifacts,
      diskBudget,
      wouldMutate
    },
    beforeStore,
    missingKeys,
    staleKeys,
    cappedKeys,
    budgetEvictedKeys,
    dmScopeRetiredKeys
  };
}
async function runSessionsCleanup(params) {
  const { cfg, opts } = params;
  const maintenance = (0, _storeLoadCmAGD4uk.r)();
  const mode = opts.enforce ? "enforce" : maintenance.mode;
  const targets = params.targets ?? (0, _targetsDaLztPKR.i)(cfg, {
    store: opts.store,
    agent: opts.agent,
    allAgents: opts.allAgents
  });
  const previewResults = [];
  for (const target of targets) {
    const result = await previewStoreCleanup({
      cfg,
      target,
      maintenance,
      mode,
      dryRun: Boolean(opts.dryRun),
      activeKey: opts.activeKey,
      fixMissing: Boolean(opts.fixMissing),
      fixDmScope: Boolean(opts.fixDmScope)
    });
    previewResults.push(result);
  }
  const appliedSummaries = [];
  if (!opts.dryRun) for (const target of targets) {
    const appliedReportRef = { current: null };
    const dmScopeRemovedSessionFiles = /* @__PURE__ */new Map();
    let missingApplied = 0;
    let dmScopeRetiredApplied = 0;
    await (0, _store3qAZ3Zl.s)(target.storePath, async (store) => {
      let removed = 0;
      if (opts.fixMissing) {
        missingApplied = pruneMissingTranscriptEntries({
          store,
          storePath: target.storePath
        });
        removed += missingApplied;
      }
      if (opts.fixDmScope) {
        dmScopeRetiredApplied = retireMainScopeDirectSessionEntries({
          cfg,
          store,
          targetAgentId: target.agentId,
          activeKey: opts.activeKey,
          onRetired: (_key, entry) => {
            rememberRemovedSessionFile(dmScopeRemovedSessionFiles, entry);
          }
        });
        removed += dmScopeRetiredApplied;
      }
      return removed;
    }, {
      activeSessionKey: opts.activeKey,
      maintenanceOverride: { mode },
      onMaintenanceApplied: (report) => {
        appliedReportRef.current = report;
      }
    });
    if (dmScopeRemovedSessionFiles.size > 0) {
      const storeAfterDmScopeRetire = (0, _storeLoadCmAGD4uk.t)(target.storePath, { skipCache: true });
      await (0, _store3qAZ3Zl.t)({
        removedSessionFiles: dmScopeRemovedSessionFiles,
        referencedSessionIds: new Set(Object.values(storeAfterDmScopeRetire).map((entry) => entry?.sessionId).filter((id) => Boolean(id))),
        storePath: target.storePath,
        reason: "deleted",
        restrictToStoreDir: true
      });
    }
    const afterStore = (0, _storeLoadCmAGD4uk.t)(target.storePath, { skipCache: true });
    const unreferencedArtifacts = mode === "warn" ? {
      scannedFiles: 0,
      removedFiles: 0,
      freedBytes: 0,
      olderThanMs: maintenance.pruneAfterMs
    } : await (0, _store3qAZ3Zl.v)({
      store: afterStore,
      storePath: target.storePath,
      olderThanMs: maintenance.pruneAfterMs,
      dryRun: false
    });
    const preview = previewResults.find((result) => result.summary.storePath === target.storePath);
    const appliedReport = appliedReportRef.current;
    const summary = appliedReport === null ? {
      ...(preview?.summary ?? {
        agentId: target.agentId,
        storePath: target.storePath,
        mode,
        dryRun: false,
        beforeCount: 0,
        afterCount: 0,
        missing: 0,
        dmScopeRetired: 0,
        pruned: 0,
        capped: 0,
        unreferencedArtifacts,
        diskBudget: null,
        wouldMutate: false
      }),
      dryRun: false,
      unreferencedArtifacts,
      wouldMutate: (preview?.summary.wouldMutate ?? false) || unreferencedArtifacts.removedFiles > 0,
      applied: true,
      appliedCount: Object.keys(afterStore).length
    } : {
      agentId: target.agentId,
      storePath: target.storePath,
      mode: appliedReport.mode,
      dryRun: false,
      beforeCount: appliedReport.beforeCount,
      afterCount: appliedReport.afterCount,
      missing: missingApplied,
      dmScopeRetired: dmScopeRetiredApplied,
      pruned: appliedReport.pruned,
      capped: appliedReport.capped,
      unreferencedArtifacts,
      diskBudget: appliedReport.diskBudget,
      wouldMutate: missingApplied > 0 || dmScopeRetiredApplied > 0 || appliedReport.pruned > 0 || appliedReport.capped > 0 || unreferencedArtifacts.removedFiles > 0 || (appliedReport.diskBudget?.removedEntries ?? 0) > 0 || (appliedReport.diskBudget?.removedFiles ?? 0) > 0,
      applied: true,
      appliedCount: Object.keys(afterStore).length
    };
    appliedSummaries.push(summary);
  }
  return {
    mode,
    previewResults,
    appliedSummaries
  };
}
/** Purge session store entries for a deleted agent (#65524). Best-effort. */
async function purgeAgentSessionStoreEntries(cfg, agentId) {
  try {
    const normalizedAgentId = (0, _sessionKeyDFEyR49L.c)(agentId);
    const storeConfig = cfg.session?.store;
    const storeAgentId = typeof storeConfig === "string" && storeConfig.includes("{agentId}") ? normalizedAgentId : (0, _sessionKeyDFEyR49L.c)((0, _agentScopeConfig26EcJVc.c)(cfg));
    await (0, _store3qAZ3Zl.s)((0, _pathsKGAxo7MN.u)(cfg.session?.store, { agentId: normalizedAgentId }), (store) => {
      for (const key of Object.keys(store)) if ((0, _combinedStoreGatewayCrCDV3An.s)({
        cfg,
        agentId: storeAgentId,
        sessionKey: key
      }) === normalizedAgentId) delete store[key];
    });
  } catch (err) {
    (0, _loggerDIiFDaHc.a)().debug("session store purge skipped during agent delete", err);
  }
}
//#endregion /* v9-27af75e744710c8f */
