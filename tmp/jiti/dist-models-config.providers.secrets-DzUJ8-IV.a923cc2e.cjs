"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = normalizeHeaderValues;exports.c = resolveMissingProviderApiKey;exports.i = normalizeConfiguredProviderApiKey;exports.n = createProviderAuthResolver;exports.o = normalizeResolvedEnvApiKey;exports.r = normalizeApiKeyConfig;exports.s = resolveApiKeyFromProfiles;exports.t = createProviderApiKeyResolver;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _typesSecretsBxqheYvy = require("./types.secrets-BxqheYvy.js");
var _refContractBLk8mcqQ = require("./ref-contract-BLk8mcqQ.js");
var _providerAuthAliases3NFJcokO = require("./provider-auth-aliases-3NFJcokO.js");
var _providerRuntimeDXB7r8u = require("./provider-runtime-DXB7r8u2.js");
var _modelAuthMarkersUDEQVW7W = require("./model-auth-markers-UDEQVW7W.js");
var _normalizeSecretInputCrCOUFln = require("./normalize-secret-input-CrCOUFln.js");
var _modelAuthEnvCblHr3q = require("./model-auth-env-CblHr3q1.js");
var _modelAuthRuntimeSharedWzqc0OTs = require("./model-auth-runtime-shared-wzqc0OTs.js");
//#region src/agents/models-config.providers.secret-helpers.ts
const ENV_VAR_NAME_RE$1 = /^[A-Z_][A-Z0-9_]*$/;
function normalizeApiKeyConfig(value) {
  const trimmed = value.trim();
  return /^\$\{([A-Z0-9_]+)\}$/.exec(trimmed)?.[1] ?? trimmed;
}
function toDiscoveryApiKey(value) {
  const trimmed = (0, _stringCoerceLndEvhRk.c)(value);
  if (!trimmed || (0, _modelAuthMarkersUDEQVW7W.u)(trimmed)) return;
  return trimmed;
}
function resolveEnvApiKeyVarName(provider, env = process.env) {
  const resolved = (0, _modelAuthEnvCblHr3q.t)(provider, env);
  if (!resolved) return;
  const match = /^(?:env: |shell env: )([A-Z0-9_]+)$/.exec(resolved.source);
  return match ? match[1] : void 0;
}
function resolveAwsSdkApiKeyVarName(env = process.env) {
  return (0, _modelAuthRuntimeSharedWzqc0OTs.n)(env);
}
function normalizeHeaderValues(params) {
  const { headers } = params;
  if (!headers) return {
    headers,
    mutated: false
  };
  let mutated = false;
  const nextHeaders = {};
  for (const [headerName, headerValue] of Object.entries(headers)) {
    const resolvedRef = (0, _typesSecretsBxqheYvy.m)({
      value: headerValue,
      defaults: params.secretDefaults
    }).ref;
    if (!resolvedRef || !resolvedRef.id.trim()) {
      nextHeaders[headerName] = headerValue;
      continue;
    }
    mutated = true;
    nextHeaders[headerName] = resolvedRef.source === "env" ? (0, _modelAuthMarkersUDEQVW7W.m)(resolvedRef.id) : (0, _modelAuthMarkersUDEQVW7W.g)(resolvedRef.source);
  }
  if (!mutated) return {
    headers,
    mutated: false
  };
  return {
    headers: nextHeaders,
    mutated: true
  };
}
function resolveApiKeyFromCredential(cred, env = process.env) {
  if (!cred) return;
  if (cred.type === "api_key") {
    const keyRef = (0, _typesSecretsBxqheYvy.o)(cred.keyRef);
    if (keyRef && keyRef.id.trim()) {
      if (keyRef.source === "env") {
        const envVar = keyRef.id.trim();
        return {
          apiKey: envVar,
          source: "env-ref",
          discoveryApiKey: toDiscoveryApiKey(env[envVar])
        };
      }
      return {
        apiKey: (0, _modelAuthMarkersUDEQVW7W.h)(keyRef.source),
        source: "non-env-ref"
      };
    }
    if (cred.key?.trim()) return {
      apiKey: cred.key,
      source: "plaintext",
      discoveryApiKey: toDiscoveryApiKey(cred.key)
    };
    return;
  }
  if (cred.type === "token") {
    const tokenRef = (0, _typesSecretsBxqheYvy.o)(cred.tokenRef);
    if (tokenRef && tokenRef.id.trim()) {
      if (tokenRef.source === "env") {
        const envVar = tokenRef.id.trim();
        return {
          apiKey: envVar,
          source: "env-ref",
          discoveryApiKey: toDiscoveryApiKey(env[envVar])
        };
      }
      return {
        apiKey: (0, _modelAuthMarkersUDEQVW7W.h)(tokenRef.source),
        source: "non-env-ref"
      };
    }
    if (cred.token?.trim()) return {
      apiKey: cred.token,
      source: "plaintext",
      discoveryApiKey: toDiscoveryApiKey(cred.token)
    };
  }
}
function listAuthProfilesForProvider(store, provider) {
  const providerKey = (0, _providerAuthAliases3NFJcokO.r)(provider);
  return Object.entries(store.profiles).filter(([, cred]) => (0, _providerAuthAliases3NFJcokO.r)(cred.provider) === providerKey).map(([id]) => id);
}
function resolveApiKeyFromProfiles(params) {
  const ids = listAuthProfilesForProvider(params.store, params.provider);
  for (const id of ids) {
    const resolved = resolveApiKeyFromCredential(params.store.profiles[id], params.env);
    if (resolved) return resolved;
  }
}
function normalizeConfiguredProviderApiKey(params) {
  const configuredApiKey = params.provider.apiKey;
  const configuredApiKeyRef = (0, _typesSecretsBxqheYvy.m)({
    value: configuredApiKey,
    defaults: params.secretDefaults
  }).ref;
  if (configuredApiKeyRef && configuredApiKeyRef.id.trim()) {
    const marker = configuredApiKeyRef.source === "env" ? configuredApiKeyRef.id.trim() : (0, _modelAuthMarkersUDEQVW7W.h)(configuredApiKeyRef.source);
    params.secretRefManagedProviders?.add(params.providerKey);
    if (params.provider.apiKey === marker) return params.provider;
    return {
      ...params.provider,
      apiKey: marker
    };
  }
  if (typeof configuredApiKey !== "string") return params.provider;
  const normalizedConfiguredApiKey = normalizeApiKeyConfig(configuredApiKey);
  if ((0, _modelAuthMarkersUDEQVW7W.u)(normalizedConfiguredApiKey)) params.secretRefManagedProviders?.add(params.providerKey);
  if (params.profileApiKey && params.profileApiKey.source !== "plaintext" && normalizedConfiguredApiKey === params.profileApiKey.apiKey) params.secretRefManagedProviders?.add(params.providerKey);
  if (normalizedConfiguredApiKey === configuredApiKey) return params.provider;
  return {
    ...params.provider,
    apiKey: normalizedConfiguredApiKey
  };
}
function normalizeResolvedEnvApiKey(params) {
  const currentApiKey = params.provider.apiKey;
  if (typeof currentApiKey !== "string" || !currentApiKey.trim() || ENV_VAR_NAME_RE$1.test(currentApiKey.trim())) return params.provider;
  const envVarName = resolveEnvApiKeyVarName(params.providerKey, params.env);
  if (!envVarName || params.env[envVarName] !== currentApiKey) return params.provider;
  params.secretRefManagedProviders?.add(params.providerKey);
  return {
    ...params.provider,
    apiKey: envVarName
  };
}
function resolveMissingProviderApiKey(params) {
  const hasModels = Array.isArray(params.provider.models) && params.provider.models.length > 0;
  const normalizedApiKey = (0, _normalizeSecretInputCrCOUFln.t)(params.provider.apiKey);
  const hasConfiguredApiKey = Boolean(normalizedApiKey || params.provider.apiKey);
  if (!hasModels || hasConfiguredApiKey) return params.provider;
  const authMode = params.provider.auth;
  if (params.providerApiKeyResolver && (!authMode || authMode === "aws-sdk")) {
    const resolvedApiKey = params.providerApiKeyResolver(params.env);
    if (!resolvedApiKey) return params.provider;
    return {
      ...params.provider,
      apiKey: resolvedApiKey
    };
  }
  if (authMode === "aws-sdk") {
    const awsEnvVar = resolveAwsSdkApiKeyVarName(params.env);
    if (!awsEnvVar) return params.provider;
    return {
      ...params.provider,
      apiKey: awsEnvVar
    };
  }
  const apiKey = resolveEnvApiKeyVarName(params.providerKey, params.env) ?? params.profileApiKey?.apiKey;
  if (!apiKey?.trim()) return params.provider;
  if (params.profileApiKey && params.profileApiKey.source !== "plaintext") params.secretRefManagedProviders?.add(params.providerKey);
  return {
    ...params.provider,
    apiKey
  };
}
//#endregion
//#region src/agents/models-config.providers.secrets.ts
const ENV_VAR_NAME_RE = /^[A-Z_][A-Z0-9_]*$/;
function canResolveEnvSecretRefInConfigAuth(params) {
  const providerName = params.provider.trim();
  const providerConfig = params.config?.secrets?.providers?.[providerName];
  if (!providerConfig) return providerName === (0, _refContractBLk8mcqQ.l)(params.config ?? {}, "env");
  if (providerConfig.source !== "env") return false;
  const allowlist = providerConfig.allowlist;
  return !allowlist || allowlist.includes(params.id);
}
function resolveAuthProfileStoreInput(input) {
  return typeof input === "function" ? input() : input;
}
function createProviderApiKeyResolver(env, authStoreInput, config) {
  return (provider) => {
    const authProvider = (0, _providerAuthAliases3NFJcokO.r)(provider, {
      config,
      env
    });
    const envVar = resolveEnvApiKeyVarName(authProvider, env);
    if (envVar) return {
      apiKey: envVar,
      discoveryApiKey: toDiscoveryApiKey(env[envVar])
    };
    const fromConfig = resolveConfigBackedProviderAuth({
      provider: authProvider,
      config,
      env
    });
    if (fromConfig?.apiKey) return {
      apiKey: fromConfig.apiKey,
      discoveryApiKey: fromConfig.discoveryApiKey
    };
    const fromProfiles = resolveApiKeyFromProfiles({
      provider: authProvider,
      store: resolveAuthProfileStoreInput(authStoreInput),
      env
    });
    return fromProfiles?.apiKey ? {
      apiKey: fromProfiles.apiKey,
      discoveryApiKey: fromProfiles.discoveryApiKey
    } : {
      apiKey: void 0,
      discoveryApiKey: void 0
    };
  };
}
function createProviderAuthResolver(env, authStoreInput, config) {
  return (provider, options) => {
    const authProvider = (0, _providerAuthAliases3NFJcokO.r)(provider, {
      config,
      env
    });
    const authStore = resolveAuthProfileStoreInput(authStoreInput);
    const ids = listAuthProfilesForProvider(authStore, authProvider);
    let oauthCandidate;
    for (const id of ids) {
      const cred = authStore.profiles[id];
      if (!cred) continue;
      if (cred.type === "oauth") {
        oauthCandidate ??= {
          apiKey: options?.oauthMarker,
          discoveryApiKey: toDiscoveryApiKey(cred.access),
          mode: "oauth",
          source: "profile",
          profileId: id
        };
        continue;
      }
      const resolved = resolveApiKeyFromCredential(cred, env);
      if (!resolved) continue;
      return {
        apiKey: resolved.apiKey,
        discoveryApiKey: resolved.discoveryApiKey,
        mode: cred.type,
        source: "profile",
        profileId: id
      };
    }
    if (oauthCandidate) return oauthCandidate;
    const envVar = resolveEnvApiKeyVarName(authProvider, env);
    if (envVar) return {
      apiKey: envVar,
      discoveryApiKey: toDiscoveryApiKey(env[envVar]),
      mode: "api_key",
      source: "env"
    };
    const fromConfig = resolveConfigBackedProviderAuth({
      provider: authProvider,
      config,
      env
    });
    if (fromConfig) return {
      apiKey: fromConfig.apiKey,
      discoveryApiKey: fromConfig.discoveryApiKey,
      mode: fromConfig.mode,
      source: "none"
    };
    return {
      apiKey: void 0,
      discoveryApiKey: void 0,
      mode: "none",
      source: "none"
    };
  };
}
function resolveConfigBackedProviderAuth(params) {
  const authProvider = (0, _providerAuthAliases3NFJcokO.r)(params.provider, { config: params.config });
  const apiKey = (0, _providerRuntimeDXB7r8u.N)({
    provider: authProvider,
    config: params.config,
    context: {
      config: params.config,
      provider: authProvider,
      providerConfig: params.config?.models?.providers?.[authProvider]
    }
  })?.apiKey?.trim();
  if (apiKey) return (0, _modelAuthMarkersUDEQVW7W.u)(apiKey) ? {
    apiKey,
    discoveryApiKey: toDiscoveryApiKey(apiKey),
    mode: "api_key",
    source: "config"
  } : {
    apiKey: (0, _modelAuthMarkersUDEQVW7W.h)("file"),
    discoveryApiKey: toDiscoveryApiKey(apiKey),
    mode: "api_key",
    source: "config"
  };
  const configuredProvider = params.config?.models?.providers?.[authProvider];
  const configuredApiKeyRef = (0, _typesSecretsBxqheYvy.m)({
    value: configuredProvider?.apiKey,
    defaults: params.config?.secrets?.defaults
  }).ref;
  if (configuredApiKeyRef?.id.trim()) {
    if (configuredApiKeyRef.source === "env") {
      const envVar = configuredApiKeyRef.id.trim();
      if (!canResolveEnvSecretRefInConfigAuth({
        config: params.config,
        provider: configuredApiKeyRef.provider,
        id: envVar
      })) return;
      const envValue = params.env?.[envVar]?.trim();
      return envValue ? {
        apiKey: envVar,
        discoveryApiKey: toDiscoveryApiKey(envValue),
        mode: "api_key",
        source: "config"
      } : void 0;
    }
    return {
      apiKey: (0, _modelAuthMarkersUDEQVW7W.h)(configuredApiKeyRef.source),
      mode: "api_key",
      source: "config"
    };
  }
  if (typeof configuredProvider?.apiKey !== "string") return;
  const configuredApiKey = normalizeApiKeyConfig(configuredProvider.apiKey);
  if (!configuredApiKey) return;
  if (ENV_VAR_NAME_RE.test(configuredApiKey)) {
    const envValue = params.env?.[configuredApiKey]?.trim();
    return envValue ? {
      apiKey: configuredApiKey,
      discoveryApiKey: toDiscoveryApiKey(envValue),
      mode: "api_key",
      source: "config"
    } : void 0;
  }
  return (0, _modelAuthMarkersUDEQVW7W.u)(configuredApiKey) ? {
    apiKey: configuredApiKey,
    discoveryApiKey: toDiscoveryApiKey(configuredApiKey),
    mode: "api_key",
    source: "config"
  } : {
    apiKey: configuredApiKey,
    discoveryApiKey: toDiscoveryApiKey(configuredApiKey),
    mode: "api_key",
    source: "config"
  };
}
//#endregion /* v9-f330785ad467d94d */
