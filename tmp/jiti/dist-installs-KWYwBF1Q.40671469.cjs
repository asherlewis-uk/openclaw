"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = recordPluginInstall;exports.t = buildNpmResolutionInstallFields;var _installSourceUtilsZE6Bmcp = require("./install-source-utils-ZE-6Bmcp.js");
//#region src/plugins/installs.ts
function buildNpmResolutionInstallFields(resolution) {
  return (0, _installSourceUtilsZE6Bmcp.t)(resolution);
}
function recordPluginInstall(cfg, update) {
  const { pluginId, ...record } = update;
  const installs = {
    ...cfg.plugins?.installs,
    [pluginId]: {
      ...cfg.plugins?.installs?.[pluginId],
      ...record,
      installedAt: record.installedAt ?? (/* @__PURE__ */new Date()).toISOString()
    }
  };
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      installs: {
        ...installs,
        [pluginId]: installs[pluginId]
      }
    }
  };
}
//#endregion /* v9-bd8475fc00352cb7 */
