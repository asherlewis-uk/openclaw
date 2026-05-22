"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = getLoadedChannelPluginForRead;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _runtimeChannelStateDJHEiBs = require("./runtime-channel-state-DJHEiBs1.js");
//#region src/channels/plugins/registry-loaded-read.ts
function coerceLoadedChannelPlugin(plugin) {
  const id = (0, _stringCoerceLndEvhRk.c)(plugin?.id) ?? "";
  if (!plugin || !id) return;
  if (!plugin.meta || typeof plugin.meta !== "object") plugin.meta = {};
  return plugin;
}
function getLoadedChannelPluginForRead(id) {
  const resolvedId = (0, _stringCoerceLndEvhRk.c)(id) ?? "";
  if (!resolvedId) return;
  const registry = (0, _runtimeChannelStateDJHEiBs.t)();
  if (!registry || !Array.isArray(registry.channels)) return;
  for (const entry of registry.channels) {
    const plugin = coerceLoadedChannelPlugin(entry?.plugin);
    if (plugin && plugin.id === resolvedId) return plugin;
  }
}
//#endregion /* v9-85c793b541c22566 */
