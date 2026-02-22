/**
 * Database Client (Web)
 *
 * expo-sqlite / Drizzle with SQLite is not available on web.
 * This stub ensures the module resolves safely when bundling for web.
 * Metro will resolve this file instead of client.ts on web.
 */

import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type * as schema from './schema';

export const db: ExpoSQLiteDatabase<typeof schema> | null = null;

export const initDatabase = () => {
  if (__DEV__) {
    console.warn(
      '[database/client] SQLite is not available on web. Use server-side storage or a web-compatible alternative.'
    );
  }
};
