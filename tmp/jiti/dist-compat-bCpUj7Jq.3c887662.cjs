"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.i = setErrorMap;exports.n = void 0;exports.r = getErrorMap;exports.t = void 0;var _schemasDel5uzR = require("./schemas-Del5uzR8.js");
//#region node_modules/zod/v4/classic/compat.js
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
const ZodIssueCode = exports.n = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
/** @deprecated Use `z.config(params)` instead. */
function setErrorMap(map) {
  (0, _schemasDel5uzR.Ci)({ customError: map });
}
/** @deprecated Use `z.config()` instead. */
function getErrorMap() {
  return (0, _schemasDel5uzR.Ci)().customError;
}
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (exports.t = ZodFirstPartyTypeKind = {}));
//#endregion /* v9-fa48b8878afd6620 */
