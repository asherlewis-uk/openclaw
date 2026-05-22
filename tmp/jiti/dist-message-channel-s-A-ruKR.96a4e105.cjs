"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = isOperatorUiClient;exports.c = isGatewayMessageChannel;exports.d = resolveGatewayMessageChannel;exports.f = resolveMessageChannel;exports.i = isMarkdownCapableMessageChannel;exports.l = void 0;exports.n = isGatewayCliClient;exports.o = isWebchatClient;exports.r = isInternalMessageChannel;exports.s = isDeliverableMessageChannel;exports.t = isBrowserOperatorUiClient;exports.u = normalizeMessageChannel;var _idsDFu3Ho6n = require("./ids-DFu3Ho6n.js");
var _chatMetaDTmQp8Tt = require("./chat-meta-DTmQp8Tt.js");
var _registryEre6Hdl = require("./registry-ere6Hdl3.js");
var _clientInfoCgOISqZp = require("./client-info-CgOISqZp.js");
var _messageChannelCoreBsMA2kH = require("./message-channel-core-Bs-MA2kH.js");
//#region src/utils/message-channel-normalize.ts
function normalizeMessageChannel(raw) {
  return (0, _messageChannelCoreBsMA2kH.n)(raw);
}
const listPluginChannelIds = () => {
  return (0, _registryEre6Hdl.i)();
};
const listDeliverableMessageChannels = () => Array.from(new Set([..._idsDFu3Ho6n.t, ...listPluginChannelIds()]));exports.l = listDeliverableMessageChannels;
const listGatewayMessageChannels = () => [...listDeliverableMessageChannels(), _messageChannelCoreBsMA2kH.r];
function isGatewayMessageChannel(value) {
  return listGatewayMessageChannels().includes(value);
}
function isDeliverableMessageChannel(value) {
  return listDeliverableMessageChannels().includes(value);
}
function resolveGatewayMessageChannel(raw) {
  const normalized = normalizeMessageChannel(raw);
  if (!normalized) return;
  return isGatewayMessageChannel(normalized) ? normalized : void 0;
}
function resolveMessageChannel(primary, fallback) {
  return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}
//#endregion
//#region src/utils/message-channel.ts
function isGatewayCliClient(client) {
  return (0, _clientInfoCgOISqZp.s)(client?.mode) === _clientInfoCgOISqZp.r.CLI;
}
function isOperatorUiClient(client) {
  const clientId = (0, _clientInfoCgOISqZp.c)(client?.id);
  return clientId === _clientInfoCgOISqZp.i.CONTROL_UI || clientId === _clientInfoCgOISqZp.i.TUI;
}
function isBrowserOperatorUiClient(client) {
  return (0, _clientInfoCgOISqZp.c)(client?.id) === _clientInfoCgOISqZp.i.CONTROL_UI;
}
function isInternalMessageChannel(raw) {
  return normalizeMessageChannel(raw) === _messageChannelCoreBsMA2kH.r;
}
function isWebchatClient(client) {
  if ((0, _clientInfoCgOISqZp.s)(client?.mode) === _clientInfoCgOISqZp.r.WEBCHAT) return true;
  return (0, _clientInfoCgOISqZp.c)(client?.id) === _clientInfoCgOISqZp.i.WEBCHAT_UI;
}
function isMarkdownCapableMessageChannel(raw) {
  const channel = normalizeMessageChannel(raw);
  if (!channel) return false;
  if (channel === "webchat" || channel === "tui") return true;
  const builtInChannel = (0, _idsDFu3Ho6n.r)(channel);
  if (builtInChannel) return (0, _chatMetaDTmQp8Tt.t)(builtInChannel).markdownCapable === true;
  return (0, _registryEre6Hdl.r)(channel)?.markdownCapable === true;
}
//#endregion /* v9-53761119e7f3da4a */
