"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveFallbackXaiAuth;exports.r = resolveXaiToolApiKeyWithAuth;exports.t = isXaiToolEnabled;var _typesSecretsBxqheYvy = require("./types.secrets-BxqheYvy.js");
var _modelAuthMarkersUDEQVW7W = require("./model-auth-markers-UDEQVW7W.js");
var _webSearchProviderCommonCHdvpLZ = require("./web-search-provider-common-CHdvpLZ1.js");
require("./provider-auth-D5QGE8z6.js");
require("./secret-input-DlbCRffO.js");
var _extensionSharedBznPIaO = require("./extension-shared-BznPIa-o.js");
var _webSearchProviderConfigBmnIzf0a = require("./web-search-provider-config-BmnIzf0a.js");
require("./provider-web-search-D2KY-StD.js");
//#region extensions/xai/src/tool-auth-shared.ts
const XAI_API_KEY_ENV_VAR = "XAI_API_KEY";
const XAI_PROVIDER_ID = "xai";
function readConfiguredOrManagedApiKey(value) {
  const literal = (0, _typesSecretsBxqheYvy.d)(value);
  if (literal) return literal;
  const ref = (0, _typesSecretsBxqheYvy.o)(value);
  return ref ? (0, _modelAuthMarkersUDEQVW7W.h)(ref.source) : void 0;
}
function readLegacyGrokFallbackAuth(cfg) {
  const search = cfg?.tools?.web?.search;
  if (!search || typeof search !== "object") return;
  const grok = search.grok;
  const apiKey = readConfiguredOrManagedApiKey(grok && typeof grok === "object" ? grok.apiKey : void 0);
  return apiKey ? {
    apiKey,
    source: "tools.web.search.grok.apiKey"
  } : void 0;
}
function readConfiguredRuntimeApiKey(value, path, cfg) {
  const resolved = (0, _typesSecretsBxqheYvy.h)({
    value,
    path,
    defaults: cfg?.secrets?.defaults,
    mode: "inspect"
  });
  if (resolved.status === "available") return {
    status: "available",
    value: resolved.value
  };
  if (resolved.status === "missing") return { status: "missing" };
  if (resolved.ref.source !== "env") return { status: "blocked" };
  const envVarName = resolved.ref.id.trim();
  if (envVarName !== XAI_API_KEY_ENV_VAR) return { status: "blocked" };
  if (!(0, _extensionSharedBznPIaO.i)({
    cfg,
    provider: resolved.ref.provider,
    id: envVarName
  })) return { status: "blocked" };
  const envValue = (0, _typesSecretsBxqheYvy.d)(process.env[envVarName]);
  return envValue ? {
    status: "available",
    value: envValue
  } : { status: "missing" };
}
function readLegacyGrokApiKeyResult(cfg) {
  const search = cfg?.tools?.web?.search;
  if (!search || typeof search !== "object") return { status: "missing" };
  const grok = search.grok;
  return readConfiguredRuntimeApiKey(grok && typeof grok === "object" ? grok.apiKey : void 0, "tools.web.search.grok.apiKey", cfg);
}
function readPluginXaiWebSearchApiKeyResult(cfg) {
  return readConfiguredRuntimeApiKey((0, _webSearchProviderConfigBmnIzf0a.i)(cfg, "xai")?.apiKey, "plugins.entries.xai.config.webSearch.apiKey", cfg);
}
function resolveConfiguredXaiToolApiKeyResult(params) {
  const runtimePlugin = readPluginXaiWebSearchApiKeyResult(params.runtimeConfig);
  if (runtimePlugin.status === "available" || runtimePlugin.status === "blocked") return runtimePlugin;
  const runtimeLegacy = readLegacyGrokApiKeyResult(params.runtimeConfig);
  if (runtimeLegacy.status === "available" || runtimeLegacy.status === "blocked") return runtimeLegacy;
  const sourcePlugin = readPluginXaiWebSearchApiKeyResult(params.sourceConfig);
  if (sourcePlugin.status === "available" || sourcePlugin.status === "blocked") return sourcePlugin;
  const sourceLegacy = readLegacyGrokApiKeyResult(params.sourceConfig);
  if (sourceLegacy.status === "available" || sourceLegacy.status === "blocked") return sourceLegacy;
  return { status: "missing" };
}
function hasXaiAuthProfile(auth) {
  return auth?.hasAuthForProvider?.(XAI_PROVIDER_ID) === true;
}
async function resolveXaiAuthProfileApiKey(auth) {
  return (0, _typesSecretsBxqheYvy.d)(await auth?.resolveApiKeyForProvider?.(XAI_PROVIDER_ID));
}
function resolveFallbackXaiAuth(cfg) {
  const pluginApiKey = readConfiguredOrManagedApiKey((0, _webSearchProviderConfigBmnIzf0a.i)(cfg, "xai")?.apiKey);
  if (pluginApiKey) return {
    apiKey: pluginApiKey,
    source: "plugins.entries.xai.config.webSearch.apiKey"
  };
  return readLegacyGrokFallbackAuth(cfg);
}
async function resolveXaiToolApiKeyWithAuth(params) {
  const configured = resolveConfiguredXaiToolApiKeyResult(params);
  if (configured.status === "available") return configured.value;
  if (configured.status === "blocked") return;
  return (await resolveXaiAuthProfileApiKey(params.auth)) ?? (0, _webSearchProviderCommonCHdvpLZ.p)([XAI_API_KEY_ENV_VAR]);
}
function isXaiToolEnabled(params) {
  if (params.enabled === false) return false;
  const configured = resolveConfiguredXaiToolApiKeyResult(params);
  if (configured.status === "available") return true;
  if (configured.status === "blocked") return false;
  return hasXaiAuthProfile(params.auth) || Boolean((0, _webSearchProviderCommonCHdvpLZ.p)([XAI_API_KEY_ENV_VAR]));
}
//#endregion /* v9-0c62b3f0746a25d6 */
