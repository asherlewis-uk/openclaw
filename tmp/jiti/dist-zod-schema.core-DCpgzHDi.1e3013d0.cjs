"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.F = exports.E = exports.D = exports.C = exports.A = void 0;exports.I = isBuiltInModelProviderOverlayId;exports.y = exports.x = exports.w = exports.v = exports.u = exports.t = exports.s = exports.r = exports.p = exports.o = exports.n = exports.m = exports.l = exports.k = exports.j = exports.i = exports.h = exports.g = exports.f = exports.d = exports.c = exports.b = exports.a = exports._ = exports.T = exports.S = exports.R = exports.P = exports.O = exports.N = exports.M = exports.L = void 0;exports.z = createAllowDenyChannelRulesSchema;var _providerIdZTW9Rdln = require("./provider-id-zTW9Rdln.js");
var _stringNormalizationDiPHgdft = require("./string-normalization-DiPHgdft.js");
var _typesModelsLqH0KLkn = require("./types.models-lqH0KLkn.js");
var _schemasDel5uzR = require("./schemas-Del5uzR8.js");
var _compatBCpUj7Jq = require("./compat-bCpUj7Jq.js");
var _refContractB9AxLDQm = require("./ref-contract-B9AxLDQm.js");
var _execSafety1iu4aOkR = require("./exec-safety-1iu4aOkR.js");
var _zodSchemaSensitive3GVmnUbm = require("./zod-schema.sensitive-3GVmnUbm.js");
var _nodePath = _interopRequireDefault(require("node:path"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/config/zod-schema.allowdeny.ts
const AllowDenyActionSchema = (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("allow"), (0, _schemasDel5uzR.dn)("deny")]);
const AllowDenyChatTypeSchema = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("direct"),
(0, _schemasDel5uzR.dn)("group"),
(0, _schemasDel5uzR.dn)("channel"),
(0, _schemasDel5uzR.dn)("dm")]
).optional();
function createAllowDenyChannelRulesSchema() {
  return (0, _schemasDel5uzR.Tn)({
    default: AllowDenyActionSchema.optional(),
    rules: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Tn)({
      action: AllowDenyActionSchema,
      match: (0, _schemasDel5uzR.Tn)({
        channel: (0, _schemasDel5uzR.Rn)().optional(),
        chatType: AllowDenyChatTypeSchema,
        keyPrefix: (0, _schemasDel5uzR.Rn)().optional(),
        rawKeyPrefix: (0, _schemasDel5uzR.Rn)().optional()
      }).strict().optional()
    }).strict()).optional()
  }).strict().optional();
}
//#endregion
//#region src/config/zod-schema.core.ts
const ENV_SECRET_REF_ID_PATTERN = /^[A-Z][A-Z0-9_]{0,127}$/;
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePath(value) {
  return _nodePath.default.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
const SecretRefSchema = exports.T = (0, _schemasDel5uzR.Bt)("source", [
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("env"),
  provider: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
  id: (0, _schemasDel5uzR.Rn)().regex(ENV_SECRET_REF_ID_PATTERN, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
}).strict(),
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("file"),
  provider: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
  id: (0, _schemasDel5uzR.Rn)().refine(_refContractB9AxLDQm.s, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
}).strict(),
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("exec"),
  provider: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
  id: (0, _schemasDel5uzR.Rn)().refine(_refContractB9AxLDQm.o, (0, _refContractB9AxLDQm.a)())
}).strict()]
);
const SecretInputSchema = exports.C = (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.Rn)(), SecretRefSchema]);
const SecretProviderSchema = exports.w = (0, _schemasDel5uzR.Bt)("source", [
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("env"),
  allowlist: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().regex(ENV_SECRET_REF_ID_PATTERN)).max(256).optional()
}).strict(),
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("file"),
  path: (0, _schemasDel5uzR.Rn)().min(1),
  mode: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("singleValue"), (0, _schemasDel5uzR.dn)("json")]).optional(),
  timeoutMs: (0, _schemasDel5uzR.wn)().int().positive().max(12e4).optional(),
  maxBytes: (0, _schemasDel5uzR.wn)().int().positive().max(20 * 1024 * 1024).optional(),
  allowInsecurePath: (0, _schemasDel5uzR.At)().optional()
}).strict(),
(0, _schemasDel5uzR.Tn)({
  source: (0, _schemasDel5uzR.dn)("exec"),
  command: (0, _schemasDel5uzR.Rn)().min(1).refine((value) => (0, _execSafety1iu4aOkR.t)(value), "secrets.providers.*.command is unsafe.").refine((value) => isAbsolutePath(value), "secrets.providers.*.command must be an absolute path."),
  args: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().max(1024)).max(128).optional(),
  timeoutMs: (0, _schemasDel5uzR.wn)().int().positive().max(12e4).optional(),
  noOutputTimeoutMs: (0, _schemasDel5uzR.wn)().int().positive().max(12e4).optional(),
  maxOutputBytes: (0, _schemasDel5uzR.wn)().int().positive().max(20 * 1024 * 1024).optional(),
  jsonOnly: (0, _schemasDel5uzR.At)().optional(),
  env: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)()).optional(),
  passEnv: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().regex(ENV_SECRET_REF_ID_PATTERN)).max(128).optional(),
  trustedDirs: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().min(1).refine((value) => isAbsolutePath(value), "trustedDirs entries must be absolute paths.")).max(64).optional(),
  allowInsecurePath: (0, _schemasDel5uzR.At)().optional(),
  allowSymlinkCommand: (0, _schemasDel5uzR.At)().optional()
}).strict()]
);
const SecretsConfigSchema = exports.E = (0, _schemasDel5uzR.Tn)({
  providers: (0, _schemasDel5uzR.Tn)({}).catchall(SecretProviderSchema).optional(),
  defaults: (0, _schemasDel5uzR.Tn)({
    env: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
    file: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
    exec: (0, _schemasDel5uzR.Rn)().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional()
  }).strict().optional(),
  resolution: (0, _schemasDel5uzR.Tn)({
    maxProviderConcurrency: (0, _schemasDel5uzR.wn)().int().positive().max(16).optional(),
    maxRefsPerProvider: (0, _schemasDel5uzR.wn)().int().positive().max(4096).optional(),
    maxBatchBytes: (0, _schemasDel5uzR.wn)().int().positive().max(5 * 1024 * 1024).optional()
  }).strict().optional()
}).strict().optional();
const ModelApiSchema = (0, _schemasDel5uzR.yt)(_typesModelsLqH0KLkn.t);
const ModelCompatSchema = (0, _schemasDel5uzR.Tn)({
  supportsStore: (0, _schemasDel5uzR.At)().optional(),
  supportsPromptCacheKey: (0, _schemasDel5uzR.At)().optional(),
  supportsDeveloperRole: (0, _schemasDel5uzR.At)().optional(),
  supportsReasoningEffort: (0, _schemasDel5uzR.At)().optional(),
  supportsUsageInStreaming: (0, _schemasDel5uzR.At)().optional(),
  supportsTools: (0, _schemasDel5uzR.At)().optional(),
  supportsStrictMode: (0, _schemasDel5uzR.At)().optional(),
  requiresStringContent: (0, _schemasDel5uzR.At)().optional(),
  strictMessageKeys: (0, _schemasDel5uzR.At)().optional(),
  visibleReasoningDetailTypes: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().min(1)).optional(),
  supportedReasoningEfforts: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().min(1)).optional(),
  reasoningEffortMap: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)().min(1), (0, _schemasDel5uzR.Rn)().min(1)).optional(),
  maxTokensField: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("max_completion_tokens"), (0, _schemasDel5uzR.dn)("max_tokens")]).optional(),
  thinkingFormat: (0, _schemasDel5uzR.yt)(_typesModelsLqH0KLkn.n).optional(),
  requiresToolResultName: (0, _schemasDel5uzR.At)().optional(),
  requiresAssistantAfterToolResult: (0, _schemasDel5uzR.At)().optional(),
  requiresThinkingAsText: (0, _schemasDel5uzR.At)().optional(),
  toolSchemaProfile: (0, _schemasDel5uzR.Rn)().optional(),
  unsupportedToolSchemaKeywords: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)().min(1)).optional(),
  nativeWebSearchTool: (0, _schemasDel5uzR.At)().optional(),
  toolCallArgumentsEncoding: (0, _schemasDel5uzR.Rn)().optional(),
  requiresMistralToolIds: (0, _schemasDel5uzR.At)().optional(),
  requiresOpenAiAnthropicToolPayload: (0, _schemasDel5uzR.At)().optional()
}).strict().optional();
const ConfiguredProviderRequestTlsSchema = (0, _schemasDel5uzR.Tn)({
  ca: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t),
  cert: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t),
  key: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t),
  passphrase: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t),
  serverName: (0, _schemasDel5uzR.Rn)().optional(),
  insecureSkipVerify: (0, _schemasDel5uzR.At)().optional()
}).strict().optional();
const ConfiguredProviderRequestAuthSchema = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.Tn)({ mode: (0, _schemasDel5uzR.dn)("provider-default") }).strict(),
(0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.dn)("authorization-bearer"),
  token: SecretInputSchema.register(_zodSchemaSensitive3GVmnUbm.t)
}).strict(),
(0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.dn)("header"),
  headerName: (0, _schemasDel5uzR.Rn)().min(1),
  value: SecretInputSchema.register(_zodSchemaSensitive3GVmnUbm.t),
  prefix: (0, _schemasDel5uzR.Rn)().optional()
}).strict()]
).optional();
const ConfiguredProviderRequestProxySchema = (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.dn)("env-proxy"),
  tls: ConfiguredProviderRequestTlsSchema
}).strict(), (0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.dn)("explicit-proxy"),
  url: (0, _schemasDel5uzR.Rn)().min(1),
  tls: ConfiguredProviderRequestTlsSchema
}).strict()]).optional();
const ConfiguredProviderRequestFields = {
  headers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), SecretInputSchema.register(_zodSchemaSensitive3GVmnUbm.t)).optional(),
  auth: ConfiguredProviderRequestAuthSchema,
  proxy: ConfiguredProviderRequestProxySchema,
  tls: ConfiguredProviderRequestTlsSchema
};
const ConfiguredProviderRequestSchema = (0, _schemasDel5uzR.Tn)(ConfiguredProviderRequestFields).strict().optional();
const ConfiguredModelProviderRequestSchema = (0, _schemasDel5uzR.Tn)({
  ...ConfiguredProviderRequestFields,
  allowPrivateNetwork: (0, _schemasDel5uzR.At)().optional()
}).strict().optional();
const ModelAgentRuntimePolicySchema = (0, _schemasDel5uzR.Tn)({ id: (0, _schemasDel5uzR.Rn)().optional() }).strict().optional();
const ModelDefinitionSchema = (0, _schemasDel5uzR.Tn)({
  id: (0, _schemasDel5uzR.Rn)().min(1),
  name: (0, _schemasDel5uzR.Rn)().min(1),
  api: ModelApiSchema.optional(),
  baseUrl: (0, _schemasDel5uzR.Rn)().min(1).optional(),
  reasoning: (0, _schemasDel5uzR.At)().optional(),
  input: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("text"),
  (0, _schemasDel5uzR.dn)("image"),
  (0, _schemasDel5uzR.dn)("video"),
  (0, _schemasDel5uzR.dn)("audio")]
  )).optional(),
  cost: (0, _schemasDel5uzR.Tn)({
    input: (0, _schemasDel5uzR.wn)().optional(),
    output: (0, _schemasDel5uzR.wn)().optional(),
    cacheRead: (0, _schemasDel5uzR.wn)().optional(),
    cacheWrite: (0, _schemasDel5uzR.wn)().optional(),
    tieredPricing: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Tn)({
      input: (0, _schemasDel5uzR.wn)(),
      output: (0, _schemasDel5uzR.wn)(),
      cacheRead: (0, _schemasDel5uzR.wn)(),
      cacheWrite: (0, _schemasDel5uzR.wn)(),
      range: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.Kn)([(0, _schemasDel5uzR.wn)(), (0, _schemasDel5uzR.wn)()]), (0, _schemasDel5uzR.Kn)([(0, _schemasDel5uzR.wn)()])])
    }).strict()).optional()
  }).strict().optional(),
  contextWindow: (0, _schemasDel5uzR.wn)().positive().optional(),
  contextTokens: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxTokens: (0, _schemasDel5uzR.wn)().positive().optional(),
  params: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Zn)()).optional(),
  agentRuntime: ModelAgentRuntimePolicySchema,
  headers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)()).optional(),
  compat: ModelCompatSchema,
  metadataSource: (0, _schemasDel5uzR.dn)("models-add").optional()
}).strict();
const ModelProviderLocalServiceSchema = (0, _schemasDel5uzR.Tn)({
  command: (0, _schemasDel5uzR.Rn)().min(1),
  args: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  cwd: (0, _schemasDel5uzR.Rn)().min(1).optional(),
  env: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)().register(_zodSchemaSensitive3GVmnUbm.t)).optional(),
  healthUrl: (0, _schemasDel5uzR.Rn)().min(1).optional(),
  readyTimeoutMs: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  idleStopMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional()
}).strict().optional();
const BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS = new Set([
"amazon-bedrock",
"amazon-bedrock-mantle",
"anthropic",
"anthropic-vertex",
"arcee",
"byteplus",
"byteplus-plan",
"cerebras",
"chutes",
"cloudflare-ai-gateway",
"codex",
"comfy",
"copilot-proxy",
"dashscope",
"deepinfra",
"deepseek",
"fal",
"fireworks",
"github-copilot",
"google",
"google-antigravity",
"google-gemini-cli",
"google-vertex",
"groq",
"huggingface",
"kilocode",
"kimi",
"kimi-coding",
"litellm",
"lmstudio",
"microsoft-foundry",
"minimax",
"minimax-portal",
"mistral",
"modelstudio",
"moonshot",
"nvidia",
"ollama",
"openai",
"openai-codex",
"opencode",
"opencode-go",
"openrouter",
"qianfan",
"qwen",
"qwencloud",
"sglang",
"stepfun",
"stepfun-plan",
"synthetic",
"tencent-tokenhub",
"together",
"venice",
"vercel-ai-gateway",
"vllm",
"volcengine",
"volcengine-plan",
"vydra",
"xai",
"xiaomi",
"zai"]
);
function isBuiltInModelProviderOverlayId(providerId) {
  return BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS.has((0, _providerIdZTW9Rdln.r)(providerId));
}
const ModelProviderSchema = (0, _schemasDel5uzR.Tn)({
  baseUrl: (0, _schemasDel5uzR.Rn)().min(1).optional(),
  apiKey: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t),
  auth: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("api-key"),
  (0, _schemasDel5uzR.dn)("aws-sdk"),
  (0, _schemasDel5uzR.dn)("oauth"),
  (0, _schemasDel5uzR.dn)("token")]
  ).optional(),
  api: ModelApiSchema.optional(),
  contextWindow: (0, _schemasDel5uzR.wn)().positive().optional(),
  contextTokens: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxTokens: (0, _schemasDel5uzR.wn)().positive().optional(),
  timeoutSeconds: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  injectNumCtxForOpenAICompat: (0, _schemasDel5uzR.At)().optional(),
  params: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Zn)()).optional(),
  agentRuntime: ModelAgentRuntimePolicySchema,
  localService: ModelProviderLocalServiceSchema,
  headers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), SecretInputSchema.register(_zodSchemaSensitive3GVmnUbm.t)).optional(),
  authHeader: (0, _schemasDel5uzR.At)().optional(),
  request: ConfiguredModelProviderRequestSchema,
  models: (0, _schemasDel5uzR.Et)(ModelDefinitionSchema).optional()
}).strict();
const ModelProvidersSchema = (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), ModelProviderSchema).superRefine((providers, ctx) => {
  for (const [providerId, provider] of Object.entries(providers)) {
    if (isBuiltInModelProviderOverlayId(providerId)) continue;
    if (!provider.baseUrl) ctx.addIssue({
      code: "custom",
      path: [providerId, "baseUrl"],
      message: "custom model providers must declare baseUrl; provider overlays without baseUrl are only supported for bundled providers"
    });
    if (!Array.isArray(provider.models)) ctx.addIssue({
      code: "custom",
      path: [providerId, "models"],
      message: "custom model providers must declare models; provider overlays without models are only supported for bundled providers"
    });
  }
});
const ModelPricingConfigSchema = (0, _schemasDel5uzR.Tn)({ enabled: (0, _schemasDel5uzR.At)().optional() }).strict().optional();
const ModelsConfigSchema = exports.g = (0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("merge"), (0, _schemasDel5uzR.dn)("replace")]).optional(),
  providers: ModelProvidersSchema.optional(),
  pricing: ModelPricingConfigSchema
}).strict().optional();
const VisibleRepliesValueSchema = (0, _schemasDel5uzR.yt)(["automatic", "message_tool"]);
const AmbientGroupInboundSchema = (0, _schemasDel5uzR.yt)(["user_request", "room_event"]);
const VisibleRepliesSchema = exports.F = (0, _schemasDel5uzR.Xn)([VisibleRepliesValueSchema, (0, _schemasDel5uzR.At)()]).overwrite((value) => {
  if (value === true) return "automatic";
  if (value === false) return "message_tool";
  return value;
});
const GroupChatSchema = exports.c = (0, _schemasDel5uzR.Tn)({
  mentionPatterns: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  historyLimit: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  unmentionedInbound: AmbientGroupInboundSchema.optional(),
  visibleReplies: VisibleRepliesSchema.optional()
}).strict().optional();
const DmConfigSchema = exports.a = (0, _schemasDel5uzR.Tn)({ historyLimit: (0, _schemasDel5uzR.wn)().int().min(0).optional() }).strict();
const IdentitySchema = exports.f = (0, _schemasDel5uzR.Tn)({
  name: (0, _schemasDel5uzR.Rn)().optional(),
  theme: (0, _schemasDel5uzR.Rn)().optional(),
  emoji: (0, _schemasDel5uzR.Rn)().optional(),
  avatar: (0, _schemasDel5uzR.Rn)().optional()
}).strict().optional();
const QueueModeSchema = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("steer"),
(0, _schemasDel5uzR.dn)("followup"),
(0, _schemasDel5uzR.dn)("collect"),
(0, _schemasDel5uzR.dn)("interrupt")]
);
const QueueDropSchema = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("old"),
(0, _schemasDel5uzR.dn)("new"),
(0, _schemasDel5uzR.dn)("summarize")]
);
const ReplyToModeSchema = exports.x = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("off"),
(0, _schemasDel5uzR.dn)("first"),
(0, _schemasDel5uzR.dn)("all"),
(0, _schemasDel5uzR.dn)("batched")]
);
const TypingModeSchema = exports.P = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("never"),
(0, _schemasDel5uzR.dn)("instant"),
(0, _schemasDel5uzR.dn)("thinking"),
(0, _schemasDel5uzR.dn)("message")]
);
const GroupPolicySchema = exports.l = (0, _schemasDel5uzR.yt)([
"open",
"disabled",
"allowlist"]
);
const DmPolicySchema = exports.o = (0, _schemasDel5uzR.yt)([
"pairing",
"allowlist",
"open",
"disabled"]
);
const ContextVisibilityModeSchema = exports.i = (0, _schemasDel5uzR.yt)([
"all",
"allowlist",
"allowlist_quote"]
);
const BlockStreamingCoalesceSchema = exports.n = (0, _schemasDel5uzR.Tn)({
  minChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  idleMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional()
}).strict();
const ReplyRuntimeConfigSchemaShape = exports.b = {
  historyLimit: (0, _schemasDel5uzR.wn)().int().min(0).optional(),
  dmHistoryLimit: (0, _schemasDel5uzR.wn)().int().min(0).optional(),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  dms: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), DmConfigSchema.optional()).optional(),
  textChunkLimit: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  chunkMode: (0, _schemasDel5uzR.yt)(["length", "newline"]).optional(),
  blockStreaming: (0, _schemasDel5uzR.At)().optional(),
  blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
  responsePrefix: (0, _schemasDel5uzR.Rn)().optional(),
  mediaMaxMb: (0, _schemasDel5uzR.wn)().positive().optional()
};
const BlockStreamingChunkSchema = exports.t = (0, _schemasDel5uzR.Tn)({
  minChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  breakPreference: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("paragraph"),
  (0, _schemasDel5uzR.dn)("newline"),
  (0, _schemasDel5uzR.dn)("sentence")]
  ).optional()
}).strict();
const MarkdownConfigSchema = exports.h = (0, _schemasDel5uzR.Tn)({ tables: (0, _schemasDel5uzR.yt)([
  "off",
  "bullets",
  "code",
  "block"]
  ).optional() }).strict().optional();
