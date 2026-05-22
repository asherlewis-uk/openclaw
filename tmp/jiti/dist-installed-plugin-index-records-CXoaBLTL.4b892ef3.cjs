"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = withPluginInstallRecords;exports.c = writePersistedInstalledPluginIndexInstallRecordsSync;exports.i = resolveInstalledPluginIndexRecordsStorePath;exports.n = recordPluginInstallInRecords;exports.o = withoutPluginInstallRecords;exports.r = removePluginInstallRecordFromRecords;exports.s = writePersistedInstalledPluginIndexInstallRecords;exports.t = void 0;var _installedPluginIndexStoreDetkjvO = require("./installed-plugin-index-store-DetkjvO9.js");
var _installedPluginIndexRecordReaderBieSpyRG = require("./installed-plugin-index-record-reader-BieSpyRG.js");
var _installsKWYwBF1Q = require("./installs-KWYwBF1Q.js");
//#region src/plugins/installed-plugin-index-records.ts
const PLUGIN_INSTALLS_CONFIG_PATH = exports.t = ["plugins", "installs"];
function resolveInstalledPluginIndexRecordsStorePath(options = {}) {
  return (0, _installedPluginIndexRecordReaderBieSpyRG.a)(options);
}
async function writePersistedInstalledPluginIndexInstallRecords(records, options = {}) {
  await (0, _installedPluginIndexStoreDetkjvO.i)({
    ...options,
    reason: "source-changed",
    installRecords: records
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}
function writePersistedInstalledPluginIndexInstallRecordsSync(records, options = {}) {
  (0, _installedPluginIndexStoreDetkjvO.a)({
    ...options,
    reason: "source-changed",
    installRecords: records
  });
  return resolveInstalledPluginIndexRecordsStorePath(options);
}
function withPluginInstallRecords(config, records) {
  return {
    ...config,
    plugins: {
      ...config.plugins,
      installs: records
    }
  };
}
function withoutPluginInstallRecords(config) {
  if (!config.plugins?.installs) return config;
  const { installs: _installs, ...plugins } = config.plugins;
  if (Object.keys(plugins).length === 0) {
    const { plugins: _plugins, ...rest } = config;
    return rest;
  }
  return {
    ...config,
    plugins
  };
}
function recordPluginInstallInRecords(records, update) {
  return (0, _installsKWYwBF1Q.n)({ plugins: { installs: records } }, update).plugins?.installs ?? {};
}
function removePluginInstallRecordFromRecords(records, pluginId) {
  const { [pluginId]: _removed, ...rest } = records;
  return rest;
}
//#endregion /* v9-2faddd1af070f100 */
