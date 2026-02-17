import { Route } from "@/types/route";
import { SupabaseRouteService } from "../SupabaseRouteService";

// Mock Supabase client
jest.mock("../client", () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock("@/utils/logger");

const { supabase } = require("../client");

describe("SupabaseRouteService", () => {
  let service: SupabaseRouteService;

  const mockRoute: Route = {
    id: "route-1",
    name: "Test Route",
    source: "file",
    sourceIdentifier: "test.gpx",
    totalDistance: 10000,
    elevationGain: 500,
    elevationLoss: 300,
    minElevation: 100,
    maxElevation: 600,
    waypoints: [
      { lat: 40.7128, lon: -74.006, elevation: 100, distanceFromStart: 0 },
      { lat: 40.7129, lon: -74.007, elevation: 150, distanceFromStart: 100 },
    ],
  };

  const mockRouteRow = {
    id: "route-1",
    user_id: "user-123",
    name: "Test Route",
    source: "file",
    source_identifier: "test.gpx",
    total_distance: 10000,
    elevation_gain: 500,
    elevation_loss: 300,
    min_elevation: 100,
    max_elevation: 600,
    waypoints: [
      { lat: 40.7128, lon: -74.006, elevation: 100, distanceFromStart: 0 },
      { lat: 40.7129, lon: -74.007, elevation: 150, distanceFromStart: 100 },
    ],
    created_at: "2023-03-15T08:00:00.000Z",
    updated_at: "2023-03-15T08:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseRouteService();
  });

  describe("createRoute", () => {
    it("should create route successfully", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRouteRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await service.createRoute("user-123", mockRoute);

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-123",
          name: "Test Route",
          source: "file",
          total_distance: 10000,
          elevation_gain: 500,
        }),
      );
      expect(result.id).toBe("route-1");
      expect(result.name).toBe("Test Route");
      expect(result.waypoints).toHaveLength(2);
    });

    it("should not include route ID in insert (DB-generated)", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRouteRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await service.createRoute("user-123", mockRoute);

      const insertedData = mockInsert.mock.calls[0][0];
      expect(insertedData).not.toHaveProperty("id");
    });

    it("should handle route without sourceIdentifier", async () => {
      const routeWithoutSourceId = {
        ...mockRoute,
        sourceIdentifier: undefined,
      };

      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { ...mockRouteRow, source_identifier: null },
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await service.createRoute(
        "user-123",
        routeWithoutSourceId,
      );

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          source_identifier: null,
        }),
      );
      expect(result.sourceIdentifier).toBeUndefined();
    });

    it("should handle creation error", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(service.createRoute("user-123", mockRoute)).rejects.toThrow(
        "Failed to create route: Database error",
      );
    });
  });

  describe("getRoute", () => {
    it("should fetch route successfully", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRouteRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getRoute("route-1");

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "route-1");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("route-1");
      expect(result?.name).toBe("Test Route");
    });

    it("should return null if route not found", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" }, // Not found error
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getRoute("non-existent");

      expect(result).toBeNull();
    });

    it("should return null if no data returned", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getRoute("route-1");

      expect(result).toBeNull();
    });

    it("should throw error on database error", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: "OTHER_ERROR", message: "Database error" },
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(service.getRoute("route-1")).rejects.toThrow(
        "Failed to fetch route: Database error",
      );
    });
  });

  describe("getRoutes", () => {
    it("should fetch all routes for a user", async () => {
      const mockRoute2 = { ...mockRouteRow, id: "route-2", name: "Route 2" };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [mockRouteRow, mockRoute2],
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      const result = await service.getRoutes("user-123");

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-123");
      expect(mockOrder).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("route-1");
      expect(result[1].id).toBe("route-2");
    });

    it("should return empty array if user has no routes", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      const result = await service.getRoutes("user-123");

      expect(result).toEqual([]);
    });

    it("should handle fetch error", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Fetch error" },
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      await expect(service.getRoutes("user-123")).rejects.toThrow(
        "Failed to fetch routes: Fetch error",
      );
    });
  });

  describe("updateRoute", () => {
    it("should update route name successfully", async () => {
      const updatedRow = { ...mockRouteRow, name: "Updated Route" };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await service.updateRoute("route-1", {
        name: "Updated Route",
      });

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Route",
        }),
      );
      expect(mockEq).toHaveBeenCalledWith("id", "route-1");
      expect(result.name).toBe("Updated Route");
    });

    it("should update multiple fields", async () => {
      const updatedRow = {
        ...mockRouteRow,
        name: "Updated Route",
        elevation_gain: 600,
        elevation_loss: 400,
      };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await service.updateRoute("route-1", {
        name: "Updated Route",
        elevationGain: 600,
        elevationLoss: 400,
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Route",
          elevation_gain: 600,
          elevation_loss: 400,
        }),
      );
      expect(result.elevationGain).toBe(600);
      expect(result.elevationLoss).toBe(400);
    });

    it("should handle update error", async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Update error" },
      });

      supabase.from.mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(
        service.updateRoute("route-1", { name: "New Name" }),
      ).rejects.toThrow("Failed to update route: Update error");
    });
  });

  describe("deleteRoute", () => {
    it("should delete route successfully", async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await service.deleteRoute("route-1");

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "route-1");
    });

    it("should handle delete error", async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        error: { message: "Delete error" },
      });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(service.deleteRoute("route-1")).rejects.toThrow(
        "Failed to delete route: Delete error",
      );
    });
  });

  describe("routeExists", () => {
    it("should return true if route exists", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: "route-1" },
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.routeExists("route-1");

      expect(supabase.from).toHaveBeenCalledWith("routes");
      expect(mockSelect).toHaveBeenCalledWith("id");
      expect(mockEq).toHaveBeenCalledWith("id", "route-1");
      expect(result).toBe(true);
    });

    it("should return false if route does not exist", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" }, // Not found error
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.routeExists("non-existent");

      expect(result).toBe(false);
    });

    it("should return false if no data returned", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.routeExists("route-1");

      expect(result).toBe(false);
    });

    it("should throw error on database error", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: "OTHER_ERROR", message: "Database error" },
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(service.routeExists("route-1")).rejects.toThrow(
        "Failed to check route existence: Database error",
      );
    });
  });

  describe("data conversion", () => {
    it("should convert route to row format without ID", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRouteRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await service.createRoute("user-123", mockRoute);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall).toMatchObject({
        user_id: "user-123",
        name: "Test Route",
        source: "file",
        source_identifier: "test.gpx",
        total_distance: 10000,
        elevation_gain: 500,
        elevation_loss: 300,
        min_elevation: 100,
        max_elevation: 600,
        waypoints: expect.arrayContaining([
          expect.objectContaining({ lat: 40.7128 }),
        ]),
      });
      expect(insertCall.id).toBeUndefined();
    });

    it("should convert row to route format", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRouteRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getRoute("route-1");

      expect(result).toMatchObject({
        id: "route-1",
        name: "Test Route",
        source: "file",
        sourceIdentifier: "test.gpx",
        totalDistance: 10000,
        elevationGain: 500,
        elevationLoss: 300,
        minElevation: 100,
        maxElevation: 600,
        waypoints: expect.arrayContaining([
          expect.objectContaining({ lat: 40.7128 }),
        ]),
      });
    });
  });
});
