"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = resetFacadeLoaderStateForTest;exports.i = loadFacadeModuleAtLocationSync;exports.n = listImportedBundledPluginFacadeIds;exports.r = loadBundledPluginPublicSurfaceModuleSync;exports.t = createLazyFacadeObjectValue;var _rootFileCqMcFM3J = require("./root-file-CqMcFM3J.js");
require("./boundary-file-read-wgc2vgUM.js");
var _bundledDirLBl9nCAz = require("./bundled-dir-LBl9nCAz.js");
var _pluginModuleLoaderCacheMuKAXPrS = require("./plugin-module-loader-cache-MuKAXPrS.js");
var _sdkAliasNpL7bYup = require("./sdk-alias-npL7bYup.js");
var _facadeResolutionSharedG6qeiL = require("./facade-resolution-shared-G6qeiL63.js");
var _nodeModule = require("node:module");
var _nodeUrl = require("node:url");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/plugin-sdk/facade-loader.ts
const CURRENT_MODULE_PATH = (0, _nodeUrl.fileURLToPath)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js");
const nodeRequire = (0, _nodeModule.createRequire)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js");
const moduleLoaders = /* @__PURE__ */new Map();
const loadedFacadeModules = /* @__PURE__ */new Map();
const loadedFacadePluginIds = /* @__PURE__ */new Set();
let facadeLoaderSourceTransformFactory;
let cachedOpenClawPackageRoot;
function getSourceTransformFactory() {
  if (facadeLoaderSourceTransformFactory) return facadeLoaderSourceTransformFactory;
  const { createJiti } = nodeRequire("jiti");
  facadeLoaderSourceTransformFactory = createJiti;
  return facadeLoaderSourceTransformFactory;
}
function getOpenClawPackageRoot() {
  if (cachedOpenClawPackageRoot) return cachedOpenClawPackageRoot;
  cachedOpenClawPackageRoot = (0, _sdkAliasNpL7bYup.l)({
    modulePath: (0, _nodeUrl.fileURLToPath)("file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js"),
    moduleUrl: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js"
  }) ?? (0, _nodeUrl.fileURLToPath)(new URL("../..", "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js"));
  return cachedOpenClawPackageRoot;
}
function resolveFacadeModuleLocation(params) {
  const bundledPluginsDir = (0, _bundledDirLBl9nCAz.n)(params.env ?? process.env);
  return (0, _facadeResolutionSharedG6qeiL.n)({
    ...params,
    currentModulePath: CURRENT_MODULE_PATH,
    packageRoot: getOpenClawPackageRoot(),
    bundledPluginsDir
  });
}
function getModuleLoader(modulePath) {
  return (0, _pluginModuleLoaderCacheMuKAXPrS.n)({
    cache: moduleLoaders,
    modulePath,
    importerUrl: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js",
    preferBuiltDist: true,
    loaderFilename: "file:///Users/asherlewis/.nvm/versions/node/v22.22.2/lib/node_modules/openclaw/dist/facade-loader-BqRX3EBI.js",
    createLoader: getSourceTransformFactory()
  });
}
function createLazyFacadeValueLoader(load) {
  let loaded = false;
  let value;
  return () => {
    if (!loaded) {
      value = load();
      loaded = true;
    }
    return value;
  };
}
function createLazyFacadeProxyValue(params) {
  const resolve = createLazyFacadeValueLoader(params.load);
  return new Proxy(params.target, {
    defineProperty(_target, property, descriptor) {
      return Reflect.defineProperty(resolve(), property, descriptor);
    },
    deleteProperty(_target, property) {
      return Reflect.deleteProperty(resolve(), property);
    },
    get(_target, property, receiver) {
      return Reflect.get(resolve(), property, receiver);
    },
    getOwnPropertyDescriptor(_target, property) {
      return Reflect.getOwnPropertyDescriptor(resolve(), property);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(resolve());
    },
    has(_target, property) {
      return Reflect.has(resolve(), property);
    },
    isExtensible() {
      return Reflect.isExtensible(resolve());
    },
    ownKeys() {
      return Reflect.ownKeys(resolve());
    },
    preventExtensions() {
      return Reflect.preventExtensions(resolve());
    },
    set(_target, property, value, receiver) {
      return Reflect.set(resolve(), property, value, receiver);
    },
    setPrototypeOf(_target, prototype) {
      return Reflect.setPrototypeOf(resolve(), prototype);
    }
  });
}
function createLazyFacadeObjectValue(load) {
  return createLazyFacadeProxyValue({
    load,
    target: {}
  });
}
function loadFacadeModuleAtLocationSync(params) {
  const location = params.location;
  const cached = loadedFacadeModules.get(location.modulePath);
  if (cached) return cached;
  const opened = (0, _rootFileCqMcFM3J.i)({
    absolutePath: location.modulePath,
    rootPath: location.boundaryRoot,
    boundaryLabel: location.boundaryRoot === getOpenClawPackageRoot() ? "OpenClaw package root" : (() => {
      const bundledDir = (0, _bundledDirLBl9nCAz.n)();
      return bundledDir && _nodePath.default.resolve(location.boundaryRoot) === _nodePath.default.resolve(bundledDir) ? "bundled plugin directory" : "plugin root";
    })(),
    rejectHardlinks: false
  });
  if (!opened.ok) throw new Error(`Unable to open bundled plugin public surface ${location.modulePath}`, { cause: opened.error });
  _nodeFs.default.closeSync(opened.fd);
  const sentinel = {};
  loadedFacadeModules.set(location.modulePath, sentinel);
  let loaded;
  try {
    loaded = params.loadModule?.(location.modulePath) ?? getModuleLoader(location.modulePath)(location.modulePath);
    Object.assign(sentinel, loaded);
    loadedFacadePluginIds.add(typeof params.trackedPluginId === "function" ? params.trackedPluginId() : params.trackedPluginId);
  } catch (err) {
    loadedFacadeModules.delete(location.modulePath);
    throw err;
  }
  return sentinel;
}
function loadBundledPluginPublicSurfaceModuleSync(params) {
  const location = resolveFacadeModuleLocation(params);
  if (!location) throw new Error(`Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`);
  return loadFacadeModuleAtLocationSync({
    location,
    trackedPluginId: params.trackedPluginId ?? params.dirName
  });
}
function listImportedBundledPluginFacadeIds() {
  return [...loadedFacadePluginIds].toSorted((left, right) => left.localeCompare(right));
}
function resetFacadeLoaderStateForTest() {
  loadedFacadeModules.clear();
  loadedFacadePluginIds.clear();
  moduleLoaders.clear();
  facadeLoaderSourceTransformFactory = void 0;
  cachedOpenClawPackageRoot = void 0;
}
//#endregion /* v9-bf7709a7df7cc008 */
