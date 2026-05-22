"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = resolveModelRuntimePolicy;var _providerIdCz7K6wgK = require("./provider-id-Cz7K6wgK.js");
var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _agentScopeConfig26EcJVc = require("./agent-scope-config-26EcJVc0.js");
var _agentScopeC1Fl7gAf = require("./agent-scope-C1Fl7gAf.js");
//#region src/agents/model-runtime-policy.ts
function hasRuntimePolicy(value) {
  return Boolean(value?.id?.trim());
}
function resolveProviderConfig(config, provider) {
  if (!config?.models?.providers || !provider?.trim()) return;
  const providers = config.models.providers;
  const direct = providers[provider];
  if (direct) return direct;
  const normalizedProvider = (0, _providerIdCz7K6wgK.r)(provider);
  for (const [candidateProvider, providerConfig] of Object.entries(providers)) if ((0, _providerIdCz7K6wgK.r)(candidateProvider) === normalizedProvider) return providerConfig;
}
function normalizeModelIdForProvider(provider, modelId) {
  const trimmed = modelId?.trim();
  if (!trimmed) return;
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return trimmed;
  const modelProvider = (0, _providerIdCz7K6wgK.r)(trimmed.slice(0, slash));
  const expectedProvider = (0, _providerIdCz7K6wgK.r)(provider ?? "");
  if (expectedProvider && modelProvider !== expectedProvider) return;
  return trimmed.slice(slash + 1).trim() || void 0;
}
function modelEntryMatches(params) {
  const entryId = params.entry.id.trim();
  if (entryId === params.modelId) return true;
  const slash = entryId.indexOf("/");
  if (slash <= 0) return false;
  return (0, _providerIdCz7K6wgK.r)(entryId.slice(0, slash)) === (0, _providerIdCz7K6wgK.r)(params.provider ?? "") && entryId.slice(slash + 1).trim() === params.modelId;
}
function modelKeyMatches(params) {
  return modelEntryMatches({
    entry: { id: params.key },
    provider: params.provider,
    modelId: params.modelId
  });
}
function resolveAgentModelEntryRuntimePolicy(params) {
  const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
  if (!params.config || !modelId) return {};
  const { sessionAgentId } = (0, _agentScopeC1Fl7gAf.m)({
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey
  });
  const modelMaps = [(0, _agentScopeConfig26EcJVc.t)(params.config).find((entry) => (0, _sessionKeyDFEyR49L.c)(entry.id) === sessionAgentId)?.models, params.config.agents?.defaults?.models];
  for (const models of modelMaps) for (const [key, entry] of Object.entries(models ?? {})) if (modelKeyMatches({
    key,
    provider: params.provider,
    modelId
  }) && hasRuntimePolicy(entry?.agentRuntime)) return {
    policy: entry.agentRuntime,
    source: "model"
  };
  return {};
}
function resolveModelConfig(params) {
  const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
  if (!modelId || !Array.isArray(params.providerConfig?.models)) return;
  return params.providerConfig.models.find((entry) => modelEntryMatches({
    entry,
    provider: params.provider,
    modelId
  }));
}
function resolveModelRuntimePolicy(params) {
  const agentModelPolicy = resolveAgentModelEntryRuntimePolicy(params);
  if (agentModelPolicy.policy) return agentModelPolicy;
  const providerConfig = resolveProviderConfig(params.config, params.provider);
  const modelConfig = resolveModelConfig({
    providerConfig,
    provider: params.provider,
    modelId: params.modelId
  });
  if (hasRuntimePolicy(modelConfig?.agentRuntime)) return {
    policy: modelConfig?.agentRuntime,
    source: "model"
  };
  if (hasRuntimePolicy(providerConfig?.agentRuntime)) return {
    policy: providerConfig?.agentRuntime,
    source: "provider"
  };
  return {};
}
//#endregion /* v9-8965281d7b8c3108 */
