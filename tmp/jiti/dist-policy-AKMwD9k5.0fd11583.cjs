"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.t = resolveAgentHarnessPolicy;var _modelRuntimePolicyKr6rAaY = require("./model-runtime-policy-kr6rAaY9.js");
var _runtimeD2Px3Q1Z = require("./runtime-d2Px3Q1Z.js");
var _openaiCodexRoutingKS7Ub1vB = require("./openai-codex-routing-kS7Ub1vB.js");
//#region src/agents/harness/policy.ts
function resolveAgentHarnessPolicy(params) {
  const configured = (0, _modelRuntimePolicyKr6rAaY.t)({
    config: params.config,
    provider: params.provider,
    modelId: params.modelId,
    agentId: params.agentId,
    sessionKey: params.sessionKey
  });
  const configuredRuntime = configured.policy?.id?.trim();
  const runtimeSource = configured.source ?? "implicit";
  const runtime = configuredRuntime && configuredRuntime !== "default" ? (0, _runtimeD2Px3Q1Z.t)(configuredRuntime) : "auto";
  if ((0, _openaiCodexRoutingKS7Ub1vB.o)({
    provider: params.provider,
    config: params.config
  })) {
    if (runtime === "auto") return {
      runtime: "codex",
      runtimeSource
    };
    return {
      runtime,
      runtimeSource
    };
  }
  if ((0, _openaiCodexRoutingKS7Ub1vB.n)(params.provider)) {
    if (runtime === "auto") return {
      runtime: "codex",
      runtimeSource
    };
    return {
      runtime,
      runtimeSource
    };
  }
  return {
    runtime,
    runtimeSource
  };
}
//#endregion /* v9-8f1ae2c7d6d3bb06 */
