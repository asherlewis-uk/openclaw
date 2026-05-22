"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.i = listBundledChannelIdsWithConfiguredState;exports.n = isStaticallyChannelConfigured;exports.r = hasBundledChannelConfiguredState;exports.t = isChannelConfigured;var _utilsCKsuXgDI = require("./utils-CKsuXgDI.js");
var _channelEnvVarsCdW2Wcru = require("./channel-env-vars-CdW2Wcru.js");
var _packageStateProbesDT5qTYY = require("./package-state-probes-DT5qTY-y.js");
var _bootstrapRegistryBkdH0XC = require("./bootstrap-registry-BkdH0XC0.js");
//#region src/channels/plugins/configured-state.ts
function listBundledChannelIdsWithConfiguredState() {
  return (0, _packageStateProbesDT5qTYY.n)("configuredState");
}
function hasBundledChannelConfiguredState(params) {
  return (0, _packageStateProbesDT5qTYY.t)({
    metadataKey: "configuredState",
    channelId: params.channelId,
    cfg: params.cfg,
    env: params.env
  });
}
//#endregion
//#region src/config/channel-configured-shared.ts
function resolveChannelConfigRecord(cfg, channelId) {
  const entry = cfg.channels?.[channelId];
  return (0, _utilsCKsuXgDI.c)(entry) ? entry : null;
}
function hasMeaningfulChannelConfigShallow(value) {
  if (!(0, _utilsCKsuXgDI.c)(value)) return false;
  return Object.keys(value).some((key) => key !== "enabled");
}
function isStaticallyChannelConfigured(cfg, channelId, env = process.env) {
  for (const envVar of (0, _channelEnvVarsCdW2Wcru.t)(channelId, {
    config: cfg,
    env
  })) if (typeof env[envVar] === "string" && env[envVar].trim().length > 0) return true;
  return hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId));
}
//#endregion
//#region src/config/channel-configured.ts
function isChannelConfigured(cfg, channelId, env = process.env) {
  if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) return true;
  if (hasBundledChannelConfiguredState({
    channelId,
    cfg,
    env
  })) return true;
  const plugin = (0, _bootstrapRegistryBkdH0XC.t)(channelId);
  return Boolean(plugin?.config?.hasConfiguredState?.({
    cfg,
    env
  }));
}
//#endregion /* v9-d9e72a0f0f9b2877 */
