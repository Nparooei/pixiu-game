import { LambdaLog } from "lambda-log";
import { makeLogger } from "./logger";

jest.mock("lambda-log");

describe("makeLogger", () => {
  const mockLogger = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    options: {
      meta: {
        logLevel: undefined,
      },
    },
  };

  beforeEach(() => {
    (LambdaLog as unknown as jest.Mock).mockImplementation(() => mockLogger);

    jest.clearAllMocks();
  });

  it("should create a logger with the correct log level", () => {
    makeLogger();

    expect(LambdaLog).toHaveBeenCalled();

    expect(mockLogger.options.meta.logLevel).toBe("debug");
  });

  it("should return a logger with correctly bound methods", () => {
    const logger = makeLogger();

    const msg = "test message";
    const context = { key: "value" };

    logger.info(msg, context);
    logger.debug(msg, context);
    logger.warn(msg, context);
    logger.error(msg, context);

    expect(mockLogger.info).toHaveBeenCalledWith(msg, context);
    expect(mockLogger.debug).toHaveBeenCalledWith(msg, context);
    expect(mockLogger.warn).toHaveBeenCalledWith(msg, context);
    expect(mockLogger.error).toHaveBeenCalledWith(msg, context);
  });
});
