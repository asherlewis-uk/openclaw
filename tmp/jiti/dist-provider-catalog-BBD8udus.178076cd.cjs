"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = buildBytePlusProvider;exports.t = buildBytePlusCodingProvider;var _providerCatalogShared4kkagm5f = require("./provider-catalog-shared-4kkagm5f.js");
var _openclawPluginBAfFPp8s = require("./openclaw.plugin-BAfFPp8s.js");
//#region extensions/byteplus/provider-catalog.ts
function buildBytePlusProvider() {
  return (0, _providerCatalogShared4kkagm5f.n)({
    providerId: "byteplus",
    catalog: _openclawPluginBAfFPp8s.t.providers.byteplus
  });
}
function buildBytePlusCodingProvider() {
  return (0, _providerCatalogShared4kkagm5f.n)({
    providerId: "byteplus-plan",
    catalog: _openclawPluginBAfFPp8s.t.providers["byteplus-plan"]
  });
}
//#endregion /* v9-2bca7b2d8d072421 */
