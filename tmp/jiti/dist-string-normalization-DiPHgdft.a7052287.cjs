"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.a = normalizeOptionalTrimmedStringList;exports.c = normalizeStringEntriesLower;exports.i = normalizeHyphenSlug;exports.l = normalizeTrimmedStringList;exports.n = normalizeAtHashSlug;exports.o = normalizeSingleOrTrimmedStringList;exports.r = normalizeCsvOrLooseStringList;exports.s = normalizeStringEntries;exports.t = normalizeArrayBackedTrimmedStringList;var _stringCoerceDyL154ka = require("./string-coerce-DyL154ka.js");
//#region src/shared/string-normalization.ts
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => (0, _stringCoerceDyL154ka.c)(String(entry)) ?? "").filter(Boolean);
}
function normalizeStringEntriesLower(list) {
  return normalizeStringEntries(list).map((entry) => (0, _stringCoerceDyL154ka.s)(entry) ?? "");
}
function normalizeTrimmedStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const normalized = (0, _stringCoerceDyL154ka.c)(entry);
    return normalized ? [normalized] : [];
  });
}
function normalizeOptionalTrimmedStringList(value) {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeArrayBackedTrimmedStringList(value) {
  if (!Array.isArray(value)) return;
  return normalizeTrimmedStringList(value);
}
function normalizeSingleOrTrimmedStringList(value) {
  if (Array.isArray(value)) return normalizeTrimmedStringList(value);
  const normalized = (0, _stringCoerceDyL154ka.c)(value);
  return normalized ? [normalized] : [];
}
function normalizeCsvOrLooseStringList(value) {
  if (Array.isArray(value)) return normalizeStringEntries(value);
  if (typeof value === "string") return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  return [];
}
function normalizeSlugInput(raw) {
  return ((0, _stringCoerceDyL154ka.s)(raw) ?? "").normalize("NFC");
}
function normalizeHyphenSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) return "";
  return trimmed.replace(/\s+/g, "-").replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}
function normalizeAtHashSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) return "";
  return trimmed.replace(/^[@#]+/, "").replace(/[\s_]+/g, "-").replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
//#endregion /* v9-96f729b56e980737 */
