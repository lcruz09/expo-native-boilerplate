import { SQLiteStorage } from "expo-sqlite/kv-store";
import { StateStorage } from "zustand/middleware";

/**
 * KV Storage Service
 *
 * Central service for managing Key-Value storage instances using SQLite.
 * Replaces MMKV with expo-sqlite/kv-store.
 */

/**
 * Storage instance IDs for different app features.
 */
export const STORAGE_IDS = {
  THEME: "wattr-theme-storage",
  LOCALE: "wattr-locale-storage",
  USER_PROFILE: "wattr-user-profile",
  WORKOUTS: "wattr-workouts",
  SETTINGS: "wattr-settings",
  USER_PREFERENCES: "wattr-user-preferences",
  APP_DATA: "wattr-app-data",
  AUTH: "wattr-auth",
} as const;

/**
 * Create or get a cached SQLite storage instance.
 *
 * @param id - Unique storage identifier (used as database name)
 * @returns SQLiteStorage instance
 */
const storageInstances = new Map<string, SQLiteStorage>();

export const getStorage = (id: string): SQLiteStorage => {
  if (!storageInstances.has(id)) {
    const storage = new SQLiteStorage(id);
    storageInstances.set(id, storage);
  }
  return storageInstances.get(id)!;
};

/**
 * Create a Zustand StateStorage adapter for SQLite KV Store.
 *
 * Uses synchronous methods to be compatible with standard Zustand persistence.
 *
 * @param id - Unique storage identifier (from STORAGE_IDS)
 * @returns StateStorage adapter for Zustand
 */
export const createZustandStorage = (id: string): StateStorage => {
  const storage = getStorage(id);

  return {
    setItem: (name, value) => {
      return storage.setItemSync(name, value);
    },
    getItem: (name) => {
      const value = storage.getItemSync(name);
      return value ?? null;
    },
    removeItem: (name) => {
      return storage.removeItemSync(name);
    },
  };
};

/**
 * Pre-configured storage instances for common use cases.
 */
export const storage = {
  theme: getStorage(STORAGE_IDS.THEME),
  locale: getStorage(STORAGE_IDS.LOCALE),
  userProfile: getStorage(STORAGE_IDS.USER_PROFILE),
  workouts: getStorage(STORAGE_IDS.WORKOUTS),
  settings: getStorage(STORAGE_IDS.SETTINGS),
  userPreferences: getStorage(STORAGE_IDS.USER_PREFERENCES),
  appData: getStorage(STORAGE_IDS.APP_DATA),
  auth: getStorage(STORAGE_IDS.AUTH),
};
