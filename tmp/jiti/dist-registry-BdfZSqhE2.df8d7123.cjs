"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = normalizeChannelId;exports.i = listChannelPlugins;exports.n = getLoadedChannelPlugin;exports.r = getLoadedChannelPluginOrigin;exports.t = getChannelPlugin;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _registryEre6Hdl = require("./registry-ere6Hdl3.js");
var _bundledQ4WXUmmu = require("./bundled-Q4WXUmmu.js");
var _registryLoadedCF1z2CuQ = require("./registry-loaded-CF1z2CuQ.js");
//#region src/channels/plugins/registry.ts
function listChannelPlugins() {
  return (0, _registryLoadedCF1z2CuQ.r)();
}
function getLoadedChannelPlugin(id) {
  const resolvedId = (0, _stringCoerceLndEvhRk.c)(id) ?? "";
  if (!resolvedId) return;
  return (0, _registryLoadedCF1z2CuQ.t)(resolvedId);
}
function getLoadedChannelPluginOrigin(id) {
  const resolvedId = (0, _stringCoerceLndEvhRk.c)(id) ?? "";
  if (!resolvedId) return;
  return (0, _stringCoerceLndEvhRk.c)((0, _registryLoadedCF1z2CuQ.n)(resolvedId)?.origin) ?? void 0;
}
function getChannelPlugin(id) {
  const resolvedId = (0, _stringCoerceLndEvhRk.c)(id) ?? "";
  if (!resolvedId) return;
  return getLoadedChannelPlugin(resolvedId) ?? (0, _bundledQ4WXUmmu.n)(resolvedId);
}
function normalizeChannelId(raw) {
  return (0, _registryEre6Hdl.a)(raw);
}
//#endregion /* v9-a4cf756cb6d533aa */
