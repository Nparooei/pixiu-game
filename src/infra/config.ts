import { LogLevel } from "../shared/logging/logger";

interface ApplicationConfig {
  region: string;
  suffix: string;
  logLevel: LogLevel;
}
function applicationConfig(): ApplicationConfig {
  return {
    region: "us-east-1",
    suffix: "pixiu-telegram",
    logLevel: "debug",
  };
}

export { applicationConfig };
