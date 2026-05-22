"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = buildSecretInputArraySchema;exports.r = buildSecretInputSchema;exports.t = buildOptionalSecretInputSchema;var _typesSecretsBxqheYvy = require("./types.secrets-BxqheYvy.js");
var _refContractBLk8mcqQ = require("./ref-contract-BLk8mcqQ.js");
var _zodSchemaSensitiveDZxjbqai = require("./zod-schema.sensitive-DZxjbqai.js");
var _zod = require("zod");
//#region src/plugin-sdk/secret-input-schema.ts
function buildSecretInputSchema() {
  return secretInputSchema;
}
const providerSchema = _zod.z.string().regex(_refContractBLk8mcqQ.r, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\").");
const secretInputSchema = _zod.z.union([_zod.z.string(), _zod.z.discriminatedUnion("source", [
_zod.z.object({
  source: _zod.z.literal("env"),
  provider: providerSchema,
  id: _zod.z.string().regex(_typesSecretsBxqheYvy.n, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
}),
_zod.z.object({
  source: _zod.z.literal("file"),
  provider: providerSchema,
  id: _zod.z.string().refine(_refContractBLk8mcqQ.s, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
}),
_zod.z.object({
  source: _zod.z.literal("exec"),
  provider: providerSchema,
  id: _zod.z.string().refine(_refContractBLk8mcqQ.o, (0, _refContractBLk8mcqQ.a)())
})]
)]).register(_zodSchemaSensitiveDZxjbqai.t);
//#endregion
//#region src/plugin-sdk/secret-input.ts
/** Optional version of the shared secret-input schema. */
function buildOptionalSecretInputSchema() {
  return buildSecretInputSchema().optional();
}
/** Array version of the shared secret-input schema. */
function buildSecretInputArraySchema() {
  return _zod.z.array(buildSecretInputSchema());
}
//#endregion /* v9-fdbfad4f01ef90ea */
