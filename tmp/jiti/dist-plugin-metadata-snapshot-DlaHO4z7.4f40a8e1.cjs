"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = resolvePluginControlPlaneFingerprint;exports.c = isDiagnosticsTimelineEnabled;exports.i = fingerprintPluginDiscoveryContext;exports.l = measureDiagnosticsTimelineSpan;exports.n = listPluginOriginsFromMetadataSnapshot;exports.o = resolvePluginDiscoveryContext;exports.r = loadPluginMetadataSnapshot;exports.s = emitDiagnosticsTimelineEvent;exports.t = isPluginMetadataSnapshotCompatible;exports.u = measureDiagnosticsTimelineSpanSync;var _envDL0trrAI = require("./env-DL0trrAI.js");
var _discoveryBEbYTYvv = require("./discovery-BEbYTYvv.js");
var _regularFile6GdZVPgG = require("./regular-file-6GdZVPgG.js");
var _diagnosticFlagsBAYJHjtr = require("./diagnostic-flags-BAYJHjtr.js");
require("./regular-file-BGI9Nxdy.js");
var _installedPluginIndexStoreDetkjvO = require("./installed-plugin-index-store-DetkjvO9.js");
var _manifestRegistryDgt5vVG = require("./manifest-registry-Dgt5v-vG.js");
var _manifestRegistryInstalledCr9K7amI = require("./manifest-registry-installed-Cr9K7amI.js");
var _pluginRegistryCdr1zbpf = require("./plugin-registry-Cdr1zbpf.js");
var _nodeFs = require("node:fs");
var _nodePath = require("node:path");
var _nodeCrypto = require("node:crypto");
var _nodeAsync_hooks = require("node:async_hooks");
var _nodePerf_hooks = require("node:perf_hooks");
//#region src/infra/diagnostics-timeline.ts
const OPENCLAW_DIAGNOSTICS_TIMELINE_SCHEMA_VERSION = "openclaw.diagnostics.v1";
let warnedAboutTimelineWrite = false;
const createdTimelineDirs = /* @__PURE__ */new Set();
const activeDiagnosticsTimelineSpan = new _nodeAsync_hooks.AsyncLocalStorage();
function resolveDiagnosticsTimelineOptions(options = {}) {
  return {
    env: options.env ?? process.env,
    ...(options.config ? { config: options.config } : {})
  };
}
function isDiagnosticsTimelineEnabled(options = {}) {
  const { config, env } = resolveDiagnosticsTimelineOptions(options);
  return ((0, _diagnosticFlagsBAYJHjtr.t)("timeline", config, env) || (0, _diagnosticFlagsBAYJHjtr.t)("diagnostics.timeline", config, env) || (0, _envDL0trrAI.t)(env.OPENCLAW_DIAGNOSTICS)) && typeof env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH === "string" && env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH.trim().length > 0;
}
function normalizeNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function normalizeAttributes(attributes) {
  if (!attributes) return;
  const normalized = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === "number") {
      if (Number.isFinite(value)) normalized[key] = normalizeNumber(value) ?? 0;
      continue;
    }
    if (typeof value === "string" || typeof value === "boolean" || value === null) normalized[key] = value;
  }
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function serializeTimelineEvent(event, env) {
  const normalized = {
    schemaVersion: OPENCLAW_DIAGNOSTICS_TIMELINE_SCHEMA_VERSION,
    type: event.type,
    timestamp: event.timestamp ?? (/* @__PURE__ */new Date()).toISOString(),
    name: event.name,
    ...(env.OPENCLAW_DIAGNOSTICS_RUN_ID ? { runId: env.OPENCLAW_DIAGNOSTICS_RUN_ID } : {}),
    ...(env.OPENCLAW_DIAGNOSTICS_ENV ? { envName: env.OPENCLAW_DIAGNOSTICS_ENV } : {}),
    pid: process.pid,
    ...(event.runId ? { runId: event.runId } : {}),
    ...(event.envName ? { envName: event.envName } : {}),
    ...(typeof event.pid === "number" ? { pid: event.pid } : {}),
    ...(event.phase ? { phase: event.phase } : {}),
    ...(event.spanId ? { spanId: event.spanId } : {}),
    ...(event.parentSpanId ? { parentSpanId: event.parentSpanId } : {}),
    ...(typeof event.durationMs === "number" ? { durationMs: normalizeNumber(event.durationMs) } : {}),
    ...(event.errorName ? { errorName: event.errorName } : {}),
    ...(event.errorMessage ? { errorMessage: event.errorMessage } : {}),
    ...(typeof event.p50Ms === "number" ? { p50Ms: normalizeNumber(event.p50Ms) } : {}),
    ...(typeof event.p95Ms === "number" ? { p95Ms: normalizeNumber(event.p95Ms) } : {}),
    ...(typeof event.p99Ms === "number" ? { p99Ms: normalizeNumber(event.p99Ms) } : {}),
    ...(typeof event.maxMs === "number" ? { maxMs: normalizeNumber(event.maxMs) } : {}),
    ...(event.activeSpanName ? { activeSpanName: event.activeSpanName } : {}),
    ...(event.provider ? { provider: event.provider } : {}),
    ...(event.operation ? { operation: event.operation } : {}),
    ...(typeof event.ok === "boolean" ? { ok: event.ok } : {}),
    ...(event.command ? { command: event.command } : {}),
    ...(event.exitCode !== void 0 ? { exitCode: event.exitCode } : {}),
    ...(event.signal !== void 0 ? { signal: event.signal } : {}),
    ...(normalizeAttributes(event.attributes) ? { attributes: normalizeAttributes(event.attributes) } : {})
  };
  return `${JSON.stringify(normalized)}\n`;
}
function emitDiagnosticsTimelineEvent(event, options = {}) {
  const { env } = resolveDiagnosticsTimelineOptions(options);
  if (!isDiagnosticsTimelineEnabled(options)) return;
  const path = env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim();
  if (!path) return;
  const line = serializeTimelineEvent(event, env);
  try {
    const dir = (0, _nodePath.dirname)(path);
    if (!createdTimelineDirs.has(dir)) {
      (0, _nodeFs.mkdirSync)(dir, { recursive: true });
      createdTimelineDirs.add(dir);
    }
    (0, _regularFile6GdZVPgG.n)({
      filePath: path,
      content: line
    });
  } catch (error) {
    if (!warnedAboutTimelineWrite) {
      warnedAboutTimelineWrite = true;
      process.stderr.write(`[diagnostics] failed to write timeline event: ${String(error)}\n`);
    }
  }
}
function getActiveDiagnosticsTimelineSpan() {
  return activeDiagnosticsTimelineSpan.getStore();
}
async function measureDiagnosticsTimelineSpan(name, run, options = {}) {
  const env = options.env ?? process.env;
  if (!isDiagnosticsTimelineEnabled({
    config: options.config,
    env
  })) return await run();
  const activeSpan = getActiveDiagnosticsTimelineSpan();
  const spanId = (0, _nodeCrypto.randomUUID)();
  const phase = options.phase ?? activeSpan?.phase;
  const parentSpanId = options.parentSpanId ?? activeSpan?.spanId;
  const startedAt = _nodePerf_hooks.performance.now();
  emitDiagnosticsTimelineEvent({
    type: "span.start",
    name,
    phase,
    spanId,
    parentSpanId,
    attributes: options.attributes
  }, {
    config: options.config,
    env
  });
  try {
    const result = await activeDiagnosticsTimelineSpan.run({
      name,
      ...(phase ? { phase } : {}),
      spanId,
      ...(parentSpanId ? { parentSpanId } : {}),
      ...(options.attributes ? { attributes: options.attributes } : {})
    }, () => run());
    emitDiagnosticsTimelineEvent({
      type: "span.end",
      name,
      phase,
      spanId,
      parentSpanId,
      durationMs: _nodePerf_hooks.performance.now() - startedAt,
      attributes: options.attributes
    }, {
      config: options.config,
      env
    });
    return result;
  } catch (error) {
    emitDiagnosticsTimelineEvent({
      type: "span.error",
      name,
      phase,
      spanId,
      parentSpanId,
      durationMs: _nodePerf_hooks.performance.now() - startedAt,
      attributes: options.attributes,
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error)
    }, {
      config: options.config,
      env
    });
    throw error;
  }
}
function measureDiagnosticsTimelineSpanSync(name, run, options = {}) {
  const env = options.env ?? process.env;
  if (!isDiagnosticsTimelineEnabled({
    config: options.config,
    env
  })) return run();
  const activeSpan = getActiveDiagnosticsTimelineSpan();
  const spanId = (0, _nodeCrypto.randomUUID)();
  const phase = options.phase ?? activeSpan?.phase;
  const parentSpanId = options.parentSpanId ?? activeSpan?.spanId;
  const startedAt = _nodePerf_hooks.performance.now();
  emitDiagnosticsTimelineEvent({
    type: "span.start",
    name,
    phase,
    spanId,
    parentSpanId,
    attributes: options.attributes
  }, {
    config: options.config,
    env
  });
  try {
    const result = activeDiagnosticsTimelineSpan.run({
      name,
      ...(phase ? { phase } : {}),
      spanId,
      ...(parentSpanId ? { parentSpanId } : {}),
      ...(options.attributes ? { attributes: options.attributes } : {})
    }, run);
    emitDiagnosticsTimelineEvent({
      type: "span.end",
      name,
      phase,
      spanId,
      parentSpanId,
      durationMs: _nodePerf_hooks.performance.now() - startedAt,
      attributes: options.attributes
    }, {
      config: options.config,
      env
    });
    return result;
  } catch (error) {
    emitDiagnosticsTimelineEvent({
      type: "span.error",
      name,
      phase,
      spanId,
      parentSpanId,
      durationMs: _nodePerf_hooks.performance.now() - startedAt,
      attributes: options.attributes,
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error)
    }, {
      config: options.config,
      env
    });
    throw error;
  }
}
//#endregion
//#region src/plugins/plugin-control-plane-context.ts
function resolveConfiguredPluginLoadPaths(config) {
  const paths = config?.plugins?.load?.paths;
  return Array.isArray(paths) ? paths : void 0;
}
function resolvePluginDiscoveryContext(params = {}) {
  return (0, _discoveryBEbYTYvv.i)({
    env: params.env ?? process.env,
    workspaceDir: params.workspaceDir,
    loadPaths: [...(params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config) ?? [])]
  });
}
function fingerprintPluginDiscoveryContext(context) {
  return (0, _installedPluginIndexStoreDetkjvO.y)(context);
}
function resolvePluginControlPlaneContext(params = {}) {
  const inventoryFingerprint = params.inventoryFingerprint ?? (params.index ? (0, _manifestRegistryInstalledCr9K7amI.n)(params.index) : void 0);
  return {
    discovery: resolvePluginDiscoveryContext(params),
    policyFingerprint: params.policyHash ?? (0, _installedPluginIndexStoreDetkjvO._)(params.config),
    ...(inventoryFingerprint ? { inventoryFingerprint } : {}),
    ...(params.activationFingerprint ? { activationFingerprint: params.activationFingerprint } : {})
  };
}
function resolvePluginControlPlaneFingerprint(params = {}) {
  return fingerprintPluginControlPlaneContext(resolvePluginControlPlaneContext(params));
}
function fingerprintPluginControlPlaneContext(context) {
  return (0, _installedPluginIndexStoreDetkjvO.y)(context);
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot.ts
function resolvePluginMetadataControlPlaneFingerprint(params) {
  return resolvePluginControlPlaneFingerprint(params);
}
function indexesMatch(left, right) {
  if (!left || !right) return true;
  return (0, _manifestRegistryInstalledCr9K7amI.n)(left) === (0, _manifestRegistryInstalledCr9K7amI.n)(right);
}
function normalizeInstalledPluginIndex(index) {
  return {
    version: index.version ?? 1,
    hostContractVersion: index.hostContractVersion ?? "",
    compatRegistryVersion: index.compatRegistryVersion ?? "",
    migrationVersion: index.migrationVersion ?? 1,
    policyHash: index.policyHash ?? "",
    generatedAtMs: index.generatedAtMs ?? 0,
    installRecords: index.installRecords ?? {},
    plugins: index.plugins ?? [],
    diagnostics: index.diagnostics ?? [],
    ...(index.warning ? { warning: index.warning } : {}),
    ...(index.refreshReason ? { refreshReason: index.refreshReason } : {})
  };
}
function isPluginMetadataSnapshotCompatible(params) {
  const env = params.env ?? process.env;
  return params.snapshot.policyHash === (0, _installedPluginIndexStoreDetkjvO._)(params.config) && (!params.snapshot.configFingerprint || params.snapshot.configFingerprint === resolvePluginMetadataControlPlaneFingerprint({
    config: params.config,
    env,
    index: params.index ?? params.snapshot.index,
    policyHash: params.snapshot.policyHash,
    workspaceDir: params.workspaceDir
  })) && (params.snapshot.workspaceDir ?? "") === (params.workspaceDir ?? "") && indexesMatch(params.snapshot.index, params.index);
}
function appendOwner(owners, ownedId, pluginId) {
  const existing = owners.get(ownedId);
  if (existing) {
    existing.push(pluginId);
    return;
  }
  owners.set(ownedId, [pluginId]);
}
function freezeOwnerMap(owners) {
  return new Map([...owners.entries()].map(([ownedId, pluginIds]) => [ownedId, Object.freeze([...pluginIds])]));
}
function buildPluginMetadataOwnerMaps(plugins) {
  const channels = /* @__PURE__ */new Map();
  const channelConfigs = /* @__PURE__ */new Map();
  const providers = /* @__PURE__ */new Map();
  const modelCatalogProviders = /* @__PURE__ */new Map();
  const cliBackends = /* @__PURE__ */new Map();
  const setupProviders = /* @__PURE__ */new Map();
  const commandAliases = /* @__PURE__ */new Map();
  const contracts = /* @__PURE__ */new Map();
  for (const plugin of plugins) {
    for (const channelId of plugin.channels ?? []) appendOwner(channels, channelId, plugin.id);
    for (const channelId of Object.keys(plugin.channelConfigs ?? {})) appendOwner(channelConfigs, channelId, plugin.id);
    for (const providerId of plugin.providers ?? []) appendOwner(providers, providerId, plugin.id);
    for (const providerId of Object.keys(plugin.modelCatalog?.providers ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
    for (const providerId of Object.keys(plugin.modelCatalog?.aliases ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
    for (const cliBackendId of plugin.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
    for (const cliBackendId of plugin.setup?.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
    for (const setupProvider of plugin.setup?.providers ?? []) appendOwner(setupProviders, setupProvider.id, plugin.id);
    for (const commandAlias of plugin.commandAliases ?? []) appendOwner(commandAliases, commandAlias.name, plugin.id);
    for (const [contract, values] of Object.entries(plugin.contracts ?? {})) if (Array.isArray(values) && values.length > 0) appendOwner(contracts, contract, plugin.id);
  }
  return {
    channels: freezeOwnerMap(channels),
    channelConfigs: freezeOwnerMap(channelConfigs),
    providers: freezeOwnerMap(providers),
    modelCatalogProviders: freezeOwnerMap(modelCatalogProviders),
    cliBackends: freezeOwnerMap(cliBackends),
    setupProviders: freezeOwnerMap(setupProviders),
    commandAliases: freezeOwnerMap(commandAliases),
    contracts: freezeOwnerMap(contracts)
  };
}
function listPluginOriginsFromMetadataSnapshot(snapshot) {
  return new Map(snapshot.plugins.map((record) => [record.id, record.origin]));
}
function loadPluginMetadataSnapshot(params) {
  return measureDiagnosticsTimelineSpanSync("plugins.metadata.scan", () => loadPluginMetadataSnapshotImpl(params), {
    phase: getActiveDiagnosticsTimelineSpan()?.phase ?? "startup",
    config: params.config,
    env: params.env,
    attributes: {
      hasWorkspaceDir: params.workspaceDir !== void 0,
      hasInstalledIndex: params.index !== void 0
    }
  });
}
function loadPluginMetadataSnapshotImpl(params) {
  const totalStartedAt = performance.now();
  const registryStartedAt = performance.now();
  const registryResult = (0, _pluginRegistryCdr1zbpf.m)({
    config: params.config,
    workspaceDir: params.workspaceDir,
    ...(params.stateDir ? { stateDir: params.stateDir } : {}),
    env: params.env,
    ...(params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {}),
    ...(params.index ? { index: params.index } : {})
  }) ?? {
    source: "derived",
    snapshot: { plugins: [] },
    diagnostics: []
  };
  const registrySnapshotMs = performance.now() - registryStartedAt;
  const index = normalizeInstalledPluginIndex(registryResult.snapshot);
  const manifestStartedAt = performance.now();
  const manifestRegistry = index.plugins.length === 0 ? (0, _manifestRegistryDgt5vVG.t)({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    diagnostics: [...index.diagnostics],
    installRecords: index.installRecords
  }) : (0, _manifestRegistryInstalledCr9K7amI.t)({
    index,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includeDisabled: true
  });
  const manifestRegistryMs = performance.now() - manifestStartedAt;
  const normalizePluginId = (0, _pluginRegistryCdr1zbpf.g)(index, { manifestRegistry });
  const byPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
  const ownerMapsStartedAt = performance.now();
  const owners = buildPluginMetadataOwnerMaps(manifestRegistry.plugins);
  const ownerMapsMs = performance.now() - ownerMapsStartedAt;
  const totalMs = performance.now() - totalStartedAt;
  return {
    policyHash: index.policyHash,
    configFingerprint: resolvePluginMetadataControlPlaneFingerprint({
      config: params.config,
      env: params.env,
      index,
      policyHash: index.policyHash,
      workspaceDir: params.workspaceDir
    }),
    ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
    index,
    registryDiagnostics: registryResult.diagnostics,
    manifestRegistry,
    plugins: manifestRegistry.plugins,
    diagnostics: manifestRegistry.diagnostics,
    byPluginId,
    normalizePluginId,
    owners,
    metrics: {
      registrySnapshotMs,
      manifestRegistryMs,
      ownerMapsMs,
      totalMs,
      indexPluginCount: index.plugins.length,
      manifestPluginCount: manifestRegistry.plugins.length
    }
  };
}
//#endregion /* v9-d07c00e3e64a98fc */
