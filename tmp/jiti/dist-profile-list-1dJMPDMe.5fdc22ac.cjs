"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = listProfilesForProvider;exports.t = dedupeProfileIds;var _providerAuthAliases3NFJcokO = require("./provider-auth-aliases-3NFJcokO.js");
//#region src/agents/auth-profiles/profile-list.ts
function dedupeProfileIds(profileIds) {
  return [...new Set(profileIds)];
}
function listProfilesForProvider(store, provider) {
  const providerKey = (0, _providerAuthAliases3NFJcokO.r)(provider);
  return Object.entries(store.profiles).filter(([, cred]) => (0, _providerAuthAliases3NFJcokO.r)(cred.provider) === providerKey).map(([id]) => id);
}
//#endregion /* v9-8cc47b39610a829b */
