"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = buildDeepSeekProvider;var _models0oWbVjFz = require("./models-0oWbVjFz.js");
//#region extensions/deepseek/provider-catalog.ts
function buildDeepSeekProvider() {
  return {
    baseUrl: _models0oWbVjFz.t,
    api: "openai-completions",
    models: _models0oWbVjFz.n.map(_models0oWbVjFz.r)
  };
}
//#endregion /* v9-39e1a311ae5cf29d */
