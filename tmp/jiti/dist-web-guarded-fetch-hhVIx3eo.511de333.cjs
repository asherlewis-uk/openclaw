"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.i = withTrustedWebToolsEndpoint;exports.n = withSelfHostedWebToolsEndpoint;exports.r = withStrictWebToolsEndpoint;exports.t = fetchWithWebToolsNetworkGuard;var _ssrfCYoLqc2K = require("./ssrf-CYoLqc2K.js");
var _fetchGuardB7xT8hT = require("./fetch-guard-B7xT8hT9.js");
//#region src/agents/tools/web-guarded-fetch.ts
const WEB_TOOLS_SELF_HOSTED_NETWORK_SSRF_POLICY = {
  dangerouslyAllowPrivateNetwork: true,
  allowRfc2544BenchmarkRange: true,
  allowIpv6UniqueLocalRange: true
};
function resolveTimeoutMs(params) {
  if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) return params.timeoutMs;
  if (typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds)) return params.timeoutSeconds * 1e3;
}
async function fetchWithWebToolsNetworkGuard(params) {
  const { timeoutSeconds, useEnvProxy, ...rest } = params;
  const resolved = {
    ...rest,
    timeoutMs: resolveTimeoutMs({
      timeoutMs: rest.timeoutMs,
      timeoutSeconds
    })
  };
  return (0, _fetchGuardB7xT8hT.n)(useEnvProxy ? (0, _fetchGuardB7xT8hT.a)(resolved) : (0, _fetchGuardB7xT8hT.i)(resolved));
}
async function withWebToolsNetworkGuard(params, run) {
  const { response, finalUrl, release } = await fetchWithWebToolsNetworkGuard(params);
  try {
    return await run({
      response,
      finalUrl
    });
  } finally {
    await release();
  }
}
async function withTrustedWebToolsEndpoint(params, run) {
  const trustedPolicy = (0, _ssrfCYoLqc2K.v)(params.url) ?? {};
  return await withWebToolsNetworkGuard({
    ...params,
    policy: trustedPolicy,
    useEnvProxy: true
  }, run);
}
async function withSelfHostedWebToolsEndpoint(params, run) {
  return await withWebToolsNetworkGuard({
    ...params,
    policy: WEB_TOOLS_SELF_HOSTED_NETWORK_SSRF_POLICY,
    useEnvProxy: true
  }, run);
}
async function withStrictWebToolsEndpoint(params, run) {
  return await withWebToolsNetworkGuard(params, run);
}
//#endregion /* v9-377d30de01b8ae55 */
