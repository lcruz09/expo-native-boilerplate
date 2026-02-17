import {
  CyclingSample,
  HRSample,
  WorkoutSession,
  WorkoutType,
} from "@/types/workout";

/**
 * Database row structure for workouts table.
 */
export interface WorkoutRow {
  id: string;
  user_id: string;
  type: string;
  title: string | null;
  description: string | null;
  status: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  avg_hr: number | null;
  max_hr: number | null;
  min_hr: number | null;
  calories: number | null;
  device_name: string | null;
  avg_speed: number | null;
  max_speed: number | null;
  avg_cadence: number | null;
  max_cadence: number | null;
  avg_power: number | null;
  max_power: number | null;
  total_distance: number | null;
  elevation: number | null;
  fitness_device_name: string | null;
  route_id: string | null;
  route_name: string | null;
  route_distance_completed: number | null;
  virtual_ride_sensitivity: number | null;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

/**
 * Database row structure for workout_samples table (JSONB format).
 */
export interface WorkoutSamplesRow {
  id: string;
  workout_id: string;
  sample_type: "heart_rate" | "cycling";
  data: number[][];
  sample_count: number;
  created_at: string;
}

type RouteWaypoint = {
  lat: number;
  lon: number;
  elevation: number;
  distanceFromStart: number;
};

/**
 * Convert WorkoutSession to database row format.
 */
export const workoutToRow = (
  userId: string,
  workout: WorkoutSession,
): Partial<WorkoutRow> => {
  return {
    id: workout.id,
    user_id: userId,
    type: workout.type,
    title: workout.title || null,
    description: workout.description || null,
    status: workout.status,
    start_time: new Date(workout.startTime).toISOString(),
    end_time: workout.endTime ? new Date(workout.endTime).toISOString() : null,
    duration: workout.duration,
    avg_hr: workout.avgHR || null,
    max_hr: workout.maxHR || null,
    min_hr: workout.minHR || null,
    calories: workout.calories || null,
    device_name: workout.deviceName || null,
    avg_speed: workout.avgSpeed || null,
    max_speed: workout.maxSpeed || null,
    avg_cadence: workout.avgCadence || null,
    max_cadence: workout.maxCadence || null,
    avg_power: workout.avgPower || null,
    max_power: workout.maxPower || null,
    total_distance: workout.totalDistance || null,
    elevation: workout.elevation || null,
    fitness_device_name: workout.fitnessDeviceName || null,
    route_id: workout.routeId || null,
    route_name: workout.routeName || null,
    route_distance_completed: workout.routeDistanceCompleted || null,
    virtual_ride_sensitivity: workout.virtualRideSensitivity || null,
  };
};

/**
 * Convert database row to WorkoutSession.
 */
export const rowToWorkout = (
  row: WorkoutRow,
  routeWaypoints?: RouteWaypoint[],
): WorkoutSession => {
  let routeElevationProfile:
    | { distance: number; elevation: number }[]
    | undefined;
  let routeCoordinates: { lat: number; lon: number }[] | undefined;

  if (routeWaypoints?.length) {
    routeElevationProfile = routeWaypoints.map((wp) => ({
      distance: wp.distanceFromStart,
      elevation: wp.elevation,
    }));
    routeCoordinates = routeWaypoints.map((wp) => ({
      lat: wp.lat,
      lon: wp.lon,
    }));
  }

  return {
    id: row.id,
    type: row.type as WorkoutType,
    title: row.title || undefined,
    description: row.description || undefined,
    status: row.status as WorkoutSession["status"],
    startTime: new Date(row.start_time).getTime(),
    endTime: row.end_time ? new Date(row.end_time).getTime() : null,
    duration: row.duration,
    avgHR: row.avg_hr || 0,
    maxHR: row.max_hr || 0,
    minHR: row.min_hr || 0,
    calories: row.calories || 0,
    hrSamples: [],
    deviceName: row.device_name || undefined,
    cyclingSamples: [],
    avgSpeed: row.avg_speed !== null ? Number(row.avg_speed) : undefined,
    maxSpeed: row.max_speed !== null ? Number(row.max_speed) : undefined,
    avgCadence: row.avg_cadence || undefined,
    maxCadence: row.max_cadence || undefined,
    avgPower: row.avg_power || undefined,
    maxPower: row.max_power || undefined,
    totalDistance:
      row.total_distance !== null ? Number(row.total_distance) : undefined,
    elevation: row.elevation !== null ? Number(row.elevation) : undefined,
    fitnessDeviceName: row.fitness_device_name || undefined,
    routeId: row.route_id || undefined,
    routeName: row.route_name || undefined,
    routeDistanceCompleted:
      row.route_distance_completed !== null
        ? Number(row.route_distance_completed)
        : undefined,
    routeElevationProfile,
    routeCoordinates,
    virtualRideSensitivity:
      row.virtual_ride_sensitivity !== null
        ? Number(row.virtual_ride_sensitivity)
        : undefined,
  };
};

/**
 * Convert HR samples to compact JSONB format.
 * Format: [[timestamp_ms, bpm], [timestamp_ms, bpm], ...]
 */
export const hrSamplesToRow = (
  workoutId: string,
  samples: HRSample[],
): Omit<WorkoutSamplesRow, "id" | "created_at"> => {
  return {
    workout_id: workoutId,
    sample_type: "heart_rate",
    data: samples.map((sample) => [sample.timestamp, sample.bpm]),
    sample_count: samples.length,
  };
};

/**
 * Convert compact JSONB format to HR samples.
 */
export const rowToHRSamples = (row: WorkoutSamplesRow): HRSample[] => {
  return row.data.map((sample) => ({
    timestamp: sample[0],
    bpm: sample[1],
  }));
};

/**
 * Convert cycling samples to compact JSONB format.
 * Format: [[timestamp_ms, speed, cadence, power, distance], ...]
 */
export const cyclingSamplesToRow = (
  workoutId: string,
  samples: CyclingSample[],
): Omit<WorkoutSamplesRow, "id" | "created_at"> => {
  return {
    workout_id: workoutId,
    sample_type: "cycling",
    data: samples.map((sample) => [
      sample.timestamp,
      sample.speed,
      sample.cadence,
      sample.power,
      sample.distance,
    ]),
    sample_count: samples.length,
  };
};

/**
 * Convert compact JSONB format to cycling samples.
 */
export const rowToCyclingSamples = (
  row: WorkoutSamplesRow,
): CyclingSample[] => {
  return row.data.map((sample) => ({
    timestamp: sample[0],
    speed: sample[1],
    cadence: sample[2],
    power: sample[3],
    distance: sample[4],
  }));
};
