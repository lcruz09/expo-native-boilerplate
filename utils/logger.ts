import * as FileSystem from "expo-file-system/legacy";
import { consoleTransport, logger as rnLogger } from "react-native-logs";
import { getSystemInfo } from "./systemInfo";

/**
 * Logger Utility
 *
 * Provides timestamped logging functions for debugging with file persistence.
 * Uses react-native-logs for structured logging to both console and JSON files.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log entry structure for file transport
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  args?: unknown[];
}

/**
 * Message structure from react-native-logs
 */
interface LogMessage {
  msg: string;
  rawMsg: unknown;
  level: { severity: number; text: string };
  extension?: string | null;
  options?: unknown;
}

/**
 * Current log file path (set during session initialization)
 */
let currentLogFilePath: string | null = null;

/**
 * Log buffer for debug overlay (keeps last 50 entries in memory)
 */
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 50;

/**
 * Session active flag
 */
let sessionActive = false;

/**
 * Generate log filename with timestamp.
 *
 * Format: wattr-log-YYYY-MM-DD-HHmmss.json
 */
const generateLogFileName = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `wattr-log-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`;
};

/**
 * Get log directory path
 */
const getLogDirectory = (): string => {
  return `${FileSystem.documentDirectory}logs/`;
};

/**
 * Ensure log directory exists
 */
const ensureLogDirectory = async (): Promise<void> => {
  const dirPath = getLogDirectory();
  const dirInfo = await FileSystem.getInfoAsync(dirPath);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
  }
};

/**
 * Custom file transport that writes to JSON file
 */
const customFileTransport = async (msg: LogMessage) => {
  if (!currentLogFilePath || !sessionActive) {
    return;
  }

  try {
    const logEntry: LogEntry = {
      level: (msg.level.text as LogLevel) || "info",
      message: msg.msg,
      timestamp: new Date().toISOString(),
      context: msg.extension || undefined,
      args: Array.isArray(msg.rawMsg) ? msg.rawMsg.slice(1) : undefined,
    };

    // Add to buffer for debug overlay
    logBuffer.push(logEntry);
    if (logBuffer.length > MAX_BUFFER_SIZE) {
      logBuffer.shift();
    }

    // Read existing file or create new array
    let logs: LogEntry[] = [];
    const fileInfo = await FileSystem.getInfoAsync(currentLogFilePath);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(currentLogFilePath);
      try {
        logs = JSON.parse(content);
      } catch {
        logs = [];
      }
    }

    // Append new log
    logs.push(logEntry);

    // Write back to file
    await FileSystem.writeAsStringAsync(
      currentLogFilePath,
      JSON.stringify(logs, null, 2),
    );
  } catch (error) {
    // Silently fail to avoid infinite loops
    console.error("Failed to write log to file:", error);
  }
};

/**
 * Configure react-native-logs instance
 */
const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transport: [consoleTransport, customFileTransport],
  transportOptions: {
    colors: {
      debug: "blueBright" as const,
      info: "greenBright" as const,
      warn: "yellowBright" as const,
      error: "redBright" as const,
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

/**
 * Global logger instance
 */
const globalLogger = rnLogger.createLogger(config);

/**
 * Start a new logging session.
 *
 * Creates a new log file and logs system information.
 * Call this when the app starts.
 *
 * @returns Path to the log file
 *
 * @example
 * ```tsx
 * const logPath = await startSession();
 * ```
 */
export const startSession = async (): Promise<string> => {
  try {
    // Ensure directory exists
    await ensureLogDirectory();

    // Generate filename and path
    const filename = generateLogFileName();
    currentLogFilePath = `${getLogDirectory()}${filename}`;

    // Mark session as active
    sessionActive = true;

    // Initialize file with empty array
    await FileSystem.writeAsStringAsync(currentLogFilePath, "[]");

    // Log session start
    globalLogger.info("📱 Session started");

    // Log system information
    const systemInfo = getSystemInfo();
    globalLogger.info("🔧 System Information", systemInfo);

    return currentLogFilePath;
  } catch (error) {
    console.error("Failed to start logging session:", error);
    sessionActive = false;
    return "";
  }
};

/**
 * End the current logging session.
 *
 * Call this when the app is closing.
 *
 * @example
 * ```tsx
 * await endSession();
 * ```
 */
export const endSession = async (): Promise<void> => {
  if (!sessionActive) {
    return;
  }

  try {
    globalLogger.info("📱 Session ended");
    sessionActive = false;
    currentLogFilePath = null;
  } catch (error) {
    console.error("Failed to end logging session:", error);
  }
};

/**
 * Get the current log file path.
 *
 * @returns Current log file path or null if no session active
 */
export const getLogFilePath = (): string | null => {
  return currentLogFilePath;
};

/**
 * Get recent log entries from buffer (for debug overlay).
 *
 * @param count - Number of entries to return (default: 10)
 * @returns Array of recent log entries
 */
export const getRecentLogs = (count: number = 10): LogEntry[] => {
  return logBuffer.slice(-count);
};

/**
 * Logger class with timestamped methods and context support.
 *
 * Wraps react-native-logs with consistent API.
 */
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private extend(level: LogLevel, message: string, ...args: unknown[]) {
    const contextMsg = this.context ? `[${this.context}] ${message}` : message;
    globalLogger[level](contextMsg, ...args);
  }

  log(message: string, ...args: unknown[]) {
    this.extend("info", message, ...args);
  }

  info(message: string, ...args: unknown[]) {
    this.extend("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.extend("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.extend("error", message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.extend("debug", message, ...args);
  }

  /**
   * Create a timer that logs elapsed time when stopped
   */
  startTimer(label: string): () => void {
    const startTime = Date.now();
    this.log(`⏱️ Timer started: ${label}`);

    return () => {
      const elapsed = Date.now() - startTime;
      this.log(`⏱️ Timer ended: ${label} (${elapsed}ms)`);
    };
  }
}

/**
 * Create a logger instance with optional context.
 *
 * @example
 * ```tsx
 * const logger = createLogger('WorkoutTimer');
 * logger.log('Timer tick:', duration);
 * ```
 */
export const createLogger = (context?: string): Logger => {
  return new Logger(context);
};

/**
 * Default logger instance
 */
export const logger = new Logger();
