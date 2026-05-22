"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = modelSelectionShouldEnsureCodexPlugin;exports.c = shouldRouteOpenAIPiThroughCodexAuthProvider;exports.i = listOpenAIAuthProfileProvidersForAgentRuntime;exports.n = isOpenAICodexProvider;exports.o = openAIProviderUsesCodexRuntimeByDefault;exports.r = isOpenAIProvider;exports.s = resolveOpenAIRuntimeProviderForPi;exports.t = void 0;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _providerIdCz7K6wgK = require("./provider-id-Cz7K6wgK.js");
var _providerAuthAliases3NFJcokO = require("./provider-auth-aliases-3NFJcokO.js");
var _runtimeD2Px3Q1Z = require("./runtime-d2Px3Q1Z.js");
//#region src/agents/openai-codex-routing.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = exports.t = "openai-codex";
function isOfficialOpenAIBaseUrl(baseUrl) {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) return true;
  try {
    const url = new URL(baseUrl.trim());
    return url.protocol === "https:" && url.hostname.toLowerCase() === "api.openai.com" && (url.pathname === "" || url.pathname === "/" || url.pathname === "/v1" || url.pathname === "/v1/");
  } catch {
    return false;
  }
}
function openAIProviderUsesCustomBaseUrl(config) {
  return !isOfficialOpenAIBaseUrl(config?.models?.providers?.openai?.baseUrl);
}
function isOpenAIProvider(provider) {
  return (0, _providerIdCz7K6wgK.r)(provider ?? "") === OPENAI_PROVIDER_ID;
}
function isOpenAICodexProvider(provider) {
  return (0, _providerIdCz7K6wgK.r)(provider ?? "") === OPENAI_CODEX_PROVIDER_ID;
}
function openAIProviderUsesCodexRuntimeByDefault(params) {
  return isOpenAIProvider(params.provider) && !openAIProviderUsesCustomBaseUrl(params.config);
}
function parseModelRefProvider(value) {
  if (typeof value !== "string") return;
  const slashIndex = value.trim().indexOf("/");
  if (slashIndex <= 0) return;
  return (0, _providerIdCz7K6wgK.r)(value.trim().slice(0, slashIndex));
}
function modelSelectionShouldEnsureCodexPlugin(params) {
  const provider = parseModelRefProvider(params.model);
  if (provider === "openai-codex") return true;
  return provider === "openai" && !openAIProviderUsesCustomBaseUrl(params.config);
}
function hasOpenAICodexAuthProfileOverride(value) {
  return typeof value === "string" && (0, _stringCoerceLndEvhRk.s)(value)?.startsWith(`openai-codex:`) === true;
}
function shouldRouteOpenAIPiThroughCodexAuthProvider(params) {
  if (!isOpenAIProvider(params.provider) || !hasOpenAICodexAuthProfileOverride(params.authProfileId)) return false;
  if ((0, _runtimeD2Px3Q1Z.t)(params.agentHarnessId ?? params.harnessRuntime) !== "pi") return false;
  const aliasLookupParams = {
    config: params.config,
    workspaceDir: params.workspaceDir
  };
  return (0, _providerAuthAliases3NFJcokO.r)(params.authProfileProvider ?? params.authProfileId?.split(":", 1)[0] ?? "", aliasLookupParams) === OPENAI_CODEX_PROVIDER_ID;
}
function listOpenAIAuthProfileProvidersForAgentRuntime(params) {
  if (!isOpenAIProvider(params.provider)) return [params.provider];
  const runtime = (0, _runtimeD2Px3Q1Z.t)(normalizeExplicitRuntimePin(params.agentHarnessId) ?? params.harnessRuntime);
  if (runtime === "codex") return [OPENAI_CODEX_PROVIDER_ID];
  if (runtime === "pi") return [OPENAI_PROVIDER_ID, OPENAI_CODEX_PROVIDER_ID];
  return [params.provider];
}
function normalizeExplicitRuntimePin(value) {
  if (typeof value !== "string" || !value.trim()) return;
  const runtime = (0, _runtimeD2Px3Q1Z.t)(value);
  return runtime === "auto" || runtime === "default" ? void 0 : runtime;
}
function resolveOpenAIRuntimeProviderForPi(params) {
  return shouldRouteOpenAIPiThroughCodexAuthProvider(params) ? OPENAI_CODEX_PROVIDER_ID : params.provider;
}
//#endregion /* v9-b0866df4ebef0d15 */
