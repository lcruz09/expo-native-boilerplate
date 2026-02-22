import { StateStorage } from 'zustand/middleware';

/**
 * KV Storage Service (Web)
 *
 * Web-compatible implementation using localStorage.
 * expo-sqlite/kv-store uses Atomics.wait which is blocked on the browser
 * main thread, so we use localStorage for web instead.
 *
 * Metro will resolve this file instead of kvStorage.ts when bundling for web.
 */

export const STORAGE_IDS = {
  THEME: 'app-theme-storage',
  LOCALE: 'app-locale-storage',
  SETTINGS: 'app-settings',
  AUTH: 'app-auth',
} as const;

/**
 * localStorage-backed KV store with namespace prefix per storage ID.
 */
class WebStorage {
  private prefix: string;

  constructor(name: string) {
    this.prefix = `${name}:`;
  }

  getItemSync(key: string): string | null {
    return localStorage.getItem(this.prefix + key);
  }

  setItemSync(key: string, value: string): void {
    localStorage.setItem(this.prefix + key, value);
  }

  removeItemSync(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  async getItemAsync(key: string): Promise<string | null> {
    return this.getItemSync(key);
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    this.setItemSync(key, value);
  }

  async removeItemAsync(key: string): Promise<void> {
    this.removeItemSync(key);
  }
}

const storageInstances = new Map<string, WebStorage>();

export const getStorage = (id: string): WebStorage => {
  if (!storageInstances.has(id)) {
    storageInstances.set(id, new WebStorage(id));
  }
  return storageInstances.get(id)!;
};

/**
 * Create a Zustand StateStorage adapter backed by localStorage.
 */
export const createZustandStorage = (id: string): StateStorage => {
  const storage = getStorage(id);

  return {
    setItem: (name, value) => {
      return storage.setItemSync(name, value);
    },
    getItem: (name) => {
      return storage.getItemSync(name);
    },
    removeItem: (name) => {
      return storage.removeItemSync(name);
    },
  };
};

export const storage = {
  theme: getStorage(STORAGE_IDS.THEME),
  locale: getStorage(STORAGE_IDS.LOCALE),
  settings: getStorage(STORAGE_IDS.SETTINGS),
  auth: getStorage(STORAGE_IDS.AUTH),
};
