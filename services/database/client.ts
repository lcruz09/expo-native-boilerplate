import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const DB_NAME = 'wattr.db';

// Open the database synchronously
const expoDb = openDatabaseSync(DB_NAME);

// Initialize Drizzle
export const db = drizzle(expoDb, { schema });

// Helper to ensure tables exist (simple migration for embedded context)
export const initDatabase = () => {
  try {
    expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        status TEXT NOT NULL,
        device_name TEXT,
        fitness_device_name TEXT,
        route_id TEXT,
        route_name TEXT,
        virtual_ride_sensitivity REAL,
        route_json TEXT,
        route_elevation_profile_json TEXT,
        route_coordinates_json TEXT
      );

      CREATE TABLE IF NOT EXISTS workout_samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type TEXT NOT NULL,
        heart_rate INTEGER,
        speed REAL,
        cadence INTEGER,
        power INTEGER,
        distance REAL,
        latitude REAL,
        longitude REAL,
        elevation REAL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};
