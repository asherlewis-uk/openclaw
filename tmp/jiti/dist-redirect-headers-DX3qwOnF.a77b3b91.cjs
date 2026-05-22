"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = retainSafeHeadersForCrossOriginRedirect;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _fetchHeadersDaqi8X9C = require("./fetch-headers-Daqi8X9C.js");
//#region src/infra/net/redirect-headers.ts
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = new Set([
"accept",
"accept-encoding",
"accept-language",
"cache-control",
"content-language",
"content-type",
"if-match",
"if-modified-since",
"if-none-match",
"if-unmodified-since",
"pragma",
"range",
"user-agent"]
);
function retainSafeHeadersForCrossOriginRedirect(headers) {
  if (!headers) return headers;
  const incoming = new Headers((0, _fetchHeadersDaqi8X9C.t)(headers));
  const safeHeaders = {};
  for (const [key, value] of incoming.entries()) if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has((0, _stringCoerceLndEvhRk.a)(key))) safeHeaders[key] = value;
  return safeHeaders;
}
//#endregion /* v9-d5d1929de6461e5d */
