import { Route } from "@/types/route";
import { addRouteToStore, useRoutesStore } from "../routesStore";

// Mock dependencies
jest.mock("@/services/storage/kvStorage");
jest.mock("@/services/api/factory");
jest.mock("@/utils/logger");

describe("routesStore", () => {
  const mockRoute: Route = {
    id: "route-1",
    name: "Test Route",
    waypoints: [
      { lat: 40.7128, lon: -74.006, elevation: 100, distanceFromStart: 0 },
      { lat: 40.7129, lon: -74.007, elevation: 110, distanceFromStart: 100 },
    ],
    totalDistance: 1000,
    elevationGain: 50,
    elevationLoss: 10,
    minElevation: 100,
    maxElevation: 150,
    source: "file",
  };

  beforeEach(() => {
    // Reset store state before each test
    useRoutesStore.getState().clearRoutes();
    jest.clearAllMocks();
  });

  describe("addRouteToStore", () => {
    it("should add route to store if it doesn't exist", () => {
      const { routes } = useRoutesStore.getState();
      expect(routes).toHaveLength(0);

      addRouteToStore(mockRoute);

      const updatedRoutes = useRoutesStore.getState().routes;
      expect(updatedRoutes).toHaveLength(1);
      expect(updatedRoutes[0]).toEqual(mockRoute);
    });

    it("should not add duplicate routes", () => {
      addRouteToStore(mockRoute);
      addRouteToStore(mockRoute); // Try to add same route again

      const { routes } = useRoutesStore.getState();
      expect(routes).toHaveLength(1);
      expect(routes[0].id).toBe("route-1");
    });

    it("should add multiple different routes", () => {
      const route2: Route = {
        ...mockRoute,
        id: "route-2",
        name: "Second Route",
      };

      addRouteToStore(mockRoute);
      addRouteToStore(route2);

      const { routes } = useRoutesStore.getState();
      expect(routes).toHaveLength(2);
      expect(routes[0].id).toBe("route-1");
      expect(routes[1].id).toBe("route-2");
    });

    it("should work with routes added through store actions", () => {
      // First add a route directly to the store
      useRoutesStore.setState({ routes: [mockRoute] });

      // Then try to add a new route via helper
      const route2: Route = {
        ...mockRoute,
        id: "route-2",
        name: "Second Route",
      };
      addRouteToStore(route2);

      const { routes } = useRoutesStore.getState();
      expect(routes).toHaveLength(2);
    });

    it("should handle empty waypoints array", () => {
      const routeWithoutWaypoints: Route = {
        ...mockRoute,
        id: "route-empty",
        waypoints: [],
      };

      addRouteToStore(routeWithoutWaypoints);

      const { routes } = useRoutesStore.getState();
      expect(routes).toHaveLength(1);
      expect(routes[0].waypoints).toEqual([]);
    });
  });

  describe("selectRoute", () => {
    it("should select a route by ID", () => {
      useRoutesStore.setState({ routes: [mockRoute] });
      const { selectRoute, selectedRouteId } = useRoutesStore.getState();

      selectRoute("route-1");

      const updatedState = useRoutesStore.getState();
      expect(updatedState.selectedRouteId).toBe("route-1");
    });

    it("should deselect route when passing null", () => {
      useRoutesStore.setState({
        routes: [mockRoute],
        selectedRouteId: "route-1",
      });
      const { selectRoute } = useRoutesStore.getState();

      selectRoute(null);

      const updatedState = useRoutesStore.getState();
      expect(updatedState.selectedRouteId).toBeNull();
    });

    it("should not select non-existent route", () => {
      useRoutesStore.setState({ routes: [mockRoute] });
      const { selectRoute } = useRoutesStore.getState();

      selectRoute("non-existent-id");

      const updatedState = useRoutesStore.getState();
      expect(updatedState.selectedRouteId).toBeNull();
    });
  });

  describe("getRoute", () => {
    it("should return route by ID", () => {
      useRoutesStore.setState({ routes: [mockRoute] });
      const { getRoute } = useRoutesStore.getState();

      const found = getRoute("route-1");

      expect(found).toEqual(mockRoute);
    });

    it("should return undefined for non-existent route", () => {
      useRoutesStore.setState({ routes: [mockRoute] });
      const { getRoute } = useRoutesStore.getState();

      const found = getRoute("non-existent-id");

      expect(found).toBeUndefined();
    });
  });

  describe("getSelectedRoute", () => {
    it("should return selected route", () => {
      useRoutesStore.setState({
        routes: [mockRoute],
        selectedRouteId: "route-1",
      });
      const { getSelectedRoute } = useRoutesStore.getState();

      const selected = getSelectedRoute();

      expect(selected).toEqual(mockRoute);
    });

    it("should return undefined when no route selected", () => {
      useRoutesStore.setState({
        routes: [mockRoute],
        selectedRouteId: null,
      });
      const { getSelectedRoute } = useRoutesStore.getState();

      const selected = getSelectedRoute();

      expect(selected).toBeUndefined();
    });

    it("should return undefined when selected route no longer exists", () => {
      useRoutesStore.setState({
        routes: [],
        selectedRouteId: "route-1",
      });
      const { getSelectedRoute } = useRoutesStore.getState();

      const selected = getSelectedRoute();

      expect(selected).toBeUndefined();
    });
  });

  describe("clearRoutes", () => {
    it("should clear all routes and deselect", () => {
      useRoutesStore.setState({
        routes: [mockRoute],
        selectedRouteId: "route-1",
      });
      const { clearRoutes } = useRoutesStore.getState();

      clearRoutes();

      const { routes, selectedRouteId } = useRoutesStore.getState();
      expect(routes).toHaveLength(0);
      expect(selectedRouteId).toBeNull();
    });
  });
});
