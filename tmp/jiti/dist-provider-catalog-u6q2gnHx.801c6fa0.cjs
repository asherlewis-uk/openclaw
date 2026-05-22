"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = buildTokenHubProvider;var _modelsXNmSbtfr = require("./models-XNmSbtfr.js");
//#region extensions/tencent/provider-catalog.ts
function buildTokenHubProvider() {
  return {
    baseUrl: _modelsXNmSbtfr.t,
    api: "openai-completions",
    models: _modelsXNmSbtfr.n.map(_modelsXNmSbtfr.i)
  };
}
//#endregion /* v9-7bbac21f88879dc6 */
