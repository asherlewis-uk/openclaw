"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = getCurrentPluginMetadataSnapshot;exports.r = setCurrentPluginMetadataSnapshot;exports.t = clearCurrentPluginMetadataSnapshot;var _pluginMetadataSnapshotDlaHO4z = require("./plugin-metadata-snapshot-DlaHO4z7.js");
var _installedPluginIndexStoreDetkjvO = require("./installed-plugin-index-store-DetkjvO9.js");
//#region src/plugins/current-plugin-metadata-snapshot.ts
function resolvePluginMetadataControlPlaneFingerprint(config, options = {}) {
  return (0, _pluginMetadataSnapshotDlaHO4z.a)({
    config,
    ...options
  });
}
function setCurrentPluginMetadataSnapshot(snapshot, options = {}) {
  const compatiblePolicyHashes = snapshot ? options.compatibleConfigs?.map((config) => (0, _installedPluginIndexStoreDetkjvO._)(config)) : void 0;
  const compatibleConfigFingerprints = snapshot ? options.compatibleConfigs?.map((config, index) => resolvePluginMetadataControlPlaneFingerprint(config, {
    env: options.env,
    index: snapshot.index,
    policyHash: compatiblePolicyHashes?.[index],
    workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
  })) : void 0;
  (0, _installedPluginIndexStoreDetkjvO.l)(snapshot, snapshot ? resolvePluginMetadataControlPlaneFingerprint(options.config, {
    env: options.env,
    index: snapshot.index,
    policyHash: snapshot.policyHash,
    workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
  }) : void 0, compatiblePolicyHashes, compatibleConfigFingerprints);
}
function clearCurrentPluginMetadataSnapshot() {
  (0, _installedPluginIndexStoreDetkjvO.s)();
}
function getCurrentPluginMetadataSnapshot(params = {}) {
  const { snapshot: rawSnapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints } = (0, _installedPluginIndexStoreDetkjvO.c)();
  const snapshot = rawSnapshot;
  if (!snapshot) return;
  const requestedPolicyHash = params.config ? (0, _installedPluginIndexStoreDetkjvO._)(params.config) : void 0;
  if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
    if (!new Set(compatiblePolicyHashes ?? []).has(requestedPolicyHash)) return;
  }
  const requestedWorkspaceDir = params.workspaceDir ?? (params.allowWorkspaceScopedSnapshot === true ? snapshot.workspaceDir : void 0);
  if (params.config) {
    const requestedConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(params.config, {
      env: params.env,
      index: snapshot.index,
      policyHash: requestedPolicyHash,
      workspaceDir: requestedWorkspaceDir
    });
    const compatibleFingerprints = new Set(compatibleConfigFingerprints ?? []);
    if (!(configFingerprint === requestedConfigFingerprint || snapshot.configFingerprint === requestedConfigFingerprint || compatibleFingerprints.has(requestedConfigFingerprint))) return;
  }
  if (params.requireDefaultDiscoveryContext === true) {
    const defaultDiscoveryConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint({}, {
      env: params.env,
      index: snapshot.index,
      policyHash: snapshot.policyHash,
      workspaceDir: requestedWorkspaceDir
    });
    const compatibleFingerprints = new Set(compatibleConfigFingerprints ?? []);
    if (!(configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || compatibleFingerprints.has(defaultDiscoveryConfigFingerprint))) return;
  }
  if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
  if (requestedWorkspaceDir !== void 0 && (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")) return;
  return snapshot;
}
//#endregion /* v9-863738cdff0ef9e3 */
