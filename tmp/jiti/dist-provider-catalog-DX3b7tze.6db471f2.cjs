"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = buildDoubaoProvider;exports.t = buildDoubaoCodingProvider;var _providerCatalogShared4kkagm5f = require("./provider-catalog-shared-4kkagm5f.js");
var _openclawPluginDqQ9bIzT = require("./openclaw.plugin-DqQ9bIzT.js");
//#region extensions/volcengine/provider-catalog.ts
function buildDoubaoProvider() {
  return (0, _providerCatalogShared4kkagm5f.n)({
    providerId: "volcengine",
    catalog: _openclawPluginDqQ9bIzT.t.providers.volcengine
  });
}
function buildDoubaoCodingProvider() {
  return (0, _providerCatalogShared4kkagm5f.n)({
    providerId: "volcengine-plan",
    catalog: _openclawPluginDqQ9bIzT.t.providers["volcengine-plan"]
  });
}
//#endregion /* v9-bdd13d48371b75b0 */
