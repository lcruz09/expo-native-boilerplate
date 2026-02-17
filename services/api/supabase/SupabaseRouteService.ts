import { Route } from "@/types/route";
import { createLogger } from "@/utils/logger";
import { IRouteService } from "../interfaces/IRouteService";
import { supabase } from "./client";

const logger = createLogger("SupabaseRouteService");

/**
 * Database row structure for routes table
 */
interface RouteRow {
  id: string;
  user_id: string;
  name: string;
  source: string;
  source_identifier: string | null;
  total_distance: number;
  elevation_gain: number;
  elevation_loss: number;
  min_elevation: number;
  max_elevation: number;
  waypoints: unknown;
  created_at: string;
  updated_at: string;
}

/**
 * Convert Route to database row format
 * Note: We don't include the route.id because Supabase generates UUIDs server-side
 */
const routeToRow = (userId: string, route: Route): Partial<RouteRow> => {
  return {
    // id is omitted - Supabase will generate it via DEFAULT uuid_generate_v4()
    user_id: userId,
    name: route.name,
    source: route.source,
    source_identifier: route.sourceIdentifier || null,
    total_distance: route.totalDistance,
    elevation_gain: route.elevationGain,
    elevation_loss: route.elevationLoss,
    min_elevation: route.minElevation,
    max_elevation: route.maxElevation,
    waypoints: route.waypoints,
  };
};

/**
 * Convert database row to Route
 */
const rowToRoute = (row: RouteRow): Route => {
  return {
    id: row.id,
    name: row.name,
    source: row.source as "file" | "url",
    sourceIdentifier: row.source_identifier || undefined,
    totalDistance: Number(row.total_distance),
    elevationGain: Number(row.elevation_gain),
    elevationLoss: Number(row.elevation_loss),
    minElevation: Number(row.min_elevation),
    maxElevation: Number(row.max_elevation),
    waypoints: row.waypoints as Route["waypoints"],
  };
};

/**
 * Supabase Route Service
 *
 * Implementation of IRouteService for Supabase database.
 * Handles all route CRUD operations using Supabase as the backend.
 *
 * @example
 * ```typescript
 * const routeService = new SupabaseRouteService();
 * const route = await routeService.createRoute(userId, routeData);
 * ```
 */
export class SupabaseRouteService implements IRouteService {
  /**
   * Create a new route in Supabase
   */
  async createRoute(userId: string, route: Route): Promise<Route> {
    logger.info("Creating route:", route.name);

    const row = routeToRow(userId, route);

    const { data, error } = await supabase
      .from("routes")
      .insert(row)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create route: ${error.message}`);
    }

    logger.info("Route created successfully:", route.name);
    return rowToRoute(data as RouteRow);
  }

  /**
   * Get a route by ID from Supabase
   */
  async getRoute(routeId: string): Promise<Route | null> {
    logger.debug("Fetching route:", routeId);

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("id", routeId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        logger.debug("No route found:", routeId);
        return null;
      }
      throw new Error(`Failed to fetch route: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    logger.debug("Route fetched successfully:", routeId);
    return rowToRoute(data as RouteRow);
  }

  /**
   * Get all routes for a user from Supabase
   */
  async getRoutes(userId: string): Promise<Route[]> {
    logger.debug("Fetching routes for user:", userId);

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch routes: ${error.message}`);
    }

    logger.info(`Fetched ${data.length} routes for user:`, userId);
    return data.map((row) => rowToRoute(row as RouteRow));
  }

  /**
   * Update a route in Supabase
   */
  async updateRoute(routeId: string, updates: Partial<Route>): Promise<Route> {
    logger.debug("Updating route:", routeId);

    // Convert updates to database format
    const dbUpdates: Partial<RouteRow> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.sourceIdentifier !== undefined)
      dbUpdates.source_identifier = updates.sourceIdentifier;
    if (updates.totalDistance !== undefined)
      dbUpdates.total_distance = updates.totalDistance;
    if (updates.elevationGain !== undefined)
      dbUpdates.elevation_gain = updates.elevationGain;
    if (updates.elevationLoss !== undefined)
      dbUpdates.elevation_loss = updates.elevationLoss;
    if (updates.minElevation !== undefined)
      dbUpdates.min_elevation = updates.minElevation;
    if (updates.maxElevation !== undefined)
      dbUpdates.max_elevation = updates.maxElevation;
    if (updates.waypoints !== undefined)
      dbUpdates.waypoints = updates.waypoints;

    const { data, error } = await supabase
      .from("routes")
      .update(dbUpdates)
      .eq("id", routeId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update route: ${error.message}`);
    }

    logger.info("Route updated successfully:", routeId);
    return rowToRoute(data as RouteRow);
  }

  /**
   * Delete a route from Supabase
   */
  async deleteRoute(routeId: string): Promise<void> {
    logger.info("Deleting route:", routeId);

    const { error } = await supabase.from("routes").delete().eq("id", routeId);

    if (error) {
      throw new Error(`Failed to delete route: ${error.message}`);
    }

    logger.info("Route deleted successfully:", routeId);
  }

  /**
   * Check if a route exists in Supabase
   */
  async routeExists(routeId: string): Promise<boolean> {
    logger.debug("Checking if route exists:", routeId);

    const { data, error } = await supabase
      .from("routes")
      .select("id")
      .eq("id", routeId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to check route existence: ${error.message}`);
    }

    return !!data;
  }
}
