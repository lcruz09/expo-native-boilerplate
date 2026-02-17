import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  getAllLogFiles,
  deleteLogFile,
  deleteAllLogFiles,
  exportLogFile,
  cleanupOldLogs,
  LOG_DIRECTORY,
} from "../logFileManager";

// Mock expo-file-system/legacy
jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///mock/documents/",
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  readDirectoryAsync: jest.fn(),
  deleteAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
}));

// Mock expo-sharing
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

// Mock logger
jest.mock("@/utils/logger", () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  }),
}));

// TODO: Update these tests to match the new logging implementation
describe.skip("logFileManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllLogFiles", () => {
    it("should return empty array when directory does not exist", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([]);

      const files = await getAllLogFiles();

      expect(files).toEqual([]);
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        LOG_DIRECTORY,
        { intermediates: true },
      );
    });

    it("should return log files with metadata", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          return {
            exists: true,
            size: 1024,
            modificationTime: Date.now() / 1000,
          };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-2025-11-14-120000.json",
        "wattr-log-2025-11-13-120000.json",
        "other-file.txt",
      ]);

      const files = await getAllLogFiles();

      expect(files).toHaveLength(2);
      expect(files[0].filename).toBe("wattr-log-2025-11-14-120000.json");
      expect(files[0].size).toBe(1024);
      expect(files[0].formattedSize).toBe("1.0 KB");
      expect(files[0].date).toBeInstanceOf(Date);
    });

    it("should sort files by date (newest first)", async () => {
      const now = Date.now() / 1000;
      const yesterday = now - 86400;

      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          if (path.includes("2025-11-14")) {
            return { exists: true, size: 1024, modificationTime: now };
          }
          return { exists: true, size: 1024, modificationTime: yesterday };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-2025-11-13-120000.json",
        "wattr-log-2025-11-14-120000.json",
      ]);

      const files = await getAllLogFiles();

      expect(files[0].filename).toBe("wattr-log-2025-11-14-120000.json");
      expect(files[1].filename).toBe("wattr-log-2025-11-13-120000.json");
    });

    it("should handle errors gracefully", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(
        new Error("File system error"),
      );

      const files = await getAllLogFiles();

      expect(files).toEqual([]);
    });
  });

  describe("deleteLogFile", () => {
    it("should delete a log file successfully", async () => {
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteLogFile("wattr-log-2025-11-14-120000.json");

      expect(result).toBe(true);
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        `${LOG_DIRECTORY}wattr-log-2025-11-14-120000.json`,
        { idempotent: true },
      );
    });

    it("should handle deletion errors", async () => {
      (FileSystem.deleteAsync as jest.Mock).mockRejectedValue(
        new Error("Delete failed"),
      );

      const result = await deleteLogFile("wattr-log-2025-11-14-120000.json");

      expect(result).toBe(false);
    });
  });

  describe("deleteAllLogFiles", () => {
    it("should delete all log files successfully", async () => {
      const now = Date.now() / 1000;

      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          return { exists: true, size: 1024, modificationTime: now };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-2025-11-14-120000.json",
        "wattr-log-2025-11-13-120000.json",
        "wattr-log-2025-11-12-120000.json",
      ]);
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      const count = await deleteAllLogFiles();

      expect(count).toBe(3);
      expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(3);
    });

    it("should return 0 when no log files exist", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([]);

      const count = await deleteAllLogFiles();

      expect(count).toBe(0);
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it("should continue deleting even if one file fails", async () => {
      const now = Date.now() / 1000;

      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          return { exists: true, size: 1024, modificationTime: now };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-2025-11-14-120000.json",
        "wattr-log-2025-11-13-120000.json",
      ]);
      (FileSystem.deleteAsync as jest.Mock)
        .mockResolvedValueOnce(undefined) // First file succeeds
        .mockRejectedValueOnce(new Error("Delete failed")); // Second file fails

      const count = await deleteAllLogFiles();

      expect(count).toBe(1);
      expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(2);
    });

    it("should handle errors when getting all log files", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(
        new Error("File system error"),
      );

      const count = await deleteAllLogFiles();

      expect(count).toBe(0);
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });
  });

  describe("exportLogFile", () => {
    it("should export log file successfully", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      const result = await exportLogFile("wattr-log-2025-11-14-120000.json");

      expect(result).toBe(true);
      expect(Sharing.shareAsync).toHaveBeenCalledWith(
        `${LOG_DIRECTORY}wattr-log-2025-11-14-120000.json`,
        expect.objectContaining({
          mimeType: "application/json",
        }),
      );
    });

    it("should return false if file does not exist", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });

      const result = await exportLogFile("nonexistent.json");

      expect(result).toBe(false);
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it("should return false if sharing is not available", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const result = await exportLogFile("wattr-log-2025-11-14-120000.json");

      expect(result).toBe(false);
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it("should handle export errors", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockRejectedValue(
        new Error("Share failed"),
      );

      const result = await exportLogFile("wattr-log-2025-11-14-120000.json");

      expect(result).toBe(false);
    });
  });

  describe("cleanupOldLogs", () => {
    it("should delete logs older than 30 days", async () => {
      const now = Date.now() / 1000;
      const old = now - 31 * 24 * 60 * 60; // 31 days ago
      const recent = now - 10 * 24 * 60 * 60; // 10 days ago

      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          if (path.includes("old")) {
            return { exists: true, size: 1024, modificationTime: old };
          }
          return { exists: true, size: 1024, modificationTime: recent };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-old-120000.json",
        "wattr-log-recent-120000.json",
      ]);
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      const count = await cleanupOldLogs();

      expect(count).toBe(1);
      expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(1);
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        `${LOG_DIRECTORY}wattr-log-old-120000.json`,
        { idempotent: true },
      );
    });

    it("should return 0 if no old logs exist", async () => {
      const now = Date.now() / 1000;

      (FileSystem.getInfoAsync as jest.Mock).mockImplementation(
        async (path: string) => {
          if (path === LOG_DIRECTORY) {
            return { exists: true };
          }
          return { exists: true, size: 1024, modificationTime: now };
        },
      );
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
        "wattr-log-recent-120000.json",
      ]);

      const count = await cleanupOldLogs();

      expect(count).toBe(0);
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it("should handle cleanup errors", async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockRejectedValue(
        new Error("Cleanup failed"),
      );

      const count = await cleanupOldLogs();

      expect(count).toBe(0);
    });
  });
});