const TtsProviderSchema = exports.N = (0, _schemasDel5uzR.Rn)().min(1);
const TtsModeSchema = exports.M = (0, _schemasDel5uzR.yt)(["final", "all"]);
const TtsAutoSchema = exports.A = (0, _schemasDel5uzR.yt)([
"off",
"always",
"inbound",
"tagged"]
);
const TtsProviderConfigSchema = (0, _schemasDel5uzR.Tn)({ apiKey: SecretInputSchema.optional().register(_zodSchemaSensitive3GVmnUbm.t) }).catchall((0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.Rn)(),
(0, _schemasDel5uzR.wn)(),
(0, _schemasDel5uzR.At)(),
(0, _schemasDel5uzR.St)(),
(0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Zn)()),
(0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Zn)())]
));
const TtsPersonaPromptSchema = (0, _schemasDel5uzR.Tn)({
  profile: (0, _schemasDel5uzR.Rn)().optional(),
  scene: (0, _schemasDel5uzR.Rn)().optional(),
  sampleContext: (0, _schemasDel5uzR.Rn)().optional(),
  style: (0, _schemasDel5uzR.Rn)().optional(),
  accent: (0, _schemasDel5uzR.Rn)().optional(),
  pacing: (0, _schemasDel5uzR.Rn)().optional(),
  constraints: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional()
}).strict();
const TtsPersonaSchema = (0, _schemasDel5uzR.Tn)({
  label: (0, _schemasDel5uzR.Rn)().optional(),
  description: (0, _schemasDel5uzR.Rn)().optional(),
  provider: TtsProviderSchema.optional(),
  fallbackPolicy: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("preserve-persona"),
  (0, _schemasDel5uzR.dn)("provider-defaults"),
  (0, _schemasDel5uzR.dn)("fail")]
  ).optional(),
  prompt: TtsPersonaPromptSchema.optional(),
  providers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), TtsProviderConfigSchema).optional()
}).strict();
const TtsConfigSchema = exports.j = (0, _schemasDel5uzR.Tn)({
  auto: TtsAutoSchema.optional(),
  enabled: (0, _schemasDel5uzR.At)().optional(),
  mode: TtsModeSchema.optional(),
  provider: TtsProviderSchema.optional(),
  persona: (0, _schemasDel5uzR.Rn)().optional(),
  personas: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), TtsPersonaSchema).optional(),
  summaryModel: (0, _schemasDel5uzR.Rn)().optional(),
  modelOverrides: (0, _schemasDel5uzR.Tn)({
    enabled: (0, _schemasDel5uzR.At)().optional(),
    allowText: (0, _schemasDel5uzR.At)().optional(),
    allowProvider: (0, _schemasDel5uzR.At)().optional(),
    allowVoice: (0, _schemasDel5uzR.At)().optional(),
    allowModelId: (0, _schemasDel5uzR.At)().optional(),
    allowVoiceSettings: (0, _schemasDel5uzR.At)().optional(),
    allowNormalization: (0, _schemasDel5uzR.At)().optional(),
    allowSeed: (0, _schemasDel5uzR.At)().optional()
  }).strict().optional(),
  providers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), TtsProviderConfigSchema).optional(),
  prefsPath: (0, _schemasDel5uzR.Rn)().optional(),
  maxTextLength: (0, _schemasDel5uzR.wn)().int().min(1).optional(),
  timeoutMs: (0, _schemasDel5uzR.wn)().int().min(1e3).max(12e4).optional()
}).strict().optional();
const HumanDelaySchema = exports.d = (0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("off"),
  (0, _schemasDel5uzR.dn)("natural"),
  (0, _schemasDel5uzR.dn)("custom")]
  ).optional(),
  minMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional(),
  maxMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional()
}).strict();
const CliBackendWatchdogModeSchema = (0, _schemasDel5uzR.Tn)({
  noOutputTimeoutMs: (0, _schemasDel5uzR.wn)().int().min(1e3).optional(),
  noOutputTimeoutRatio: (0, _schemasDel5uzR.wn)().min(.05).max(.95).optional(),
  minMs: (0, _schemasDel5uzR.wn)().int().min(1e3).optional(),
  maxMs: (0, _schemasDel5uzR.wn)().int().min(1e3).optional()
}).strict().optional();
const CliBackendOutputLimitsSchema = (0, _schemasDel5uzR.Tn)({
  maxTurnRawChars: (0, _schemasDel5uzR.wn)().int().min(1024).max(64 * 1024 * 1024).optional(),
  maxTurnLines: (0, _schemasDel5uzR.wn)().int().min(100).max(1e5).optional()
}).strict().optional();
const CliBackendSchema = exports.r = (0, _schemasDel5uzR.Tn)({
  command: (0, _schemasDel5uzR.Rn)(),
  args: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  output: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("json"),
  (0, _schemasDel5uzR.dn)("text"),
  (0, _schemasDel5uzR.dn)("jsonl")]
  ).optional(),
  resumeOutput: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("json"),
  (0, _schemasDel5uzR.dn)("text"),
  (0, _schemasDel5uzR.dn)("jsonl")]
  ).optional(),
  jsonlDialect: (0, _schemasDel5uzR.dn)("claude-stream-json").optional(),
  liveSession: (0, _schemasDel5uzR.dn)("claude-stdio").optional(),
  input: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("arg"), (0, _schemasDel5uzR.dn)("stdin")]).optional(),
  maxPromptArgChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  env: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)()).optional(),
  clearEnv: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  modelArg: (0, _schemasDel5uzR.Rn)().optional(),
  modelAliases: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)()).optional(),
  sessionArg: (0, _schemasDel5uzR.Rn)().optional(),
  sessionArgs: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  resumeArgs: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  sessionMode: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("always"),
  (0, _schemasDel5uzR.dn)("existing"),
  (0, _schemasDel5uzR.dn)("none")]
  ).optional(),
  sessionIdFields: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  systemPromptArg: (0, _schemasDel5uzR.Rn)().optional(),
  systemPromptFileArg: (0, _schemasDel5uzR.Rn)().optional(),
  systemPromptFileConfigArg: (0, _schemasDel5uzR.Rn)().optional(),
  systemPromptFileConfigKey: (0, _schemasDel5uzR.Rn)().optional(),
  systemPromptMode: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("append"), (0, _schemasDel5uzR.dn)("replace")]).optional(),
  systemPromptWhen: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("first"),
  (0, _schemasDel5uzR.dn)("always"),
  (0, _schemasDel5uzR.dn)("never")]
  ).optional(),
  imageArg: (0, _schemasDel5uzR.Rn)().optional(),
  imageMode: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("repeat"), (0, _schemasDel5uzR.dn)("list")]).optional(),
  imagePathScope: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("temp"), (0, _schemasDel5uzR.dn)("workspace")]).optional(),
  serialize: (0, _schemasDel5uzR.At)().optional(),
  reseedFromRawTranscriptWhenUncompacted: (0, _schemasDel5uzR.At)().optional(),
  reliability: (0, _schemasDel5uzR.Tn)({
    outputLimits: CliBackendOutputLimitsSchema,
    watchdog: (0, _schemasDel5uzR.Tn)({
      fresh: CliBackendWatchdogModeSchema,
      resume: CliBackendWatchdogModeSchema
    }).strict().optional()
  }).strict().optional()
}).strict();
const normalizeAllowFrom = (values) => (0, _stringNormalizationDiPHgdft.s)(values);
const requireOpenAllowFrom = (params) => {
  if (params.policy !== "open") return;
  if (normalizeAllowFrom(params.allowFrom).includes("*")) return;
  params.ctx.addIssue({
    code: _compatBCpUj7Jq.n.custom,
    path: params.path,
    message: params.message
  });
};
/**
* Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
* Without this, all DMs are silently dropped because the allowlist is empty
* and no senders can match.
*/exports.R = requireOpenAllowFrom;
const requireAllowlistAllowFrom = (params) => {
  if (params.policy !== "allowlist") return;
  if (normalizeAllowFrom(params.allowFrom).length > 0) return;
  params.ctx.addIssue({
    code: _compatBCpUj7Jq.n.custom,
    path: params.path,
    message: params.message
  });
};exports.L = requireAllowlistAllowFrom;
const MSTeamsReplyStyleSchema = exports.m = (0, _schemasDel5uzR.yt)(["thread", "top-level"]);
const RetryConfigSchema = exports.S = (0, _schemasDel5uzR.Tn)({
  attempts: (0, _schemasDel5uzR.wn)().int().min(1).optional(),
  minDelayMs: (0, _schemasDel5uzR.wn)().int().min(0).optional(),
  maxDelayMs: (0, _schemasDel5uzR.wn)().int().min(0).optional(),
  jitter: (0, _schemasDel5uzR.wn)().min(0).max(1).optional()
}).strict().optional();
const QueueModeBySurfaceSchema = (0, _schemasDel5uzR.Tn)({
  whatsapp: QueueModeSchema.optional(),
  telegram: QueueModeSchema.optional(),
  discord: QueueModeSchema.optional(),
  irc: QueueModeSchema.optional(),
  googlechat: QueueModeSchema.optional(),
  slack: QueueModeSchema.optional(),
  mattermost: QueueModeSchema.optional(),
  signal: QueueModeSchema.optional(),
  imessage: QueueModeSchema.optional(),
  msteams: QueueModeSchema.optional(),
  webchat: QueueModeSchema.optional(),
  matrix: QueueModeSchema.optional()
}).strict().optional();
const DebounceMsBySurfaceSchema = (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.wn)().int().nonnegative()).optional();
const QueueSchema = exports.y = (0, _schemasDel5uzR.Tn)({
  mode: QueueModeSchema.optional(),
  byChannel: QueueModeBySurfaceSchema,
  debounceMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional(),
  debounceMsByChannel: DebounceMsBySurfaceSchema,
  cap: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  drop: QueueDropSchema.optional()
}).strict().optional();
const InboundDebounceSchema = exports.p = (0, _schemasDel5uzR.Tn)({
  debounceMs: (0, _schemasDel5uzR.wn)().int().nonnegative().optional(),
  byChannel: DebounceMsBySurfaceSchema
}).strict().optional();
const TranscribeAudioSchema = exports.k = (0, _schemasDel5uzR.Tn)({
  command: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).superRefine((value, ctx) => {
    const executable = value[0];
    if (!(0, _execSafety1iu4aOkR.t)(executable)) ctx.addIssue({
      code: _compatBCpUj7Jq.n.custom,
      path: [0],
      message: "expected safe executable name or path"
    });
  }),
  timeoutSeconds: (0, _schemasDel5uzR.wn)().int().positive().optional()
}).strict().optional();
const HexColorSchema = exports.u = (0, _schemasDel5uzR.Rn)().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
const ExecutableTokenSchema = exports.s = (0, _schemasDel5uzR.Rn)().refine(_execSafety1iu4aOkR.t, "expected safe executable name or path");
const MediaUnderstandingScopeSchema = createAllowDenyChannelRulesSchema();
const MediaUnderstandingCapabilitiesSchema = (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.dn)("image"),
(0, _schemasDel5uzR.dn)("audio"),
(0, _schemasDel5uzR.dn)("video")]
)).optional();
const MediaUnderstandingAttachmentsSchema = (0, _schemasDel5uzR.Tn)({
  mode: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("first"), (0, _schemasDel5uzR.dn)("all")]).optional(),
  maxAttachments: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  prefer: (0, _schemasDel5uzR.Xn)([
  (0, _schemasDel5uzR.dn)("first"),
  (0, _schemasDel5uzR.dn)("last"),
  (0, _schemasDel5uzR.dn)("path"),
  (0, _schemasDel5uzR.dn)("url")]
  ).optional()
}).strict().optional();
const DeepgramAudioSchema = (0, _schemasDel5uzR.Tn)({
  detectLanguage: (0, _schemasDel5uzR.At)().optional(),
  punctuate: (0, _schemasDel5uzR.At)().optional(),
  smartFormat: (0, _schemasDel5uzR.At)().optional()
}).strict().optional();
const ProviderOptionValueSchema = (0, _schemasDel5uzR.Xn)([
(0, _schemasDel5uzR.Rn)(),
(0, _schemasDel5uzR.wn)(),
(0, _schemasDel5uzR.At)()]
);
const ProviderOptionsSchema = (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), ProviderOptionValueSchema)).optional();
const MediaUnderstandingRuntimeFields = {
  prompt: (0, _schemasDel5uzR.Rn)().optional(),
  timeoutSeconds: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  language: (0, _schemasDel5uzR.Rn)().optional(),
  providerOptions: ProviderOptionsSchema,
  deepgram: DeepgramAudioSchema,
  baseUrl: (0, _schemasDel5uzR.Rn)().optional(),
  headers: (0, _schemasDel5uzR.Nn)((0, _schemasDel5uzR.Rn)(), (0, _schemasDel5uzR.Rn)()).optional(),
  request: ConfiguredProviderRequestSchema
};
const MediaUnderstandingModelSchema = (0, _schemasDel5uzR.Tn)({
  provider: (0, _schemasDel5uzR.Rn)().optional(),
  model: (0, _schemasDel5uzR.Rn)().optional(),
  capabilities: MediaUnderstandingCapabilitiesSchema,
  type: (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.dn)("provider"), (0, _schemasDel5uzR.dn)("cli")]).optional(),
  command: (0, _schemasDel5uzR.Rn)().optional(),
  args: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  maxChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxBytes: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  ...MediaUnderstandingRuntimeFields,
  profile: (0, _schemasDel5uzR.Rn)().optional(),
  preferredProfile: (0, _schemasDel5uzR.Rn)().optional()
}).strict().optional();
const ToolsMediaUnderstandingSchema = (0, _schemasDel5uzR.Tn)({
  enabled: (0, _schemasDel5uzR.At)().optional(),
  scope: MediaUnderstandingScopeSchema,
  maxBytes: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  maxChars: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  ...MediaUnderstandingRuntimeFields,
  attachments: MediaUnderstandingAttachmentsSchema,
  models: (0, _schemasDel5uzR.Et)(MediaUnderstandingModelSchema).optional(),
  echoTranscript: (0, _schemasDel5uzR.At)().optional(),
  echoFormat: (0, _schemasDel5uzR.Rn)().optional()
}).strict().optional();
const ToolsMediaSchema = exports.O = (0, _schemasDel5uzR.Tn)({
  models: (0, _schemasDel5uzR.Et)(MediaUnderstandingModelSchema).optional(),
  concurrency: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  asyncCompletion: (0, _schemasDel5uzR.Tn)({ directSend: (0, _schemasDel5uzR.At)().optional() }).strict().optional(),
  image: ToolsMediaUnderstandingSchema.optional(),
  audio: ToolsMediaUnderstandingSchema.optional(),
  video: ToolsMediaUnderstandingSchema.optional()
}).strict().optional();
const LinkModelSchema = (0, _schemasDel5uzR.Tn)({
  type: (0, _schemasDel5uzR.dn)("cli").optional(),
  command: (0, _schemasDel5uzR.Rn)().min(1),
  args: (0, _schemasDel5uzR.Et)((0, _schemasDel5uzR.Rn)()).optional(),
  timeoutSeconds: (0, _schemasDel5uzR.wn)().int().positive().optional()
}).strict();
const ToolsLinksSchema = exports.D = (0, _schemasDel5uzR.Tn)({
  enabled: (0, _schemasDel5uzR.At)().optional(),
  scope: MediaUnderstandingScopeSchema,
  maxLinks: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  timeoutSeconds: (0, _schemasDel5uzR.wn)().int().positive().optional(),
  models: (0, _schemasDel5uzR.Et)(LinkModelSchema).optional()
}).strict().optional();
const NativeCommandsSettingSchema = exports._ = (0, _schemasDel5uzR.Xn)([(0, _schemasDel5uzR.At)(), (0, _schemasDel5uzR.dn)("auto")]);
const ProviderCommandsSchema = exports.v = (0, _schemasDel5uzR.Tn)({
  native: NativeCommandsSettingSchema.optional(),
  nativeSkills: NativeCommandsSettingSchema.optional()
}).strict().optional();
//#endregion /* v9-21deed90bf2c1693 */
