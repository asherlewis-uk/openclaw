"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _channelEntryContract = require("openclaw/plugin-sdk/channel-entry-contract");
//#region extensions/matrix/setup-entry.ts
var setup_entry_default = exports.default = (0, _channelEntryContract.defineBundledChannelSetupEntry)({
  importMetaUrl: "file:///Users/asherlewis/.openclaw/npm/node_modules/@openclaw/matrix/dist/setup-entry.js",
  plugin: {
    specifier: "./setup-plugin-api.js",
    exportName: "matrixSetupPlugin"
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets"
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
    exportName: "setMatrixRuntime"
  }
});
//#endregion /* v9-918df1aede8cccce */
