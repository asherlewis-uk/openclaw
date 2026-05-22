"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.i = isInternalNonDeliveryChannel;exports.n = normalizeMessageChannel;exports.r = void 0;exports.t = isDeliverableMessageChannel;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _idsDFu3Ho6n = require("./ids-DFu3Ho6n.js");
var _registryNormalizeDyAO17vM = require("./registry-normalize-DyAO17vM.js");
//#region src/utils/message-channel-constants.ts
const INTERNAL_MESSAGE_CHANNEL = exports.r = "webchat";
const INTERNAL_NON_DELIVERY_CHANNELS = [
"heartbeat",
"cron",
"webhook",
"voice"];

function isInternalNonDeliveryChannel(value) {
  return INTERNAL_NON_DELIVERY_CHANNELS.includes(value);
}
//#endregion
//#region src/utils/message-channel-core.ts
function normalizeMessageChannel(raw) {
  const normalized = (0, _stringCoerceLndEvhRk.s)(raw);
  if (!normalized) return;
  if (normalized === "webchat") return INTERNAL_MESSAGE_CHANNEL;
  const builtIn = (0, _idsDFu3Ho6n.r)(normalized);
  if (builtIn) return builtIn;
  return (0, _registryNormalizeDyAO17vM.t)(normalized) ?? normalized;
}
function isDeliverableMessageChannel(value) {
  const normalized = normalizeMessageChannel(value);
  return normalized !== void 0 && normalized !== "webchat" && normalized === value;
}
//#endregion /* v9-9e3466f8bdfb6839 */
