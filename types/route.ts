/**
 * Route Types
 *
 * Type definitions for GPS routes, waypoints, and virtual ride state.
 */

/**
 * GPS waypoint with elevation and distance information
 */
export interface Waypoint {
  /**
   * Latitude in decimal degrees
   */
  lat: number;

  /**
   * Longitude in decimal degrees
   */
  lon: number;

  /**
   * Elevation in meters
   */
  elevation: number;

  /**
   * Cumulative distance from start in meters
   */
  distanceFromStart: number;
}

/**
 * GPS route parsed from GPX file
 */
export interface Route {
  /**
   * Unique identifier for the route
   */
  id: string;

  /**
   * Route name/title
   */
  name: string;

  /**
   * Array of waypoints along the route
   */
  waypoints: Waypoint[];

  /**
   * Total route distance in meters
   */
  totalDistance: number;

  /**
   * Total elevation gain in meters
   */
  elevationGain: number;

  /**
   * Total elevation loss in meters
   */
  elevationLoss: number;

  /**
   * Source of the route
   */
  source: "file" | "url";

  /**
   * Original filename or URL
   */
  sourceIdentifier?: string;

  /**
   * Minimum elevation in meters
   */
  minElevation: number;

  /**
   * Maximum elevation in meters
   */
  maxElevation: number;
}

/**
 * Virtual ride state tracking during workout
 */
export interface VirtualRideState {
  /**
   * ID of the route being ridden
   */
  routeId: string;

  /**
   * Current waypoint index in the route
   */
  currentWaypointIndex: number;

  /**
   * Distance completed along the route in meters
   */
  distanceCompleted: number;

  /**
   * Current slope/grade percentage (-10 to +20 typical range)
   */
  currentSlope: number;

  /**
   * Whether the route has been completed
   */
  routeCompleted: boolean;

  /**
   * Sensitivity multiplier for slope (0.5x, 1x, 2x, etc.)
   */
  sensitivityMultiplier: number;

  /**
   * Total elevation gained so far in meters
   */
  elevationGained: number;

  /**
   * Total elevation descended so far in meters
   */
  elevationDescended: number;

  /**
   * Last update timestamp
   */
  lastUpdateTime: number;
}

/**
 * Simplified elevation profile point for visualization
 */
export interface ElevationProfilePoint {
  /**
   * Distance from start in meters
   */
  distance: number;

  /**
   * Elevation in meters
   */
  elevation: number;
}

/**
 * Coordinate point for map display
 */
export interface CoordinatePoint {
  /**
   * Latitude in decimal degrees
   */
  lat: number;

  /**
   * Longitude in decimal degrees
   */
  lon: number;
}
