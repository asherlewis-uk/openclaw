"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = listChannelCatalogEntries;var _discoveryBEbYTYvv = require("./discovery-BEbYTYvv.js");
var _installedPluginIndexRecordReaderBieSpyRG = require("./installed-plugin-index-record-reader-BieSpyRG.js");
var _manifestKLnLMS7v = require("./manifest-kLnLMS7v.js");
//#region src/plugins/channel-catalog-registry.ts
function listChannelCatalogEntries(params = {}) {
  const installRecords = resolveInstallRecords(params);
  return (0, _discoveryBEbYTYvv.t)({
    workspaceDir: params.workspaceDir,
    env: params.env,
    ...(installRecords && Object.keys(installRecords).length > 0 ? { installRecords } : {})
  }).candidates.flatMap((candidate) => {
    if (params.origin && candidate.origin !== params.origin) return [];
    const channel = candidate.packageManifest?.channel;
    if (!channel?.id) return [];
    const manifest = (0, _manifestKLnLMS7v.i)(candidate.rootDir, (0, _discoveryBEbYTYvv.u)({
      origin: candidate.origin,
      rootDir: candidate.rootDir,
      env: params.env
    }));
    if (!manifest.ok) return [];
    return [{
      pluginId: manifest.manifest.id,
      origin: candidate.origin,
      packageName: candidate.packageName,
      workspaceDir: candidate.workspaceDir,
      rootDir: candidate.rootDir,
      channel,
      ...(candidate.packageManifest?.install ? { install: candidate.packageManifest.install } : {})
    }];
  });
}
function resolveInstallRecords(params) {
  if (params.installRecords) return params.installRecords;
  if (params.origin === "bundled") return;
  try {
    return (0, _installedPluginIndexRecordReaderBieSpyRG.n)(params.env ? { env: params.env } : {});
  } catch {
    return;
  }
}
//#endregion /* v9-d6f646dffa11f0da */
