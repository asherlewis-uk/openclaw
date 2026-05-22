"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = mutateConfigFile;exports.r = replaceConfigFile;exports.t = void 0;var _errorsVfATXfah = require("./errors-VfATXfah.js");
var _pathB5B_oAT = require("./path-B5B-_oAT.js");
var _utilsCKsuXgDI = require("./utils-CKsuXgDI.js");
var _replaceFileVPhXrtU = require("./replace-file-VPhXrtU-.js");
require("./scan-paths-CQGIktzD.js");
var _io5xE1dPMK = require("./io-5xE1dPMK.js");
var _includesCuflrSI = require("./includes-CuflrSI8.js");
var _nixModeWriteGuardBqXH8Kti = require("./nix-mode-write-guard-BqXH8Kti.js");
var _runtimeSnapshotTLK3Mx7y = require("./runtime-snapshot-tLK3Mx7y.js");
var _nodePath = _interopRequireDefault(require("node:path"));
var _promises = _interopRequireDefault(require("node:fs/promises"));
var _nodeUtil = require("node:util");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/config/mutate.ts
var ConfigMutationConflictError = class extends Error {
  constructor(message, params) {
    super(message);
    this.name = "ConfigMutationConflictError";
    this.currentHash = params.currentHash;
  }
};exports.t = ConfigMutationConflictError;
function assertBaseHashMatches(snapshot, expectedHash) {
  const currentHash = (0, _io5xE1dPMK.y)(snapshot) ?? null;
  if (expectedHash !== void 0 && expectedHash !== currentHash) throw new ConfigMutationConflictError("config changed since last load", { currentHash });
  return currentHash;
}
function getChangedTopLevelKeys(base, next) {
  if (!(0, _utilsCKsuXgDI.c)(base) || !(0, _utilsCKsuXgDI.c)(next)) return (0, _nodeUtil.isDeepStrictEqual)(base, next) ? [] : ["<root>"];
  return [...new Set([...Object.keys(base), ...Object.keys(next)])].filter((key) => !(0, _nodeUtil.isDeepStrictEqual)(base[key], next[key]));
}
function getSingleTopLevelIncludeTarget(params) {
  if (!(0, _utilsCKsuXgDI.c)(params.snapshot.parsed)) return null;
  const authoredSection = params.snapshot.parsed[params.key];
  if (!(0, _utilsCKsuXgDI.c)(authoredSection)) return null;
  const keys = Object.keys(authoredSection);
  const includeValue = authoredSection[_includesCuflrSI.r];
  if (keys.length !== 1 || typeof includeValue !== "string") return null;
  const rootDir = _nodePath.default.dirname(params.snapshot.path);
  const resolved = _nodePath.default.normalize(_nodePath.default.isAbsolute(includeValue) ? includeValue : _nodePath.default.resolve(rootDir, includeValue));
  if (!(0, _pathB5B_oAT.i)(rootDir, resolved)) return null;
  return resolved;
}
async function writeJsonFileAtomic(filePath, value) {
  await (0, _replaceFileVPhXrtU.n)({
    filePath,
    content: `${JSON.stringify(value, null, 2)}\n`,
    dirMode: 448,
    mode: 384,
    tempPrefix: _nodePath.default.basename(filePath),
    beforeRename: async () => {
      await _promises.default.access(filePath).then(async () => await (0, _io5xE1dPMK.K)(filePath, _promises.default), () => void 0);
    }
  });
}
async function tryWriteSingleTopLevelIncludeMutation(params) {
  const nextConfig = (0, _io5xE1dPMK.z)(params.nextConfig, (0, _io5xE1dPMK.B)(params.writeOptions?.unsetPaths));
  const changedKeys = getChangedTopLevelKeys(params.snapshot.sourceConfig, nextConfig);
  if (changedKeys.length !== 1 || changedKeys[0] === "<root>") return false;
  const key = changedKeys[0];
  const includePath = getSingleTopLevelIncludeTarget({
    snapshot: params.snapshot,
    key
  });
  if (!includePath || !(0, _utilsCKsuXgDI.c)(nextConfig) || !(key in nextConfig)) return false;
  const nextConfigRecord = nextConfig;
  if (params.writeOptions?.skipPluginValidation) return false;
  const validated = (0, _io5xE1dPMK.T)(nextConfig);
  if (!validated.ok) throw (0, _io5xE1dPMK.U)(params.snapshot.path, (0, _io5xE1dPMK.W)(validated.issues));
  const runtimeConfigSnapshot = (0, _runtimeSnapshotTLK3Mx7y.i)();
  const runtimeConfigSourceSnapshot = (0, _runtimeSnapshotTLK3Mx7y.s)();
  const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
  const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
  await writeJsonFileAtomic(includePath, nextConfigRecord[key]);
  if (params.writeOptions?.skipRuntimeSnapshotRefresh && !hadRuntimeSnapshot && !(0, _runtimeSnapshotTLK3Mx7y.o)()) return true;
  const refreshedSnapshot = (await (params.io?.readConfigFileSnapshotForWrite ?? _io5xE1dPMK.d)()).snapshot;
  const persistedHash = (0, _io5xE1dPMK.y)(refreshedSnapshot);
  if (!refreshedSnapshot.valid) throw (0, _io5xE1dPMK.U)(params.snapshot.path, (0, _io5xE1dPMK.W)(refreshedSnapshot.issues));
  if (!persistedHash) throw new Error(`Config was written to ${params.snapshot.path}, but no persisted hash was available.`);
  const notifyCommittedWrite = () => {
    const currentRuntimeConfig = (0, _runtimeSnapshotTLK3Mx7y.i)();
    if (!currentRuntimeConfig) return;
    (0, _runtimeSnapshotTLK3Mx7y.u)((0, _runtimeSnapshotTLK3Mx7y.n)({
      configPath: params.snapshot.path,
      sourceConfig: refreshedSnapshot.sourceConfig,
      runtimeConfig: currentRuntimeConfig,
      persistedHash,
      afterWrite: params.afterWrite ?? params.writeOptions?.afterWrite
    }));
  };
  await (0, _runtimeSnapshotTLK3Mx7y.r)({
    nextSourceConfig: refreshedSnapshot.sourceConfig,
    hadRuntimeSnapshot,
    hadBothSnapshots,
    loadFreshConfig: () => refreshedSnapshot.runtimeConfig,
    notifyCommittedWrite,
    formatRefreshError: (error) => (0, _errorsVfATXfah.i)(error),
    createRefreshError: (detail, cause) => new Error(`Config was written to ${params.snapshot.path}, but runtime snapshot refresh failed: ${detail}`, { cause })
  });
  return true;
}
async function replaceConfigFile(params) {
  const { snapshot, writeOptions } = params.snapshot && params.writeOptions ? {
    snapshot: params.snapshot,
    writeOptions: params.writeOptions
  } : await (params.io?.readConfigFileSnapshotForWrite ?? _io5xE1dPMK.d)();
  (0, _nixModeWriteGuardBqXH8Kti.n)({ configPath: snapshot.path });
  const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
  const afterWrite = (0, _runtimeSnapshotTLK3Mx7y.p)(params.afterWrite ?? params.writeOptions?.afterWrite);
  if (!(await tryWriteSingleTopLevelIncludeMutation({
    snapshot,
    nextConfig: params.nextConfig,
    afterWrite,
    writeOptions: params.writeOptions ?? writeOptions,
    io: params.io
  }))) await (params.io?.writeConfigFile ?? _io5xE1dPMK.b)(params.nextConfig, {
    baseSnapshot: snapshot,
    ...writeOptions,
    ...params.writeOptions,
    afterWrite
  });
  return {
    path: snapshot.path,
    previousHash,
    snapshot,
    nextConfig: params.nextConfig,
    afterWrite,
    followUp: (0, _runtimeSnapshotTLK3Mx7y.m)(afterWrite)
  };
}
async function mutateConfigFile(params) {
  const { snapshot, writeOptions } = await (params.io?.readConfigFileSnapshotForWrite ?? _io5xE1dPMK.d)();
  (0, _nixModeWriteGuardBqXH8Kti.n)({ configPath: snapshot.path });
  const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
  const baseConfig = params.base === "runtime" ? snapshot.runtimeConfig : snapshot.sourceConfig;
  const draft = structuredClone(baseConfig);
  const result = await params.mutate(draft, {
    snapshot,
    previousHash
  });
  const afterWrite = (0, _runtimeSnapshotTLK3Mx7y.p)(params.afterWrite ?? params.writeOptions?.afterWrite);
  if (!(await tryWriteSingleTopLevelIncludeMutation({
    snapshot,
    nextConfig: draft,
    afterWrite,
    writeOptions: {
      ...writeOptions,
      ...params.writeOptions
    },
    io: params.io
  }))) await (params.io?.writeConfigFile ?? _io5xE1dPMK.b)(draft, {
    ...writeOptions,
    ...params.writeOptions,
    afterWrite
  });
  return {
    path: snapshot.path,
    previousHash,
    snapshot,
    nextConfig: draft,
    result,
    afterWrite,
    followUp: (0, _runtimeSnapshotTLK3Mx7y.m)(afterWrite)
  };
}
//#endregion /* v9-a5fff67305772c77 */
