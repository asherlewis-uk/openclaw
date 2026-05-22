import { a as normalizeMatrixUserId } from "./config-schema-B1OTtJSg.js";
//#region extensions/matrix/src/approval-ids.ts
function normalizeMatrixApproverId(value) {
	return normalizeMatrixUserId(String(value)) || void 0;
}
//#endregion
export { normalizeMatrixApproverId as t };
