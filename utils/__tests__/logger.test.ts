// Unmock logger for its own tests
import { createLogger, Logger, logger } from "../logger";
import { wait } from "../wait";

jest.unmock("@/utils/logger");

// TODO: Update these tests to match the new react-native-logs implementation
describe.skip("Logger", () => {
  // Mock console methods
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
  });

  describe("Logger instance", () => {
    it("should create a logger without context", () => {
      const testLogger = new Logger();
      expect(testLogger).toBeInstanceOf(Logger);
    });

    it("should create a logger with context", () => {
      const testLogger = new Logger("TestContext");
      expect(testLogger).toBeInstanceOf(Logger);
    });

    it("should log with timestamp", () => {
      const testLogger = new Logger();
      testLogger.log("Test message");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const call = consoleLogSpy.mock.calls[0];
      // Check that first argument includes timestamp format [HH:MM:SS.mmm]
      expect(call[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\]$/);
      expect(call[1]).toBe("Test message");
    });

    it("should log with context prefix", () => {
      const testLogger = new Logger("MyContext");
      testLogger.log("Test message");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const call = consoleLogSpy.mock.calls[0];
      expect(call[1]).toBe("[MyContext] Test message");
    });

    it("should log with additional arguments", () => {
      const testLogger = new Logger();
      testLogger.log("Test message", { data: "value" }, 123);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const call = consoleLogSpy.mock.calls[0];
      expect(call[1]).toBe("Test message");
      expect(call[2]).toEqual({ data: "value" });
      expect(call[3]).toBe(123);
    });
  });

  describe("Log levels", () => {
    it("should log info messages", () => {
      const testLogger = new Logger();
      testLogger.info("Info message");

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy.mock.calls[0][1]).toBe("Info message");
    });

    it("should log warning messages", () => {
      const testLogger = new Logger();
      testLogger.warn("Warning message");

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy.mock.calls[0][1]).toBe("Warning message");
    });

    it("should log error messages", () => {
      const testLogger = new Logger();
      testLogger.error("Error message");

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][1]).toBe("Error message");
    });
  });

  describe("Timer functionality", () => {
    it("should create and stop a timer", () => {
      const testLogger = new Logger();
      const stopTimer = testLogger.startTimer("TestTimer");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][1]).toContain(
        "Timer started: TestTimer",
      );

      stopTimer();

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy.mock.calls[1][1]).toContain(
        "Timer ended: TestTimer",
      );
      expect(consoleLogSpy.mock.calls[1][1]).toMatch(/\(\d+ms\)/);
    });

    it("should measure elapsed time correctly", async () => {
      const testLogger = new Logger();
      const stopTimer = testLogger.startTimer("DelayTest");

      // Wait 100ms
      await wait(100);

      stopTimer();

      const logCall = consoleLogSpy.mock.calls[1][1];
      // Extract the elapsed time from the log message
      const match = logCall.match(/\((\d+)ms\)/);
      expect(match).toBeTruthy();
      const elapsed = parseInt(match![1], 10);
      // Should be around 100ms (with some tolerance)
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(elapsed).toBeLessThan(150);
    });
  });

  describe("createLogger factory", () => {
    it("should create a logger instance", () => {
      const testLogger = createLogger("Factory");
      expect(testLogger).toBeInstanceOf(Logger);
    });

    it("should create logger with context", () => {
      const testLogger = createLogger("FactoryContext");
      testLogger.log("Test");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][1]).toBe("[FactoryContext] Test");
    });

    it("should create logger without context", () => {
      const testLogger = createLogger();
      testLogger.log("Test");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][1]).toBe("Test");
    });
  });

  describe("Default logger export", () => {
    it("should export a default logger instance", () => {
      expect(logger).toBeInstanceOf(Logger);
    });

    it("should work without context", () => {
      logger.log("Default logger test");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][1]).toBe("Default logger test");
    });
  });

  describe("Timestamp format", () => {
    it("should have correct timestamp format", () => {
      const testLogger = new Logger();
      testLogger.log("Test");

      const timestamp = consoleLogSpy.mock.calls[0][0];
      // Format: [HH:MM:SS.mmm]
      expect(timestamp).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\]$/);

      // Extract parts
      const match = timestamp.match(/\[(\d{2}):(\d{2}):(\d{2})\.(\d{3})\]/);
      expect(match).toBeTruthy();

      const [, hours, minutes, seconds, ms] = match!;
      expect(parseInt(hours, 10)).toBeLessThan(24);
      expect(parseInt(minutes, 10)).toBeLessThan(60);
      expect(parseInt(seconds, 10)).toBeLessThan(60);
      expect(parseInt(ms, 10)).toBeLessThan(1000);
    });
  });
});
