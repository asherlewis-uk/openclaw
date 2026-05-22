"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.n = resolveDefaultAgentWorkspaceDir;exports.t = void 0;var _stringCoerceLndEvhRk = require("./string-coerce-LndEvhRk.js");
var _homeDirIZwpu = require("./home-dir-iZwpu-40.js");
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeOs = _interopRequireDefault(require("node:os"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}
//#region src/agents/workspace-default.ts
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = _nodeOs.default.homedir) {
  const home = (0, _homeDirIZwpu.o)(env, homedir);
  const profile = env.OPENCLAW_PROFILE?.trim();
  if (profile && (0, _stringCoerceLndEvhRk.s)(profile) !== "default") return _nodePath.default.join(home, ".openclaw", `workspace-${profile}`);
  return _nodePath.default.join(home, ".openclaw", "workspace");
}
const DEFAULT_AGENT_WORKSPACE_DIR = exports.t = resolveDefaultAgentWorkspaceDir();
//#endregion /* v9-ca2e284174f7e124 */
