import { Route } from "@/types/route";

/**
 * Route Service Interface
 *
 * Vendor-agnostic interface for route management operations.
 * Implementations handle storage and retrieval of GPS routes.
 */
export interface IRouteService {
  /**
   * Create a new route
   */
  createRoute(userId: string, route: Route): Promise<Route>;

  /**
   * Get a route by ID
   */
  getRoute(routeId: string): Promise<Route | null>;

  /**
   * Get all routes for a user
   */
  getRoutes(userId: string): Promise<Route[]>;

  /**
   * Update a route
   */
  updateRoute(routeId: string, updates: Partial<Route>): Promise<Route>;

  /**
   * Delete a route
   */
  deleteRoute(routeId: string): Promise<void>;

  /**
   * Check if a route exists
   */
  routeExists(routeId: string): Promise<boolean>;
}
