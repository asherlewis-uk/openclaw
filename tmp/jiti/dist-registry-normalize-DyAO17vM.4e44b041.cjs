"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = normalizeAnyChannelId;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _registryLookupDrgM4VYY = require("./registry-lookup-DrgM4VYY.js");
//#region src/channels/registry-normalize.ts
function normalizeAnyChannelId(raw) {
  const key = (0, _stringCoerceLndEvhRk.s)(raw);
  if (!key) return null;
  return (0, _registryLookupDrgM4VYY.t)(key)?.plugin.id ?? null;
}
//#endregion /* v9-71b3717343589c8a */
