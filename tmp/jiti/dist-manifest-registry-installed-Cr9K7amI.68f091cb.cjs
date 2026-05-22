"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveInstalledManifestRegistryIndexFingerprint;exports.t = loadPluginManifestRegistryForInstalledIndex;var _discoveryBEbYTYvv = require("./discovery-BEbYTYvv.js");
var _installedPluginIndexStoreDetkjvO = require("./installed-plugin-index-store-DetkjvO9.js");
var _jsonFilesCahFuwKs = require("./json-files-CahFuwKs.js");
var _manifestKLnLMS7v = require("./manifest-kLnLMS7v.js");
var _manifestRegistryDgt5vVG = require("./manifest-registry-Dgt5v-vG.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/plugins/manifest-registry-installed.ts
function resolvePackageJsonPath(record) {
  if (!record.packageJson?.path) return;
  const rootDir = resolveInstalledPluginRootDir(record);
  const packageJsonPath = _nodePath.default.resolve(rootDir, record.packageJson.path);
  const relative = _nodePath.default.relative(rootDir, packageJsonPath);
  if (relative.startsWith("..") || _nodePath.default.isAbsolute(relative)) return;
  return packageJsonPath;
}
function safeFileSignature(filePath) {
  if (!filePath) return;
  try {
    const stat = _nodeFs.default.statSync(filePath);
    return `${filePath}:${stat.size}:${stat.mtimeMs}`;
  } catch {
    return `${filePath}:missing`;
  }
}
function buildInstalledManifestRegistryIndexKey(index) {
  return {
    version: index.version,
    hostContractVersion: index.hostContractVersion,
    compatRegistryVersion: index.compatRegistryVersion,
    migrationVersion: index.migrationVersion,
    policyHash: index.policyHash,
    installRecords: index.installRecords,
    diagnostics: index.diagnostics,
    plugins: index.plugins.map((record) => {
      const packageJsonPath = resolvePackageJsonPath(record);
      return {
        pluginId: record.pluginId,
        packageName: record.packageName,
        packageVersion: record.packageVersion,
        installRecord: record.installRecord,
        installRecordHash: record.installRecordHash,
        packageInstall: record.packageInstall,
        packageChannel: record.packageChannel,
        manifestPath: record.manifestPath,
        manifestHash: record.manifestHash,
        manifestFile: safeFileSignature(record.manifestPath),
        format: record.format,
        bundleFormat: record.bundleFormat,
        source: record.source,
        setupSource: record.setupSource,
        packageJson: record.packageJson,
        packageJsonFile: safeFileSignature(packageJsonPath),
        rootDir: record.rootDir,
        origin: record.origin,
        enabled: record.enabled,
        enabledByDefault: record.enabledByDefault,
        enabledByDefaultOnPlatforms: record.enabledByDefaultOnPlatforms ? [...record.enabledByDefaultOnPlatforms] : void 0,
        syntheticAuthRefs: record.syntheticAuthRefs,
        startup: record.startup,
        compat: record.compat
      };
    })
  };
}
function resolveInstalledManifestRegistryIndexFingerprint(index) {
  return (0, _installedPluginIndexStoreDetkjvO.y)(buildInstalledManifestRegistryIndexKey(index));
}
function resolveInstalledPluginRootDir(record) {
  return record.rootDir || _nodePath.default.dirname(record.manifestPath || process.cwd());
}
function resolveFallbackPluginSource(record) {
  const rootDir = resolveInstalledPluginRootDir(record);
  for (const entry of _manifestKLnLMS7v.t) {
    const candidate = _nodePath.default.join(rootDir, entry);
    if (_nodeFs.default.existsSync(candidate)) return candidate;
  }
  return _nodePath.default.join(rootDir, _manifestKLnLMS7v.t[0]);
}
function resolveInstalledPackageMetadata(record) {
  const fallbackPackageManifest = record.packageChannel ? { channel: record.packageChannel } : void 0;
  const rootDir = resolveInstalledPluginRootDir(record);
  const packageJsonPath = record.packageJson?.path ? _nodePath.default.resolve(rootDir, record.packageJson.path) : void 0;
  if (!packageJsonPath) return fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {};
  const relative = _nodePath.default.relative(rootDir, packageJsonPath);
  if (relative.startsWith("..") || _nodePath.default.isAbsolute(relative)) return fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {};
  const packageJson = (0, _jsonFilesCahFuwKs.u)(packageJsonPath);
  if (packageJson) {
    const packageManifest = (0, _manifestKLnLMS7v.r)(packageJson);
    const dependencies = (0, _discoveryBEbYTYvv.r)({
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies
    });
    if (!packageManifest) return {
      ...(fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {}),
      packageDependencies: dependencies.dependencies,
      packageOptionalDependencies: dependencies.optionalDependencies
    };
    const channel = record.packageChannel || packageManifest.channel ? {
      ...record.packageChannel,
      ...packageManifest.channel
    } : void 0;
    return {
      packageManifest: {
        ...packageManifest,
        ...(channel ? { channel } : {})
      },
      packageDependencies: dependencies.dependencies,
      packageOptionalDependencies: dependencies.optionalDependencies
    };
  }
  return fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {};
}
function toPluginCandidate(record) {
  const rootDir = resolveInstalledPluginRootDir(record);
  const packageMetadata = resolveInstalledPackageMetadata(record);
  return {
    idHint: record.pluginId,
    source: record.source ?? resolveFallbackPluginSource(record),
    ...(record.setupSource ? { setupSource: record.setupSource } : {}),
    rootDir,
    origin: record.origin,
    ...(record.format ? { format: record.format } : {}),
    ...(record.bundleFormat ? { bundleFormat: record.bundleFormat } : {}),
    ...(record.packageName ? { packageName: record.packageName } : {}),
    ...(record.packageVersion ? { packageVersion: record.packageVersion } : {}),
    ...(packageMetadata.packageManifest ? { packageManifest: packageMetadata.packageManifest } : {}),
    ...(packageMetadata.packageDependencies ? { packageDependencies: packageMetadata.packageDependencies } : {}),
    ...(packageMetadata.packageOptionalDependencies ? { packageOptionalDependencies: packageMetadata.packageOptionalDependencies } : {}),
    packageDir: rootDir
  };
}
function loadPluginManifestRegistryForInstalledIndex(params) {
  return (0, _discoveryBEbYTYvv.o)("manifest registry", () => {
    if (params.pluginIds && params.pluginIds.length === 0) return {
      plugins: [],
      diagnostics: []
    };
    const env = params.env ?? process.env;
    const pluginIdSet = params.pluginIds?.length ? new Set(params.pluginIds) : null;
    const diagnostics = pluginIdSet ? params.index.diagnostics.filter((diagnostic) => {
      const pluginId = diagnostic.pluginId;
      return !pluginId || pluginIdSet.has(pluginId);
    }) : params.index.diagnostics;
    const candidates = params.index.plugins.filter((plugin) => params.includeDisabled || plugin.enabled).filter((plugin) => !pluginIdSet || pluginIdSet.has(plugin.pluginId)).map(toPluginCandidate);
    return (0, _manifestRegistryDgt5vVG.t)({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env,
      candidates,
      diagnostics: [...diagnostics],
      installRecords: (0, _installedPluginIndexStoreDetkjvO.h)(params.index),
      ...(params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {})
    });
  }, {
    includeDisabled: params.includeDisabled === true,
    pluginIdCount: params.pluginIds?.length,
    indexPluginCount: params.index.plugins.length
  });
}
//#endregion /* v9-d8da248126b5e5ec */
