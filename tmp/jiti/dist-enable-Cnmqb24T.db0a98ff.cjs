"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = enablePluginInConfig;var _idsDFu3Ho6n = require("./ids-DFu3Ho6n.js");
var _toggleConfigB8vg6YvL = require("./toggle-config-B8vg6YvL.js");
//#region src/plugins/enable.ts
function enablePluginInConfig(cfg, pluginId, options = {}) {
  const resolvedId = (0, _idsDFu3Ho6n.r)(pluginId) ?? pluginId;
  if (cfg.plugins?.enabled === false) return {
    config: cfg,
    enabled: false,
    pluginId: resolvedId,
    reason: "plugins disabled"
  };
  if (cfg.plugins?.deny?.includes(pluginId) || cfg.plugins?.deny?.includes(resolvedId)) return {
    config: cfg,
    enabled: false,
    pluginId: resolvedId,
    reason: "blocked by denylist"
  };
  const allow = cfg.plugins?.allow;
  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(pluginId) && !allow.includes(resolvedId)) return {
    config: cfg,
    enabled: false,
    pluginId: resolvedId,
    reason: "blocked by allowlist"
  };
  return {
    config: (0, _toggleConfigB8vg6YvL.t)(cfg, resolvedId, true, options),
    enabled: true,
    pluginId: resolvedId
  };
}
//#endregion /* v9-392d4b679ab59005 */
