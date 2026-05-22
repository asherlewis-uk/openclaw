"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = privateFileStoreSync;exports.t = privateFileStore;require("./fs-safe-defaults-azXCfv92.js");
var _fileStoreBh8hmqc = require("./file-store-Bh8hmqc8.js");
//#region src/infra/private-file-store.ts
function privateFileStore(rootDir) {
  return (0, _fileStoreBh8hmqc.t)({
    rootDir,
    private: true
  });
}
function privateFileStoreSync(rootDir) {
  return (0, _fileStoreBh8hmqc.n)({
    rootDir,
    private: true
  });
}
//#endregion /* v9-41c13166bf674a8e */
