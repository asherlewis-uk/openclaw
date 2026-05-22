"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = saveJsonFile;exports.t = loadJsonFile;require("./fs-safe-defaults-azXCfv92.js");
var _jsonFilesCahFuwKs = require("./json-files-CahFuwKs.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/infra/json-file.ts
function resolveJsonSymlinkTarget(pathname) {
  let stat;
  try {
    stat = _nodeFs.default.lstatSync(pathname);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  if (!stat.isSymbolicLink()) return;
  return _nodePath.default.resolve(_nodePath.default.dirname(pathname), _nodeFs.default.readlinkSync(pathname));
}
function resolveJsonSaveTarget(pathname) {
  const target = resolveJsonSymlinkTarget(pathname);
  if (!target) return pathname;
  _nodeFs.default.statSync(_nodePath.default.dirname(target));
  return target;
}
function saveJsonFile(pathname, data) {
  (0, _jsonFilesCahFuwKs.f)(resolveJsonSaveTarget(pathname), data);
}
function loadJsonFile(pathname) {
  const direct = (0, _jsonFilesCahFuwKs.u)(pathname);
  if (direct !== null) return direct;
  const target = resolveJsonSymlinkTarget(pathname);
  return target ? (0, _jsonFilesCahFuwKs.u)(target) ?? void 0 : void 0;
}
//#endregion /* v9-c76025c416e78f51 */
