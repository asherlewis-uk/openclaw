"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = loadUndiciRuntimeDeps;exports.i = loadUndiciGlobalDispatcherDeps;exports.n = createHttp1EnvHttpProxyAgent;exports.o = createUndiciAutoSelectFamilyConnectOptions;exports.r = createHttp1ProxyAgent;exports.s = resolveUndiciAutoSelectFamily;exports.t = createHttp1Agent;var _wslCPSzfLq = require("./wsl-CPSzfLq9.js");
var _nodeModule = require("node:module");
var net$1 = _interopRequireWildcard(require("node:net"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}
//#region src/infra/net/undici-family-policy.ts
const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
function resolveUndiciAutoSelectFamily() {
  if (typeof net$1.getDefaultAutoSelectFamily !== "function") return;
  try {
    const systemDefault = net$1.getDefaultAutoSelectFamily();
    if (systemDefault && (0, _wslCPSzfLq.n)()) return false;
    return systemDefault;
  } catch {
    return;
  }
}
function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily) {
  if (autoSelectFamily === void 0) return;
  return {
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
  };
}
function resolveUndiciAutoSelectFamilyConnectOptions() {
  return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}
//#endregion
//#region src/infra/net/undici-runtime.ts
const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
const HTTP1_ONLY_DISPATCHER_OPTIONS = Object.freeze({ allowH2: false });
function isObjectRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function applyMissingConnectOptions(connect, defaults) {
  for (const [key, value] of Object.entries(defaults)) if (!(key in connect)) connect[key] = value;
}
function isUndiciRuntimeDeps(value) {
  return typeof value === "object" && value !== null && typeof value.Agent === "function" && typeof value.EnvHttpProxyAgent === "function" && typeof value.ProxyAgent === "function" && typeof value.fetch === "function";
}
function isUndiciGlobalDispatcherDeps(value) {
  return typeof value === "object" && value !== null && typeof value.Agent === "function" && typeof value.EnvHttpProxyAgent === "function" && typeof value.getGlobalDispatcher === "function" && typeof value.setGlobalDispatcher === "function";
}
function loadUndiciRuntimeDeps() {
  const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
  if (isUndiciRuntimeDeps(override)) return override;
  const undici = (0, _nodeModule.createRequire)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/undici-runtime-DzZbpePE.js")("undici");
  return {
    Agent: undici.Agent,
    EnvHttpProxyAgent: undici.EnvHttpProxyAgent,
    FormData: undici.FormData,
    ProxyAgent: undici.ProxyAgent,
    fetch: undici.fetch
  };
}
function loadUndiciGlobalDispatcherDeps() {
  const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
  if (isUndiciGlobalDispatcherDeps(override)) return override;
  const undici = (0, _nodeModule.createRequire)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/undici-runtime-DzZbpePE.js")("undici");
  return {
    Agent: undici.Agent,
    EnvHttpProxyAgent: undici.EnvHttpProxyAgent,
    getGlobalDispatcher: undici.getGlobalDispatcher,
    setGlobalDispatcher: undici.setGlobalDispatcher
  };
}
function withHttp1OnlyDispatcherOptions(options, timeoutMs, applyTo) {
  const base = {};
  if (options) Object.assign(base, options);
  Object.assign(base, HTTP1_ONLY_DISPATCHER_OPTIONS);
  const baseRecord = base;
  const targets = applyTo ?? { connect: true };
  const autoSelectConnect = resolveUndiciAutoSelectFamilyConnectOptions();
  if (autoSelectConnect && targets.connect && typeof baseRecord.connect !== "function") {
    const connect = isObjectRecord(baseRecord.connect) ? baseRecord.connect : {};
    applyMissingConnectOptions(connect, autoSelectConnect);
    baseRecord.connect = connect;
  }
  if (autoSelectConnect && targets.proxyTls) {
    const proxyTls = isObjectRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {};
    applyMissingConnectOptions(proxyTls, autoSelectConnect);
    baseRecord.proxyTls = proxyTls;
  }
  if (timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    const normalizedTimeoutMs = Math.floor(timeoutMs);
    baseRecord.bodyTimeout = normalizedTimeoutMs;
    baseRecord.headersTimeout = normalizedTimeoutMs;
    if (targets.connect && typeof baseRecord.connect !== "function") baseRecord.connect = {
      ...(isObjectRecord(baseRecord.connect) ? baseRecord.connect : {}),
      timeout: normalizedTimeoutMs
    };
    if (targets.proxyTls) baseRecord.proxyTls = {
      ...(isObjectRecord(baseRecord.proxyTls) ? baseRecord.proxyTls : {}),
      timeout: normalizedTimeoutMs
    };
  }
  return base;
}
function createHttp1Agent(options, timeoutMs) {
  const { Agent } = loadUndiciRuntimeDeps();
  return new Agent(withHttp1OnlyDispatcherOptions(options, timeoutMs));
}
function createHttp1EnvHttpProxyAgent(options, timeoutMs) {
  const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
  return new EnvHttpProxyAgent(withHttp1OnlyDispatcherOptions(options, timeoutMs, {
    connect: true,
    proxyTls: true
  }));
}
function createHttp1ProxyAgent(options, timeoutMs) {
  const { ProxyAgent } = loadUndiciRuntimeDeps();
  return new ProxyAgent(withHttp1OnlyDispatcherOptions(typeof options === "string" || options instanceof URL ? { uri: options.toString() } : { ...options }, timeoutMs, { proxyTls: true }));
}
//#endregion /* v9-1234ab2f943eed12 */
