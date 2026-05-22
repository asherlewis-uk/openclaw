import { t as getMatrixRuntime } from "./runtime-Dog86njy.js";
import { format } from "node:util";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
//#region extensions/matrix/src/matrix/sdk/logger.ts
function noop() {}
let forceConsoleLogging = false;
function setMatrixConsoleLogging(enabled) {
	forceConsoleLogging = enabled;
}
function resolveRuntimeLogger(module) {
	if (forceConsoleLogging) return null;
	try {
		return getMatrixRuntime().logging.getChildLogger({ module: `matrix:${module}` });
	} catch {
		return null;
	}
}
function formatMessage(module, messageOrObject) {
	if (messageOrObject.length === 0) return `[${module}]`;
	return redactSensitiveText(`[${module}] ${format(...messageOrObject)}`);
}
var ConsoleLogger = class {
	emit(level, module, ...messageOrObject) {
		const runtimeLogger = resolveRuntimeLogger(module);
		const message = formatMessage(module, messageOrObject);
		if (runtimeLogger) {
			if (level === "debug") {
				runtimeLogger.debug?.(message);
				return;
			}
			runtimeLogger[level](message);
			return;
		}
		if (level === "debug") {
			console.debug(message);
			return;
		}
		console[level](message);
	}
	trace(module, ...messageOrObject) {
		this.emit("debug", module, ...messageOrObject);
	}
	debug(module, ...messageOrObject) {
		this.emit("debug", module, ...messageOrObject);
	}
	info(module, ...messageOrObject) {
		this.emit("info", module, ...messageOrObject);
	}
	warn(module, ...messageOrObject) {
		this.emit("warn", module, ...messageOrObject);
	}
	error(module, ...messageOrObject) {
		this.emit("error", module, ...messageOrObject);
	}
};
let activeLogger = new ConsoleLogger();
const LogService = {
	setLogger(logger) {
		activeLogger = logger;
	},
	trace(module, ...messageOrObject) {
		activeLogger.trace(module, ...messageOrObject);
	},
	debug(module, ...messageOrObject) {
		activeLogger.debug(module, ...messageOrObject);
	},
	info(module, ...messageOrObject) {
		activeLogger.info(module, ...messageOrObject);
	},
	warn(module, ...messageOrObject) {
		activeLogger.warn(module, ...messageOrObject);
	},
	error(module, ...messageOrObject) {
		activeLogger.error(module, ...messageOrObject);
	}
};
//#endregion
//#region extensions/matrix/src/matrix/startup-abort.ts
function createMatrixStartupAbortError() {
	const error = /* @__PURE__ */ new Error("Matrix startup aborted");
	error.name = "AbortError";
	return error;
}
function throwIfMatrixStartupAborted(abortSignal) {
	if (abortSignal?.aborted === true) throw createMatrixStartupAbortError();
}
function isMatrixStartupAbortError(error) {
	return error instanceof Error && error.name === "AbortError";
}
async function awaitMatrixStartupWithAbort(promise, abortSignal) {
	if (!abortSignal) return await promise;
	if (abortSignal.aborted) throw createMatrixStartupAbortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			abortSignal.removeEventListener("abort", onAbort);
			reject(createMatrixStartupAbortError());
		};
		abortSignal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			abortSignal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			abortSignal.removeEventListener("abort", onAbort);
			reject(error);
		});
	});
}
//#endregion
export { ConsoleLogger as a, setMatrixConsoleLogging as c, throwIfMatrixStartupAborted as i, createMatrixStartupAbortError as n, LogService as o, isMatrixStartupAbortError as r, noop as s, awaitMatrixStartupWithAbort as t };
