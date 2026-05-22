"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = ensureGlobalUndiciStreamTimeouts;exports.i = ensureGlobalUndiciEnvProxyDispatcher;exports.n = void 0;exports.o = forceResetGlobalDispatcher;exports.r = ensureGlobalUndiciDispatcherStreamTimeouts;exports.s = resetGlobalUndiciStreamTimeoutsForTests;exports.t = void 0;var _proxyEnvBl2eQt0u = require("./proxy-env-Bl2eQt0u.js");
var _undiciRuntimeDzZbpePE = require("./undici-runtime-DzZbpePE.js");
//#region src/infra/net/undici-global-dispatcher.ts
const DEFAULT_UNDICI_STREAM_TIMEOUT_MS = exports.t = 1800 * 1e3;
/**
* Module-level bridge so `resolveDispatcherTimeoutMs` in fetch-guard.ts
* can read the global dispatcher timeout without relying on Undici's
* non-public `.options` field.
*/
let _globalUndiciStreamTimeoutMs = exports.n = void 0;
let lastAppliedTimeoutKey = null;
let lastAppliedProxyBootstrap = false;
function resolveDispatcherKind(dispatcher) {
  const ctorName = dispatcher?.constructor?.name;
  if (typeof ctorName !== "string" || ctorName.length === 0) return "unsupported";
  if (ctorName.includes("EnvHttpProxyAgent")) return "env-proxy";
  if (ctorName.includes("ProxyAgent")) return "unsupported";
  if (ctorName.includes("Agent")) return "agent";
  return "unsupported";
}
function resolveDispatcherKey(params) {
  const autoSelectToken = params.autoSelectFamily === void 0 ? "na" : params.autoSelectFamily ? "on" : "off";
  return `${params.kind}:${params.timeoutMs}:${autoSelectToken}`;
}
function resolveStreamTimeoutMs(opts) {
  const timeoutMsRaw = opts?.timeoutMs ?? 18e5;
  if (!Number.isFinite(timeoutMsRaw)) return null;
  return Math.max(DEFAULT_UNDICI_STREAM_TIMEOUT_MS, Math.floor(timeoutMsRaw));
}
function resolveCurrentDispatcherKind(runtime) {
  let dispatcher;
  try {
    dispatcher = runtime.getGlobalDispatcher();
  } catch {
    return null;
  }
  const currentKind = resolveDispatcherKind(dispatcher);
  return currentKind === "unsupported" ? null : currentKind;
}
function ensureGlobalUndiciEnvProxyDispatcher() {
  if (!(0, _proxyEnvBl2eQt0u.n)()) return;
  const runtime = (0, _undiciRuntimeDzZbpePE.i)();
  const { EnvHttpProxyAgent, setGlobalDispatcher } = runtime;
  if (lastAppliedProxyBootstrap) {
    if (resolveCurrentDispatcherKind(runtime) === "env-proxy") return;
    lastAppliedProxyBootstrap = false;
  }
  const currentKind = resolveCurrentDispatcherKind(runtime);
  if (currentKind === null) return;
  if (currentKind === "env-proxy") {
    lastAppliedProxyBootstrap = true;
    return;
  }
  try {
    setGlobalDispatcher(new EnvHttpProxyAgent((0, _proxyEnvBl2eQt0u.o)()));
    lastAppliedProxyBootstrap = true;
  } catch {}
}
function applyGlobalDispatcherStreamTimeouts(params) {
  const { runtime, kind, timeoutMs } = params;
  const autoSelectFamily = (0, _undiciRuntimeDzZbpePE.s)();
  const nextKey = resolveDispatcherKey({
    kind,
    timeoutMs,
    autoSelectFamily
  });
  if (lastAppliedTimeoutKey === nextKey) return;
  const connect = (0, _undiciRuntimeDzZbpePE.o)(autoSelectFamily);
  try {
    if (kind === "env-proxy") {
      const proxyOptions = {
        ...(0, _proxyEnvBl2eQt0u.o)(),
        bodyTimeout: timeoutMs,
        headersTimeout: timeoutMs,
        ...(connect ? { connect } : {})
      };
      runtime.setGlobalDispatcher(new runtime.EnvHttpProxyAgent(proxyOptions));
    } else runtime.setGlobalDispatcher(new runtime.Agent({
      bodyTimeout: timeoutMs,
      headersTimeout: timeoutMs,
      ...(connect ? { connect } : {})
    }));
    lastAppliedTimeoutKey = nextKey;
  } catch {}
}
function ensureGlobalUndiciStreamTimeouts(opts) {
  const timeoutMs = resolveStreamTimeoutMs(opts);
  if (timeoutMs === null) return;
  exports.n = _globalUndiciStreamTimeoutMs = timeoutMs;
  if (!(0, _proxyEnvBl2eQt0u.n)()) {
    lastAppliedTimeoutKey = null;
    return;
  }
  const runtime = (0, _undiciRuntimeDzZbpePE.i)();
  const kind = resolveCurrentDispatcherKind(runtime);
  if (kind === null) return;
  if (kind !== "env-proxy") return;
  applyGlobalDispatcherStreamTimeouts({
    runtime,
    kind,
    timeoutMs
  });
}
function ensureGlobalUndiciDispatcherStreamTimeouts(opts) {
  const timeoutMs = resolveStreamTimeoutMs(opts);
  if (timeoutMs === null) return;
  exports.n = _globalUndiciStreamTimeoutMs = timeoutMs;
  const runtime = (0, _undiciRuntimeDzZbpePE.i)();
  const kind = resolveCurrentDispatcherKind(runtime);
  if (kind === null) return;
  applyGlobalDispatcherStreamTimeouts({
    runtime,
    kind,
    timeoutMs
  });
}
function resetGlobalUndiciStreamTimeoutsForTests() {
  lastAppliedTimeoutKey = null;
  lastAppliedProxyBootstrap = false;
  exports.n = _globalUndiciStreamTimeoutMs = void 0;
}
/**
* Re-evaluate proxy env changes for undici. Installs EnvHttpProxyAgent when
* proxy env is present, and restores a direct Agent after proxy env is cleared.
*/
function forceResetGlobalDispatcher() {
  lastAppliedTimeoutKey = null;
  if (!(0, _proxyEnvBl2eQt0u.n)()) {
    if (!lastAppliedProxyBootstrap) return;
    lastAppliedProxyBootstrap = false;
    try {
      const { Agent, setGlobalDispatcher } = (0, _undiciRuntimeDzZbpePE.i)();
      setGlobalDispatcher(new Agent());
    } catch {}
    return;
  }
  lastAppliedProxyBootstrap = false;
  try {
    const { EnvHttpProxyAgent, setGlobalDispatcher } = (0, _undiciRuntimeDzZbpePE.i)();
    setGlobalDispatcher(new EnvHttpProxyAgent((0, _proxyEnvBl2eQt0u.o)()));
    lastAppliedProxyBootstrap = true;
  } catch {}
}
//#endregion /* v9-658c65227ee6a6ac */
