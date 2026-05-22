"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = readClaudeCliCredentialsForSetup;exports.r = readClaudeCliCredentialsForSetupNonInteractive;exports.t = readClaudeCliCredentialsForRuntime;var _storeA4exFSck = require("./store-a4exFSck.js");
require("./provider-auth-D5QGE8z6.js");
//#region extensions/anthropic/cli-auth-seam.ts
function readClaudeCliCredentialsForSetup() {
  return (0, _storeA4exFSck.k)();
}
function readClaudeCliCredentialsForSetupNonInteractive() {
  return (0, _storeA4exFSck.k)({ allowKeychainPrompt: false });
}
function readClaudeCliCredentialsForRuntime() {
  return (0, _storeA4exFSck.k)({ allowKeychainPrompt: false });
}
//#endregion /* v9-2c98c4c34e7208a8 */
