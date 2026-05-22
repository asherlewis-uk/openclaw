"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolvePluginProviders;exports.r = resolveProviderConfigApiOwnerHint;exports.t = isPluginProvidersLoadInFlight;var _providerIdCz7K6wgK = require("./provider-id-Cz7K6wgK.js");
var _pluginScopeD0hUY2Gw = require("./plugin-scope-D0hUY2Gw.js");
var _pluginAutoEnableDLIxCAM = require("./plugin-auto-enable-DLIxCAM0.js");
var _activationContextBswEn1PI = require("./activation-context-BswEn1PI.js");
var _activationPlannerBqLR383f = require("./activation-planner-BqLR383f.js");
var _loaderDkTFEskE = require("./loader-DkTFEskE.js");
var _runtimeCFKT2mp_ = require("./runtime-CFKT2mp_.js");
var _activeRuntimeRegistryCToOMaT = require("./active-runtime-registry-CToOMaT0.js");
var _loadContext44_qDmo = require("./load-context-44_qDmo1.js");
//#region src/plugins/provider-config-owner.ts
function resolveProviderConfigApiOwnerHint(params) {
  const providers = params.config?.models?.providers;
  if (!providers) return;
  const normalizedProvider = (0, _providerIdCz7K6wgK.r)(params.provider);
  if (!normalizedProvider) return;
  const providerConfig = providers[params.provider] ?? Object.entries(providers).find(([candidateId]) => (0, _providerIdCz7K6wgK.r)(candidateId) === normalizedProvider)?.[1];
  const api = typeof providerConfig?.api === "string" ? (0, _providerIdCz7K6wgK.r)(providerConfig.api) : "";
  if (!api || api === normalizedProvider) return;
  return api;
}
//#endregion
//#region src/plugins/providers.runtime.ts
function dedupeSortedPluginIds(values) {
  return [...new Set(values)].toSorted((left, right) => left.localeCompare(right));
}
function resolveExplicitProviderOwnerPluginIds(params) {
  return dedupeSortedPluginIds(params.providerRefs.flatMap((provider) => {
    const plannedPluginIds = (0, _activationPlannerBqLR383f.t)({
      trigger: {
        kind: "provider",
        provider
      },
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env
    });
    if (plannedPluginIds.length > 0) return plannedPluginIds;
    const apiOwnerHint = resolveProviderConfigApiOwnerHint({
      provider,
      config: params.config
    });
    if (apiOwnerHint) {
      const apiOwnerPluginIds = (0, _activationPlannerBqLR383f.t)({
        trigger: {
          kind: "provider",
          provider: apiOwnerHint
        },
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env
      });
      if (apiOwnerPluginIds.length > 0) return apiOwnerPluginIds;
      const legacyApiOwnerPluginIds = (0, _pluginAutoEnableDLIxCAM.h)({
        provider: apiOwnerHint,
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env
      });
      if (legacyApiOwnerPluginIds?.length) return legacyApiOwnerPluginIds;
    }
    return (0, _pluginAutoEnableDLIxCAM.h)({
      provider,
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env
    }) ?? [];
  }));
}
function mergeExplicitOwnerPluginIds(providerPluginIds, explicitOwnerPluginIds) {
  if (explicitOwnerPluginIds.length === 0) return [...providerPluginIds];
  return dedupeSortedPluginIds([...providerPluginIds, ...explicitOwnerPluginIds]);
}
function resolvePluginProviderLoadBase(params) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? (0, _runtimeCFKT2mp_.c)();
  const providerOwnedPluginIds = params.providerRefs?.length ? resolveExplicitProviderOwnerPluginIds({
    providerRefs: params.providerRefs,
    config: params.config,
    workspaceDir,
    env
  }) : [];
  const modelOwnedPluginIds = params.modelRefs?.length ? (0, _pluginAutoEnableDLIxCAM.m)({
    models: params.modelRefs,
    config: params.config,
    workspaceDir,
    env
  }) : [];
  return {
    env,
    workspaceDir,
    requestedPluginIds: (0, _pluginScopeD0hUY2Gw.n)(params.onlyPluginIds) || params.providerRefs?.length || params.modelRefs?.length || providerOwnedPluginIds.length > 0 || modelOwnedPluginIds.length > 0 ? [...new Set([
    ...(params.onlyPluginIds ?? []),
    ...providerOwnedPluginIds,
    ...modelOwnedPluginIds]
    )].toSorted((left, right) => left.localeCompare(right)) : void 0,
    explicitOwnerPluginIds: dedupeSortedPluginIds([...providerOwnedPluginIds, ...modelOwnedPluginIds]),
    rawConfig: params.config
  };
}
function resolveSetupProviderPluginLoadState(params, base) {
  const setupPluginIds = mergeExplicitOwnerPluginIds((0, _pluginAutoEnableDLIxCAM.u)({
    config: params.config,
    workspaceDir: base.workspaceDir,
    env: base.env,
    onlyPluginIds: base.requestedPluginIds,
    includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins
  }), (0, _pluginAutoEnableDLIxCAM.l)({
    pluginIds: base.explicitOwnerPluginIds,
    config: params.config,
    workspaceDir: base.workspaceDir,
    env: base.env,
    includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins
  }));
  if (setupPluginIds.length === 0) return;
  const setupConfig = (0, _activationContextBswEn1PI.r)({
    config: base.rawConfig,
    pluginIds: setupPluginIds
  });
  return { loadOptions: (0, _loadContext44_qDmo.n)({
      config: setupConfig,
      activationSourceConfig: setupConfig,
      autoEnabledReasons: {},
      workspaceDir: base.workspaceDir,
      env: base.env,
      logger: (0, _loadContext44_qDmo.r)()
    }, {
      onlyPluginIds: setupPluginIds,
      pluginSdkResolution: params.pluginSdkResolution,
      cache: params.cache ?? false,
      activate: params.activate ?? false
    }) };
}
function resolveRuntimeProviderPluginLoadState(params, base) {
  const explicitOwnerPluginIds = (0, _pluginAutoEnableDLIxCAM.o)({
    pluginIds: base.explicitOwnerPluginIds,
    config: base.rawConfig,
    workspaceDir: base.workspaceDir,
    env: base.env,
    includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins
  });
  const runtimeRequestedPluginIds = base.requestedPluginIds !== void 0 ? dedupeSortedPluginIds([...(params.onlyPluginIds ?? []), ...explicitOwnerPluginIds]) : void 0;
  const activation = (0, _activationContextBswEn1PI.t)({
    rawConfig: (0, _activationContextBswEn1PI.r)({
      config: base.rawConfig,
      pluginIds: explicitOwnerPluginIds
    }),
    env: base.env,
    workspaceDir: base.workspaceDir,
    onlyPluginIds: runtimeRequestedPluginIds,
    applyAutoEnable: params.applyAutoEnable ?? true,
    compatMode: {
      allowlist: params.bundledProviderAllowlistCompat,
      enablement: "allowlist",
      vitest: params.bundledProviderVitestCompat
    },
    resolveCompatPluginIds: _pluginAutoEnableDLIxCAM.s
  });
  const config = params.bundledProviderVitestCompat ? (0, _pluginAutoEnableDLIxCAM.g)({
    config: activation.config,
    pluginIds: activation.compatPluginIds,
    env: base.env
  }) : activation.config;
  const providerPluginIds = mergeExplicitOwnerPluginIds((0, _pluginAutoEnableDLIxCAM.d)({
    config,
    workspaceDir: base.workspaceDir,
    env: base.env,
    onlyPluginIds: runtimeRequestedPluginIds
  }), explicitOwnerPluginIds);
  return { loadOptions: (0, _loadContext44_qDmo.n)({
      config,
      activationSourceConfig: activation.activationSourceConfig,
      autoEnabledReasons: activation.autoEnabledReasons,
      workspaceDir: base.workspaceDir,
      env: base.env,
      logger: (0, _loadContext44_qDmo.r)()
    }, {
      onlyPluginIds: providerPluginIds,
      pluginSdkResolution: params.pluginSdkResolution,
      cache: params.cache ?? true,
      activate: params.activate ?? false
    }) };
}
function isPluginProvidersLoadInFlight(params) {
  const base = resolvePluginProviderLoadBase(params);
  const loadState = params.mode === "setup" ? resolveSetupProviderPluginLoadState(params, base) : resolveRuntimeProviderPluginLoadState(params, base);
  if (!loadState) return false;
  return (0, _loaderDkTFEskE.s)(loadState.loadOptions);
}
function resolvePluginProviders(params) {
  const base = resolvePluginProviderLoadBase(params);
  if (params.mode === "setup") {
    const loadState = resolveSetupProviderPluginLoadState(params, base);
    if (!loadState) return [];
    return (0, _loaderDkTFEskE.l)(loadState.loadOptions).providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
  }
  const loadState = resolveRuntimeProviderPluginLoadState(params, base);
  const registry = loadState.loadOptions.onlyPluginIds?.length === 0 ? void 0 : (0, _activeRuntimeRegistryCToOMaT.n)({
    env: base.env,
    loadOptions: loadState.loadOptions,
    workspaceDir: base.workspaceDir,
    requiredPluginIds: loadState.loadOptions.onlyPluginIds
  }) ?? (0, _loaderDkTFEskE.o)(loadState.loadOptions);
  if (!registry) return [];
  return registry.providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
}
//#endregion /* v9-2694318f9517eef8 */
