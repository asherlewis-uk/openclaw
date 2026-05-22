"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = tryLoadActivatedBundledPluginPublicSurfaceModuleSync;exports.i = resetFacadeRuntimeStateForTest;exports.n = loadActivatedBundledPluginPublicSurfaceModuleSync;exports.r = loadBundledPluginPublicSurfaceModuleSync;exports.t = createLazyFacadeValue;var _bundledDirLBl9nCAz = require("./bundled-dir-LBl9nCAz.js");
var _pluginModuleLoaderCacheMuKAXPrS = require("./plugin-module-loader-cache-MuKAXPrS.js");
var _sdkAliasNpL7bYup = require("./sdk-alias-npL7bYup.js");
var _facadeResolutionSharedG6qeiL = require("./facade-resolution-shared-G6qeiL63.js");
var _facadeLoaderBqRX3EBI = require("./facade-loader-BqRX3EBI.js");
var _nodeModule = require("node:module");
var _nodeUrl = require("node:url");
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/plugin-sdk/facade-runtime.ts
function createLazyFacadeValue(loadFacadeModule, key) {
  return (...args) => {
    const value = loadFacadeModule()[key];
    if (typeof value !== "function") return value;
    return value(...args);
  };
}
const OPENCLAW_PACKAGE_ROOT = (0, _sdkAliasNpL7bYup.l)({
  modulePath: (0, _nodeUrl.fileURLToPath)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js"),
  moduleUrl: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js"
}) ?? (0, _nodeUrl.fileURLToPath)(new URL("../..", "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js"));
const CURRENT_MODULE_PATH = (0, _nodeUrl.fileURLToPath)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js");
const OPENCLAW_SOURCE_EXTENSIONS_ROOT = _nodePath.default.resolve(OPENCLAW_PACKAGE_ROOT, "extensions");
function createFacadeResolutionKey(params) {
  const bundledPluginsDir = (0, _bundledDirLBl9nCAz.n)(params.env ?? process.env);
  return (0, _facadeResolutionSharedG6qeiL.t)({
    ...params,
    bundledPluginsDir,
    ...(params.env ? { env: params.env } : {})
  });
}
function resolveRegistryPluginModuleLocation(params) {
  return loadFacadeActivationCheckRuntime().resolveRegistryPluginModuleLocation({
    ...params,
    resolutionKey: createFacadeResolutionKey(params)
  });
}
function resolveFacadeModuleLocationUncached(params) {
  const env = params.env ?? process.env;
  if (!(0, _bundledDirLBl9nCAz.t)(env)) {
    const bundledPluginsDir = (0, _bundledDirLBl9nCAz.n)(env);
    const bundledLocation = (0, _facadeResolutionSharedG6qeiL.n)({
      ...params,
      currentModulePath: CURRENT_MODULE_PATH,
      packageRoot: OPENCLAW_PACKAGE_ROOT,
      bundledPluginsDir
    });
    if (bundledLocation) return bundledLocation;
  }
  return resolveRegistryPluginModuleLocation(params);
}
function resolveFacadeModuleLocation(params) {
  return resolveFacadeModuleLocationUncached(params);
}
const nodeRequire = (0, _nodeModule.createRequire)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js");
const FACADE_ACTIVATION_CHECK_RUNTIME_CANDIDATES = ["./facade-activation-check.runtime.js", "./facade-activation-check.runtime.ts"];
let facadeActivationCheckRuntimeModule;
const facadeActivationCheckRuntimeLoaders = /* @__PURE__ */new Map();
function getFacadeActivationCheckRuntimeSourceLoader(modulePath) {
  return (0, _pluginModuleLoaderCacheMuKAXPrS.r)({
    cache: facadeActivationCheckRuntimeLoaders,
    modulePath,
    importerUrl: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js",
    loaderFilename: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-runtime-BJdBwhen.js",
    aliasMap: {}
  });
}
function loadFacadeActivationCheckRuntimeFromCandidates(loadCandidate) {
  for (const candidate of FACADE_ACTIVATION_CHECK_RUNTIME_CANDIDATES) try {
    return loadCandidate(candidate);
  } catch {}
}
function loadFacadeActivationCheckRuntime() {
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  facadeActivationCheckRuntimeModule = loadFacadeActivationCheckRuntimeFromCandidates((candidate) => nodeRequire(candidate));
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  facadeActivationCheckRuntimeModule = loadFacadeActivationCheckRuntimeFromCandidates((candidate) => getFacadeActivationCheckRuntimeSourceLoader(candidate)(candidate));
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  throw new Error("Unable to load facade activation check runtime");
}
function loadFacadeModuleAtLocationSync(params) {
  return (0, _facadeLoaderBqRX3EBI.i)(params);
}
function buildFacadeActivationCheckParams(params, location = resolveFacadeModuleLocation(params)) {
  return {
    ...params,
    location,
    sourceExtensionsRoot: OPENCLAW_SOURCE_EXTENSIONS_ROOT,
    resolutionKey: createFacadeResolutionKey(params)
  };
}
function loadBundledPluginPublicSurfaceModuleSync(params) {
  const location = resolveFacadeModuleLocation(params);
  const trackedPluginId = () => loadFacadeActivationCheckRuntime().resolveTrackedFacadePluginId(buildFacadeActivationCheckParams(params, location));
  if (!location) return (0, _facadeLoaderBqRX3EBI.r)({
    ...params,
    trackedPluginId
  });
  return loadFacadeModuleAtLocationSync({
    location,
    trackedPluginId,
    runtimeDeps: {
      pluginId: params.dirName,
      ...(params.env ? { env: params.env } : {})
    }
  });
}
function loadActivatedBundledPluginPublicSurfaceModuleSync(params) {
  loadFacadeActivationCheckRuntime().resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(buildFacadeActivationCheckParams(params));
  return loadBundledPluginPublicSurfaceModuleSync(params);
}
function tryLoadActivatedBundledPluginPublicSurfaceModuleSync(params) {
  if (!loadFacadeActivationCheckRuntime().resolveBundledPluginPublicSurfaceAccess(buildFacadeActivationCheckParams(params)).allowed) return null;
  return loadBundledPluginPublicSurfaceModuleSync(params);
}
function resetFacadeRuntimeStateForTest() {
  (0, _facadeLoaderBqRX3EBI.a)();
  facadeActivationCheckRuntimeModule = void 0;
  facadeActivationCheckRuntimeLoaders.clear();
}
//#endregion /* v9-f3458074a8965ee5 */
