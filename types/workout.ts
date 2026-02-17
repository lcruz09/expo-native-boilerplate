/**
 * Workout Types
 *
 * Type definitions for workout sessions, activities, and heart rate samples.
 */

import { Route } from "./route";

/**
 * Supported workout types with activity-specific calorie multipliers
 */
export enum WorkoutType {
  STRENGTH = "strength",
  HIIT = "hiit",
  INDOOR_CYCLING = "indoor_cycling",
  INDOOR_RUNNING = "indoor_running",
  WALK_HIKE = "walk_hike",
  FITNESS_ACTIVITY = "fitness_activity", // For imported workouts with unsupported sport types (not user-selectable)
}

/**
 * Workout session status
 */
export enum WorkoutStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

/**
 * Heart rate sample captured during workout
 */
export interface HRSample {
  /**
   * Unix timestamp in milliseconds
   */
  timestamp: number;

  /**
   * Heart rate in beats per minute
   */
  bpm: number;
}

/**
 * Cycling metrics sample captured during workout
 */
export interface CyclingSample {
  /**
   * Unix timestamp in milliseconds
   */
  timestamp: number;

  /**
   * Speed in km/h
   */
  speed: number;

  /**
   * Cadence in RPM
   */
  cadence: number;

  /**
   * Power in watts
   */
  power: number;

  /**
   * Distance in meters
   */
  distance: number;
}

/**
 * Complete workout session with metrics and history
 */
export interface WorkoutSession {
  /**
   * Unique identifier for the workout
   */
  id: string;

  /**
   * Type of workout activity
   */
  type: WorkoutType;

  /**
   * Custom title for the workout (optional, user-editable)
   */
  title?: string;

  /**
   * Custom description or notes for the workout (optional, user-editable)
   */
  description?: string;

  /**
   * Current status of the workout
   */
  status: WorkoutStatus;

  /**
   * Start time (Unix timestamp in milliseconds)
   */
  startTime: number;

  /**
   * End time (Unix timestamp in milliseconds)
   * Null if workout is in progress
   */
  endTime: number | null;

  /**
   * Duration in seconds
   */
  duration: number;

  /**
   * Average heart rate in BPM
   */
  avgHR: number;

  /**
   * Maximum heart rate in BPM
   */
  maxHR: number;

  /**
   * Minimum heart rate in BPM (non-zero values only)
   */
  minHR: number;

  /**
   * Total calories burned during workout
   */
  calories: number;

  /**
   * Array of heart rate samples collected during workout
   * Limited to reasonable size (e.g., one sample every 5 seconds)
   */
  hrSamples: HRSample[];

  /**
   * Connected device name (if any)
   */
  deviceName?: string;

  /**
   * Array of cycling metrics samples (for indoor cycling workouts)
   * Limited to reasonable size
   */
  cyclingSamples?: CyclingSample[];

  /**
   * Average speed in km/h (for indoor cycling)
   */
  avgSpeed?: number;

  /**
   * Maximum speed in km/h (for indoor cycling)
   */
  maxSpeed?: number;

  /**
   * Average cadence in RPM (for indoor cycling)
   */
  avgCadence?: number;

  /**
   * Maximum cadence in RPM (for indoor cycling)
   */
  maxCadence?: number;

  /**
   * Average power in watts (for indoor cycling)
   */
  avgPower?: number;

  /**
   * Maximum power in watts (for indoor cycling)
   */
  maxPower?: number;

  /**
   * Total distance traveled in meters (for indoor cycling)
   */
  totalDistance?: number;

  /**
   * Simulated elevation in meters (for indoor cycling)
   */
  elevation?: number;

  /**
   * Connected fitness machine name (if any)
   */
  fitnessDeviceName?: string;

  /**
   * Virtual ride route ID (if virtual ride)
   * Will be null for new routes until saved to database
   */
  routeId?: string | null;

  /**
   * Virtual ride route name (if virtual ride)
   */
  routeName?: string;

  /**
   * Distance completed along the route in meters (if virtual ride)
   */
  routeDistanceCompleted?: number;

  /**
   * Simplified elevation profile for visualization (if virtual ride)
   */
  routeElevationProfile?: { distance: number; elevation: number }[];

  /**
   * GPS coordinates along the route for map display (if virtual ride)
   */
  routeCoordinates?: { lat: number; lon: number }[];

  /**
   * Virtual ride sensitivity multiplier (0.5x, 1x, 2x, etc.)
   */
  virtualRideSensitivity?: number;

  /**
   * Full route data for unsaved routes (if virtual ride with new route)
   * This is used to save the route to database when workout completes
   * Will be undefined for workouts using existing routes from database
   */
  route?: Route;

  /**
   * Total number of HR samples collected (for incremental stats)
   */
  hrSampleCount?: number;

  /**
   * Total number of cycling samples collected (for incremental stats)
   */
  cyclingSampleCount?: number;
}
