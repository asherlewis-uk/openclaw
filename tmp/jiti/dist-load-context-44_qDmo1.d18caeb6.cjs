"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.i = resolvePluginRuntimeLoadContext;exports.n = buildPluginRuntimeLoadOptionsFromValues;exports.r = createPluginRuntimeLoaderLogger;exports.t = buildPluginRuntimeLoadOptions;var _agentScopeConfig26EcJVc = require("./agent-scope-config-26EcJVc0.js");
require("./agent-scope-C1Fl7gAf.js");
var _subsystemDLRoKDlF = require("./subsystem-DLRoKDlF.js");
var _io5xE1dPMK = require("./io-5xE1dPMK.js");
require("./config-CzeRK-GW.js");
var _pluginAutoEnableDLIxCAM = require("./plugin-auto-enable-DLIxCAM0.js");
var _loaderDkTFEskE = require("./loader-DkTFEskE.js");
require("./logging-wxB8Ssux.js");
//#region src/plugins/runtime/load-context.ts
const log = (0, _subsystemDLRoKDlF.t)("plugins");
function createPluginRuntimeLoaderLogger() {
  return {
    info: (message) => log.info(message),
    warn: (message) => log.warn(message),
    error: (message) => log.error(message),
    debug: (message) => log.debug(message)
  };
}
function resolvePluginRuntimeLoadContext(options) {
  const env = options?.env ?? process.env;
  const rawConfig = options?.config ?? (0, _io5xE1dPMK.i)();
  const activationSourceConfig = (0, _loaderDkTFEskE.w)({
    config: rawConfig,
    activationSourceConfig: options?.activationSourceConfig
  });
  const autoEnabled = (0, _pluginAutoEnableDLIxCAM.t)({
    config: rawConfig,
    env,
    manifestRegistry: options?.manifestRegistry
  });
  const config = autoEnabled.config;
  const workspaceDir = options?.workspaceDir ?? (0, _agentScopeConfig26EcJVc.o)(config, (0, _agentScopeConfig26EcJVc.c)(config));
  return {
    rawConfig,
    config,
    activationSourceConfig,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir,
    env,
    logger: options?.logger ?? createPluginRuntimeLoaderLogger()
  };
}
function buildPluginRuntimeLoadOptions(context, overrides) {
  return buildPluginRuntimeLoadOptionsFromValues(context, overrides);
}
function buildPluginRuntimeLoadOptionsFromValues(values, overrides) {
  return {
    config: values.config,
    activationSourceConfig: values.activationSourceConfig,
    autoEnabledReasons: values.autoEnabledReasons,
    workspaceDir: values.workspaceDir,
    env: values.env,
    logger: values.logger,
    ...overrides
  };
}
//#endregion /* v9-e97e6cb4c5d1c2eb */
