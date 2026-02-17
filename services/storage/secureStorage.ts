import { createLogger } from "@/utils/logger";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const logger = createLogger("SecureStorage");

/**
 * Maximum size for a single SecureStore value in bytes.
 * iOS/Android have a limit of ~2048 bytes per key.
 * We use 2000 to leave some buffer.
 */
const CHUNK_SIZE = 2000;

/**
 * Suffix used for chunk keys when storing large values
 */
const CHUNK_KEY_SUFFIX = "_chunk_";

/**
 * Marker prefix for chunked values
 */
const CHUNKED_MARKER = "__chunked__";

/**
 * Secure Storage Interface
 *
 * Compatible with Supabase Auth's storage adapter interface.
 */
export interface SecureStorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Get a value from secure storage
 *
 * Automatically handles chunked values that were stored across multiple keys.
 *
 * @param key - The key to retrieve
 * @returns The stored value, or null if not found
 */
const getItem = async (key: string): Promise<string | null> => {
  try {
    // Web fallback to sessionStorage
    if (Platform.OS === "web") {
      return sessionStorage.getItem(key);
    }

    // Try to get the value directly first
    const directValue = await SecureStore.getItemAsync(key);
    if (directValue && !directValue.startsWith(CHUNKED_MARKER)) {
      return directValue;
    }

    // If value is chunked, reconstruct it
    if (directValue?.startsWith(CHUNKED_MARKER)) {
      const chunkCount = parseInt(directValue.replace(CHUNKED_MARKER, ""), 10);
      const chunks: string[] = [];

      for (let i = 0; i < chunkCount; i++) {
        const chunk = await SecureStore.getItemAsync(
          `${key}${CHUNK_KEY_SUFFIX}${i}`,
        );
        if (chunk) {
          chunks.push(chunk);
        }
      }

      return chunks.join("");
    }

    return null;
  } catch (error) {
    logger.error("Error getting item from secure store:", error);
    return null;
  }
};

/**
 * Store a value in secure storage
 *
 * Automatically chunks large values (> 2000 bytes) across multiple keys
 * to work around platform limitations.
 *
 * @param key - The key to store under
 * @param value - The value to store
 */
const setItem = async (key: string, value: string): Promise<void> => {
  try {
    logger.info("Storing value in secure store:", key, value);
    // Web fallback to sessionStorage
    if (Platform.OS === "web") {
      sessionStorage.setItem(key, value);
      return;
    }

    // If value is small enough, store directly
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    // Split into chunks
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.substring(i, i + CHUNK_SIZE));
    }

    // Store chunk count marker
    await SecureStore.setItemAsync(key, `${CHUNKED_MARKER}${chunks.length}`);

    // Store each chunk
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(
        `${key}${CHUNK_KEY_SUFFIX}${i}`,
        chunks[i],
      );
    }

    logger.info(
      `Stored large value (${value.length} bytes) in ${chunks.length} chunks`,
    );
  } catch (error) {
    logger.error("Error setting item in secure store:", error);
    throw error;
  }
};

/**
 * Remove a value from secure storage
 *
 * Automatically cleans up all chunks if the value was chunked.
 *
 * @param key - The key to remove
 */
const removeItem = async (key: string): Promise<void> => {
  try {
    // Web fallback to sessionStorage
    if (Platform.OS === "web") {
      sessionStorage.removeItem(key);
      return;
    }

    // Get the main value to check if it's chunked
    const value = await SecureStore.getItemAsync(key);

    if (value?.startsWith(CHUNKED_MARKER)) {
      const chunkCount = parseInt(value.replace(CHUNKED_MARKER, ""), 10);

      // Remove all chunks
      for (let i = 0; i < chunkCount; i++) {
        await SecureStore.deleteItemAsync(`${key}${CHUNK_KEY_SUFFIX}${i}`);
      }
    }

    // Remove the main key
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    logger.error("Error removing item from secure store:", error);
    throw error;
  }
};

/**
 * Secure Storage Service
 *
 * Provides secure storage for sensitive data using expo-secure-store.
 * Implements automatic chunking for values larger than 2048 bytes.
 * Falls back to sessionStorage on web platform.
 * Can be used with any storage consumer that requires getItem/setItem/removeItem interface.
 *
 * @example
 * ```typescript
 * import { secureStorage } from '@/services/storage/secureStorage';
 *
 * // Store a value
 * await secureStorage.setItem('auth_token', 'large_token_value');
 *
 * // Retrieve a value
 * const token = await secureStorage.getItem('auth_token');
 *
 * // Remove a value
 * await secureStorage.removeItem('auth_token');
 * ```
 */
export const secureStorage: SecureStorageAdapter = {
  getItem,
  setItem,
  removeItem,
};
