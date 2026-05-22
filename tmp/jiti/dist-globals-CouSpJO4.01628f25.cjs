"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = shouldLogVerbose;exports.i = logVerboseConsole;exports.o = exports.n = void 0;exports.r = logVerbose;exports.t = exports.s = void 0;var _themeCStEj1vt = require("./theme-CStEj1vt.js");
var _loggerDIiFDaHc = require("./logger-DIiFDaHc.js");
//#region src/globals.ts
function shouldLogVerbose() {
  return (0, _loggerDIiFDaHc.x)() || (0, _loggerDIiFDaHc.s)("debug");
}
function logVerbose(message) {
  if (!shouldLogVerbose()) return;
  try {
    (0, _loggerDIiFDaHc.a)().debug({ message }, "verbose");
  } catch {}
  if (!(0, _loggerDIiFDaHc.x)()) return;
  console.log(_themeCStEj1vt.r.muted(message));
}
function logVerboseConsole(message) {
  if (!(0, _loggerDIiFDaHc.x)()) return;
  console.log(_themeCStEj1vt.r.muted(message));
}
const success = exports.o = _themeCStEj1vt.r.success;
const warn = exports.s = _themeCStEj1vt.r.warn;
const info = exports.n = _themeCStEj1vt.r.info;
const danger = exports.t = _themeCStEj1vt.r.error;
//#endregion /* v9-9e549ca48d85443d */
