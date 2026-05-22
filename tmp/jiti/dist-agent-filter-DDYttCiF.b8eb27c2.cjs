"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveEffectiveAgentSkillsLimits;exports.t = resolveEffectiveAgentSkillFilter;var _sessionKeyDFEyR49L = require("./session-key-DFEyR49L.js");
var _filter_6eE5RKS = require("./filter-_6eE5RKS.js");
//#region src/agents/skills/agent-filter.ts
function resolveAgentEntry(cfg, agentId) {
  if (!cfg) return;
  const normalizedAgentId = (0, _sessionKeyDFEyR49L.c)(agentId);
  return cfg.agents?.list?.find((entry) => (0, _sessionKeyDFEyR49L.c)(entry.id) === normalizedAgentId);
}
/**
* Explicit per-agent skills win when present; otherwise fall back to shared defaults.
* Unknown agent ids also fall back to defaults so legacy/unresolved callers do not widen access.
*/
function resolveEffectiveAgentSkillFilter(cfg, agentId) {
  if (!cfg) return;
  const agentEntry = resolveAgentEntry(cfg, agentId);
  if (agentEntry && Object.hasOwn(agentEntry, "skills")) return (0, _filter_6eE5RKS.n)(agentEntry.skills);
  return (0, _filter_6eE5RKS.n)(cfg.agents?.defaults?.skills);
}
function resolveEffectiveAgentSkillsLimits(cfg, agentId) {
  if (!agentId) return;
  const agentEntry = resolveAgentEntry(cfg, agentId);
  if (!agentEntry || !Object.hasOwn(agentEntry, "skillsLimits")) return;
  const { maxSkillsPromptChars } = agentEntry.skillsLimits ?? {};
  return typeof maxSkillsPromptChars === "number" ? { maxSkillsPromptChars } : void 0;
}
//#endregion /* v9-19c8133802c997ae */
