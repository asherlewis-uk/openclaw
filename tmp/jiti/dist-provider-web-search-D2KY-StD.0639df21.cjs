"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveWebSearchProviderCredential;exports.r = resolveCitationRedirectUrl;exports.t = createPluginBackedWebSearchProvider;var _typesSecretsBxqheYvy = require("./types.secrets-BxqheYvy.js");
require("./enable-Cnmqb24T.js");
var _normalizeSecretInputCrCOUFln = require("./normalize-secret-input-CrCOUFln.js");
require("./common-V7-zd73S.js");
require("./external-content-CjyYcKYs.js");
require("./web-shared-B-Y2uCeO.js");
require("./web-search-provider-common-CHdvpLZ1.js");
var _webGuardedFetchHhVIx3eo = require("./web-guarded-fetch-hhVIx3eo.js");
//#region src/agents/tools/web-search-citation-redirect.ts
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
  try {
    return await (0, _webGuardedFetchHhVIx3eo.r)({
      url,
      init: { method: "HEAD" },
      timeoutMs: REDIRECT_TIMEOUT_MS
    }, async ({ finalUrl }) => finalUrl || url);
  } catch {
    return url;
  }
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
function resolveWebSearchProviderCredential(params) {
  const fromConfig = (0, _normalizeSecretInputCrCOUFln.n)((0, _typesSecretsBxqheYvy.d)(params.credentialValue));
  if (fromConfig) return fromConfig;
  const credentialRef = (0, _typesSecretsBxqheYvy.m)({ value: params.credentialValue }).ref;
  if (credentialRef) {
    if (credentialRef.source !== "env") return;
    const fromEnvRef = (0, _normalizeSecretInputCrCOUFln.n)(process.env[credentialRef.id]);
    if (fromEnvRef) return fromEnvRef;
    return;
  }
  for (const envVar of params.envVars) {
    const fromEnv = (0, _normalizeSecretInputCrCOUFln.n)(process.env[envVar]);
    if (fromEnv) return fromEnv;
  }
}
//#endregion
//#region src/plugin-sdk/provider-web-search.ts
/**
* @deprecated Implement provider-owned `createTool(...)` directly on the
* returned WebSearchProviderPlugin instead of routing through core.
*/
function createPluginBackedWebSearchProvider(provider) {
  return {
    ...provider,
    createTool: () => {
      throw new Error(`createPluginBackedWebSearchProvider(${provider.id}) is no longer supported. Define provider-owned createTool(...) directly in the extension's WebSearchProviderPlugin.`);
    }
  };
}
//#endregion /* v9-b670256c29277f25 */
