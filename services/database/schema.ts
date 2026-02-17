import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  startTime: integer("start_time").notNull(),
  status: text("status").notNull(),
  deviceName: text("device_name"),
  fitnessDeviceName: text("fitness_device_name"),
  // Virtual ride fields
  routeId: text("route_id"),
  routeName: text("route_name"),
  virtualRideSensitivity: real("virtual_ride_sensitivity"),
  // JSON blobs for complex objects that we don't need to query individually
  // e.g. route object, elevation profile
  routeJson: text("route_json"),
  routeElevationProfileJson: text("route_elevation_profile_json"),
  routeCoordinatesJson: text("route_coordinates_json"),
});

export const workoutSamples = sqliteTable("workout_samples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  timestamp: integer("timestamp").notNull(),
  type: text("type").notNull(), // 'hr' | 'cycling'

  // Heart Rate Data
  heartRate: integer("heart_rate"),

  // Cycling Data
  speed: real("speed"),
  cadence: integer("cadence"),
  power: integer("power"),
  distance: real("distance"),

  // Location/Elevation (if needed later, good to have slots)
  latitude: real("latitude"),
  longitude: real("longitude"),
  elevation: real("elevation"),
});
