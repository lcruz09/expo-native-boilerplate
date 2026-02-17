import * as SecureStore from "expo-secure-store";

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Platform to always be iOS for testing
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

// Unmock and get the real secureStorage implementation
jest.unmock("@/services/storage/secureStorage");

describe("secureStorage", () => {
  // Use jest.requireActual to get the real implementation
  const { secureStorage } = jest.requireActual("../secureStorage");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getItem", () => {
    it("should return direct value for non-chunked data", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "test-value",
      );

      const result = await secureStorage.getItem("test-key");

      expect(result).toBe("test-value");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("test-key");
    });

    it("should reconstruct chunked values", async () => {
      const chunk1 = "a".repeat(2000);
      const chunk2 = "b".repeat(2000);

      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce("__chunked__2") // Main key with chunk count
        .mockResolvedValueOnce(chunk1) // First chunk
        .mockResolvedValueOnce(chunk2); // Second chunk

      const result = await secureStorage.getItem("test-key");

      expect(result).toBe(chunk1 + chunk2);
      expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(3);
      expect(SecureStore.getItemAsync).toHaveBeenNthCalledWith(1, "test-key");
      expect(SecureStore.getItemAsync).toHaveBeenNthCalledWith(
        2,
        "test-key_chunk_0",
      );
      expect(SecureStore.getItemAsync).toHaveBeenNthCalledWith(
        3,
        "test-key_chunk_1",
      );
    });

    it("should return null if key not found", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const result = await secureStorage.getItem("missing-key");

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(
        new Error("SecureStore error"),
      );

      const result = await secureStorage.getItem("error-key");

      expect(result).toBeNull();
    });
  });

  describe("setItem", () => {
    it("should store small values directly", async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

      await secureStorage.setItem("test-key", "small-value");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "test-key",
        "small-value",
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });

    it("should chunk large values (>2000 bytes)", async () => {
      const largeValue = "x".repeat(5000);
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.setItem("test-key", largeValue);

      // Should store chunk count marker + 3 chunks (5000 / 2000 = 2.5 -> 3 chunks)
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(4);

      // Check marker was stored
      expect(SecureStore.setItemAsync).toHaveBeenNthCalledWith(
        1,
        "test-key",
        "__chunked__3",
      );

      // Check all chunks were stored with correct content
      expect(SecureStore.setItemAsync).toHaveBeenNthCalledWith(
        2,
        "test-key_chunk_0",
        "x".repeat(2000),
      );
      expect(SecureStore.setItemAsync).toHaveBeenNthCalledWith(
        3,
        "test-key_chunk_1",
        "x".repeat(2000),
      );
      expect(SecureStore.setItemAsync).toHaveBeenNthCalledWith(
        4,
        "test-key_chunk_2",
        "x".repeat(1000),
      );
    });

    it("should throw error if storage fails", async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Storage full"),
      );

      await expect(secureStorage.setItem("test-key", "value")).rejects.toThrow(
        "Storage full",
      );
    });
  });

  describe("removeItem", () => {
    it("should remove direct value", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "test-value",
      );
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await secureStorage.removeItem("test-key");

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("test-key");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("test-key");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
    });

    it("should remove all chunks for chunked values", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "__chunked__3",
      );
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.removeItem("test-key");

      // Should delete 3 chunks + main key = 4 calls
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(4);
      expect(SecureStore.deleteItemAsync).toHaveBeenNthCalledWith(
        1,
        "test-key_chunk_0",
      );
      expect(SecureStore.deleteItemAsync).toHaveBeenNthCalledWith(
        2,
        "test-key_chunk_1",
      );
      expect(SecureStore.deleteItemAsync).toHaveBeenNthCalledWith(
        3,
        "test-key_chunk_2",
      );
      expect(SecureStore.deleteItemAsync).toHaveBeenNthCalledWith(
        4,
        "test-key",
      );
    });

    it("should throw error if deletion fails", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("value");
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
        new Error("Delete failed"),
      );

      await expect(secureStorage.removeItem("test-key")).rejects.toThrow(
        "Delete failed",
      );
    });
  });
});
