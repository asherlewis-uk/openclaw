"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveBundledFacadeModuleLocation;exports.r = resolveRegistryPluginModuleLocationFromRecords;exports.t = createFacadeResolutionKey;var _bundledDirLBl9nCAz = require("./bundled-dir-LBl9nCAz.js");
var _publicSurfaceRuntimeB8V5ml4K = require("./public-surface-runtime-B8V5ml4K.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/plugin-sdk/facade-resolution-shared.ts
function createFacadeResolutionKey(params) {
  const disabledKey = (0, _bundledDirLBl9nCAz.t)(params.env ?? process.env) ? "disabled" : "enabled";
  return `${params.dirName}::${params.artifactBasename}::${params.bundledPluginsDir ? _nodePath.default.resolve(params.bundledPluginsDir) : "<default>"}::${disabledKey}`;
}
function resolveFacadeBoundaryRoot(params) {
  if (!params.bundledPluginsDir) return params.packageRoot;
  const resolvedBundledPluginsDir = _nodePath.default.resolve(params.bundledPluginsDir);
  return params.modulePath.startsWith(`${resolvedBundledPluginsDir}${_nodePath.default.sep}`) ? resolvedBundledPluginsDir : params.packageRoot;
}
function resolveBundledFacadeModuleLocation(params) {
  const env = params.env ?? process.env;
  if ((0, _bundledDirLBl9nCAz.t)(env)) return null;
  const preferSource = !params.currentModulePath.includes(`${_nodePath.default.sep}dist${_nodePath.default.sep}`);
  const packageSourceRoot = _nodePath.default.resolve(params.packageRoot, "extensions");
  const publicSurfaceParams = {
    rootDir: params.packageRoot,
    env: params.env,
    ...(params.bundledPluginsDir ? { bundledPluginsDir: params.bundledPluginsDir } : {}),
    dirName: params.dirName,
    artifactBasename: params.artifactBasename
  };
  const modulePath = preferSource ? (0, _publicSurfaceRuntimeB8V5ml4K.a)({
    dirName: params.dirName,
    artifactBasename: params.artifactBasename,
    sourceRoot: params.bundledPluginsDir ?? packageSourceRoot
  }) ?? (params.bundledPluginsDir && !(0, _bundledDirLBl9nCAz.t)(env) ? (0, _publicSurfaceRuntimeB8V5ml4K.a)({
    dirName: params.dirName,
    artifactBasename: params.artifactBasename,
    sourceRoot: packageSourceRoot
  }) : null) ?? (0, _publicSurfaceRuntimeB8V5ml4K.i)(publicSurfaceParams) : (0, _publicSurfaceRuntimeB8V5ml4K.i)(publicSurfaceParams);
  return modulePath ? {
    modulePath,
    boundaryRoot: resolveFacadeBoundaryRoot({
      modulePath,
      bundledPluginsDir: params.bundledPluginsDir,
      packageRoot: params.packageRoot
    })
  } : null;
}
function resolveRegistryPluginModuleLocationFromRecords(params) {
  const tiers = [
  (plugin) => plugin.id === params.dirName,
  (plugin) => _nodePath.default.basename(plugin.rootDir) === params.dirName,
  (plugin) => plugin.channels.includes(params.dirName)];

  const artifactBasename = (0, _publicSurfaceRuntimeB8V5ml4K.n)(params.artifactBasename);
  const sourceBaseName = artifactBasename.replace(/\.js$/u, "");
  for (const matchFn of tiers) for (const record of params.registry.filter(matchFn)) {
    const rootDir = _nodePath.default.resolve(record.rootDir);
    const builtCandidate = _nodePath.default.join(rootDir, artifactBasename);
    if (_nodeFs.default.existsSync(builtCandidate)) return {
      modulePath: builtCandidate,
      boundaryRoot: rootDir
    };
    for (const ext of _publicSurfaceRuntimeB8V5ml4K.t) {
      const sourceCandidate = _nodePath.default.join(rootDir, `${sourceBaseName}${ext}`);
      if (_nodeFs.default.existsSync(sourceCandidate)) return {
        modulePath: sourceCandidate,
        boundaryRoot: rootDir
      };
    }
  }
  return null;
}
//#endregion /* v9-dd190b84b7d9b948 */
