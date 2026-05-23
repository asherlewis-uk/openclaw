"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = void 0;exports.r = isModelThinkingFormat;exports.t = void 0; //#region src/config/types.models.ts
const MODEL_APIS = exports.t = [
"openai-completions",
"openai-responses",
"openai-codex-responses",
"anthropic-messages",
"google-generative-ai",
"github-copilot",
"bedrock-converse-stream",
"ollama",
"azure-openai-responses"];

const MODEL_THINKING_FORMATS = exports.n = [
"openai",
"openrouter",
"deepseek",
"together",
"qwen",
"qwen-chat-template",
"zai"];

function isModelThinkingFormat(value) {
  return MODEL_THINKING_FORMATS.includes(value);
}
//#endregion /* v9-fa27cd61f6e21322 */
