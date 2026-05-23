"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = isPathInsideWithRealpath;exports.c = isWithinDir;exports.d = resolveSafeRelativePath;exports.f = safeRealpathSync;exports.i = isPathInside;exports.l = normalizeWindowsPathForComparison;exports.m = void 0;exports.n = hasNodeErrorCode;exports.o = isPathRelativeEscape;exports.p = safeStatSync;exports.r = isNotFoundPathError;exports.s = isSymlinkOpenError;exports.t = assertNoNulPathInput;exports.u = resolveSafeBaseDir;var _stringCoerce6TL5VVOL = require("./string-coerce-6TL5VVOL.js");
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = new Set([
"helper-failed",
"helper-unavailable",
"permission-unverified",
"timeout",
"unsupported-platform"]
);
function categorizeFsSafeError(code) {
  return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
  code;
  category;
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = "FsSafeError";
    this.code = code;
    this.category = categorizeFsSafeError(code);
  }
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path.js
exports.m = FsSafeError;const NOT_FOUND_CODES = new Set(["ENOENT", "ENOTDIR"]);
const SYMLINK_OPEN_CODES = new Set([
"ELOOP",
"EINVAL",
"ENOTSUP"]
);
const POSIX_SEPARATOR_CHAR_CODE = 47;
function normalizeWindowsPathForComparison(input) {
  let normalized = _nodePath.default.win32.normalize(input);
  if (normalized.startsWith("\\\\?\\")) {
    normalized = normalized.slice(4);
    if (normalized.toUpperCase().startsWith("UNC\\")) normalized = `\\\\${normalized.slice(4)}`;
  }
  return (0, _stringCoerce6TL5VVOL.t)(normalized.replaceAll("/", "\\"));
}
function isNodeError(value) {
  return Boolean(value && typeof value === "object" && "code" in value);
}
function hasNodeErrorCode(value, code) {
  return isNodeError(value) && value.code === code;
}
function assertNoNulPathInput(filePath, message = "path contains a NUL byte") {
  if (filePath.includes("\0")) throw new FsSafeError("invalid-path", message);
}
function isNotFoundPathError(value) {
  return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}
function isSymlinkOpenError(value) {
  return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}
function isPathInside(root, target) {
  if (process.platform === "win32") {
    const rootForCompare = normalizeWindowsPathForComparison(_nodePath.default.win32.resolve(root));
    const targetForCompare = normalizeWindowsPathForComparison(_nodePath.default.win32.resolve(target));
    const relative = _nodePath.default.win32.relative(rootForCompare, targetForCompare);
    const firstSegment = relative.split(_nodePath.default.win32.sep)[0];
    return relative === "" || firstSegment !== ".." && !_nodePath.default.win32.isAbsolute(relative);
  }
  if (root.length > 0 && root.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && target.length >= root.length && target.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && !target.includes("/..") && (target === root || target.startsWith(root) && target.charCodeAt(root.length) === POSIX_SEPARATOR_CHAR_CODE)) return true;
  const resolvedRoot = _nodePath.default.resolve(root);
  const resolvedTarget = _nodePath.default.resolve(target);
  const relative = _nodePath.default.relative(resolvedRoot, resolvedTarget);
  const firstSegment = relative.split(_nodePath.default.posix.sep)[0];
  return relative === "" || firstSegment !== ".." && !_nodePath.default.isAbsolute(relative);
}
function isPathRelativeEscape(relativePath) {
  return relativePath === ".." || relativePath.startsWith(`..${_nodePath.default.sep}`) || _nodePath.default.isAbsolute(relativePath);
}
function resolveSafeBaseDir(rootDir) {
  const resolved = _nodePath.default.resolve(rootDir);
  return resolved.endsWith(_nodePath.default.sep) ? resolved : `${resolved}${_nodePath.default.sep}`;
}
function isWithinDir(rootDir, targetPath) {
  return isPathInside(rootDir, targetPath);
}
function safeRealpathSync(targetPath, cache) {
  const cached = cache?.get(targetPath);
  if (cached) return cached;
  try {
    const resolved = _nodeFs.default.realpathSync(targetPath);
    cache?.set(targetPath, resolved);
    cache?.set(resolved, resolved);
    return resolved;
  } catch {
    return null;
  }
}
function isPathInsideWithRealpath(basePath, candidatePath, opts) {
  if (!isPathInside(basePath, candidatePath)) return false;
  const baseReal = safeRealpathSync(basePath, opts?.cache);
  const candidateReal = safeRealpathSync(candidatePath, opts?.cache);
  if (!baseReal || !candidateReal) return opts?.requireRealpath === false;
  return isPathInside(baseReal, candidateReal);
}
function safeStatSync(targetPath) {
  try {
    return _nodeFs.default.statSync(targetPath);
  } catch {
    return null;
  }
}
function splitSafeRelativePath(relativePath) {
  if (relativePath.length === 0 || relativePath === ".") return [];
  assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
  if (relativePath.includes("\\")) throw new FsSafeError("invalid-path", "relative path must use forward slashes");
  if (_nodePath.default.posix.isAbsolute(relativePath) || _nodePath.default.win32.isAbsolute(relativePath) || relativePath.startsWith("//")) throw new FsSafeError("invalid-path", "relative path must not be absolute");
  const segments = relativePath.split("/").filter((segment) => segment.length > 0 && segment !== ".");
  for (const segment of segments) if (segment === "..") throw new FsSafeError("invalid-path", "relative path must not contain '..'");
  return segments;
}
function resolveSafeRelativePath(rootDir, relativePath) {
  const root = _nodePath.default.resolve(rootDir);
  const target = _nodePath.default.resolve(root, ...splitSafeRelativePath(relativePath));
  if (!isPathInside(root, target)) throw new FsSafeError("outside-workspace", "relative path escapes root");
  return target;
}
//#endregion /* v9-bae3319934e0f4c5 */
