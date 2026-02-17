import { getRouteService } from "@/services/api/factory";
import { useAuthStore } from "@/stores/auth/authStore";
import { Route } from "@/types/route";
import { createLogger } from "@/utils/logger";
import { create } from "zustand";

const routeService = getRouteService();
const logger = createLogger("RoutesStore");

// Track if a fetch is in progress to prevent duplicate requests
let fetchingRoutes = false;

/**
 * Routes Store State Interface
 */
interface RoutesStore {
  /**
   * Array of loaded routes
   */
  routes: Route[];

  /**
   * Currently selected route ID
   */
  selectedRouteId: string | null;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error: string | null;

  /**
   * Fetch routes from Supabase
   */
  fetchRoutes: () => Promise<void>;

  /**
   * Add a route and sync to Supabase
   */
  addRoute: (route: Route) => Promise<void>;

  /**
   * Remove a route from store and Supabase
   */
  removeRoute: (routeId: string) => Promise<void>;

  /**
   * Get a route by ID
   */
  getRoute: (routeId: string) => Route | undefined;

  /**
   * Select a route for use in workout
   */
  selectRoute: (routeId: string | null) => void;

  /**
   * Get the currently selected route
   */
  getSelectedRoute: () => Route | undefined;

  /**
   * Clear all routes (local only)
   */
  clearRoutes: () => void;
}

/**
 * Routes Store
 *
 * Manages GPS routes with Supabase sync.
 * Routes are fetched from Supabase and synced on changes.
 * Includes request deduplication to prevent multiple concurrent fetches.
 *
 * @example
 * ```tsx
 * const { routes, addRoute, selectRoute, fetchRoutes } = useRoutesStore();
 *
 * // Fetch routes from Supabase
 * await fetchRoutes();
 *
 * // Add a route (syncs to Supabase)
 * await addRoute(parsedRoute);
 *
 * // Select a route for workout
 * selectRoute(route.id);
 * ```
 */
export const useRoutesStore = create<RoutesStore>()((set, get) => ({
  routes: [],
  selectedRouteId: null,
  isLoading: false,
  error: null,

  fetchRoutes: async () => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      logger.debug("Cannot fetch routes: user not authenticated");
      set({ routes: [], isLoading: false });
      return;
    }

    // Prevent duplicate concurrent requests
    if (fetchingRoutes) {
      logger.debug("Fetch already in progress, skipping duplicate request");
      return;
    }

    fetchingRoutes = true;
    logger.debug("Fetching routes from Supabase");
    set({ isLoading: true, error: null });

    try {
      const routes = await routeService.getRoutes(user.id);
      set({ routes, isLoading: false });
      logger.info(`Fetched ${routes.length} routes from Supabase`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch routes";
      logger.error("Error fetching routes:", err);
      set({ error: errorMessage, isLoading: false });
    } finally {
      fetchingRoutes = false;
    }
  },

  addRoute: async (route) => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      logger.warn("Cannot add route: user not authenticated");
      return;
    }

    const { routes } = get();

    try {
      // Save to Supabase
      logger.info("Adding route to Supabase:", route.name);
      const savedRoute = await routeService.createRoute(user.id, route);

      // Add to local state
      set({ routes: [...routes, savedRoute] });

      logger.info("✅ Route added successfully", {
        id: savedRoute.id,
        name: savedRoute.name,
        distance: `${(savedRoute.totalDistance / 1000).toFixed(2)} km`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save route";
      logger.error("Error adding route:", err);
      throw new Error(errorMessage);
    }
  },

  removeRoute: async (routeId) => {
    const { routes, selectedRouteId } = get();

    try {
      logger.info("Removing route from Supabase:", routeId);
      await routeService.deleteRoute(routeId);

      // Remove from local state
      set({
        routes: routes.filter((r) => r.id !== routeId),
        selectedRouteId: selectedRouteId === routeId ? null : selectedRouteId,
      });

      logger.info("✅ Route removed successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete route";
      logger.error("Error removing route:", err);
      throw new Error(errorMessage);
    }
  },

  getRoute: (routeId) => {
    const { routes } = get();
    return routes.find((r) => r.id === routeId);
  },

  selectRoute: (routeId) => {
    const { routes } = get();

    if (routeId && !routes.find((r) => r.id === routeId)) {
      logger.warn("⚠️ Cannot select route - not found", { routeId });
      return;
    }

    logger.log("📍 Selected route", { routeId });
    set({ selectedRouteId: routeId });
  },

  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    if (!selectedRouteId) return undefined;
    return routes.find((r) => r.id === selectedRouteId);
  },

  clearRoutes: () => {
    logger.log("🗑️ Clearing all routes");
    set({ routes: [], selectedRouteId: null });
  },
}));

/**
 * Helper function to add a route to the store (used by import flows)
 * This is a standalone function to avoid circular dependencies
 */
export const addRouteToStore = (route: Route) => {
  const { routes } = useRoutesStore.getState();
  // Check if route already exists
  if (!routes.find((r) => r.id === route.id)) {
    useRoutesStore.setState({ routes: [...routes, route] });
    logger.log("📍 Route added to store", { id: route.id, name: route.name });
  }
};
