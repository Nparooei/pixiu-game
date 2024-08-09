import { applicationConfig } from "../../infra/config";
import { LambdaLog } from "lambda-log";

type LogLevel = "info" | "error" | "warn" | "debug";

interface Logger {
  info(msg: string, context?: unknown): void;
  debug(msg: string, context?: unknown): void;
  warn(msg: string, context?: unknown): void;
  error(msg: string | Error, context?: unknown): void;
}

function makeLogger(): Logger {
  const logger = new LambdaLog();
  logger.options.meta.logLevel = applicationConfig().logLevel;

  return {
    info: logger.info.bind(logger),
    debug: logger.debug.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
  };
}

export { makeLogger, Logger, LogLevel };
