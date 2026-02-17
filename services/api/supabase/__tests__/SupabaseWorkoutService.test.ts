import {
  CyclingSample,
  HRSample,
  WorkoutSession,
  WorkoutStatus,
  WorkoutType,
} from "@/types/workout";
import { SupabaseWorkoutService } from "../SupabaseWorkoutService";
import { CreateWorkoutData } from "../../interfaces/IWorkoutService";

// Mock Supabase client
jest.mock("../client", () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock("@/utils/logger");

const { supabase } = require("../client");

describe("SupabaseWorkoutService", () => {
  let service: SupabaseWorkoutService;

  const mockWorkout: WorkoutSession = {
    id: "workout-1",
    type: WorkoutType.INDOOR_CYCLING,
    status: WorkoutStatus.COMPLETED,
    startTime: 1678886400000,
    endTime: 1678890000000,
    duration: 3600,
    avgHR: 140,
    maxHR: 180,
    minHR: 100,
    calories: 500,
    hrSamples: [],
    cyclingSamples: [],
    title: "Test Workout",
    description: "Test Description",
  };

  const mockHRSamples: HRSample[] = [
    { timestamp: 1678886400000, bpm: 140 },
    { timestamp: 1678886401000, bpm: 142 },
  ];

  const mockCyclingSamples: CyclingSample[] = [
    {
      timestamp: 1678886400000,
      speed: 25,
      cadence: 80,
      power: 180,
      distance: 0,
    },
    {
      timestamp: 1678886401000,
      speed: 26,
      cadence: 82,
      power: 185,
      distance: 25,
    },
  ];

  const mockWorkoutRow = {
    id: "workout-1",
    user_id: "user-123",
    type: WorkoutType.INDOOR_CYCLING,
    title: "Test Workout",
    description: "Test Description",
    status: WorkoutStatus.COMPLETED,
    start_time: "2023-03-15T08:00:00.000Z",
    end_time: "2023-03-15T09:00:00.000Z",
    duration: 3600,
    avg_hr: 140,
    max_hr: 180,
    min_hr: 100,
    calories: 500,
    device_name: null,
    avg_speed: null,
    max_speed: null,
    avg_cadence: null,
    max_cadence: null,
    avg_power: null,
    max_power: null,
    total_distance: null,
    elevation: null,
    fitness_device_name: null,
    route_id: null,
    route_name: null,
    route_distance_completed: null,
    virtual_ride_sensitivity: null,
    created_at: "2023-03-15T08:00:00.000Z",
    updated_at: "2023-03-15T08:00:00.000Z",
    synced: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseWorkoutService();
  });

  describe("createWorkout", () => {
    it("should create workout successfully without samples", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: [],
        cyclingSamples: [],
      };

      const result = await service.createWorkout("user-123", data);

      expect(supabase.from).toHaveBeenCalledWith("workouts");
      expect(mockInsert).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result.id).toBe("workout-1");
      expect(result.type).toBe(WorkoutType.INDOOR_CYCLING);
    });

    it("should create workout with HR samples", async () => {
      const mockWorkoutInsert = jest.fn().mockReturnThis();
      const mockWorkoutSelect = jest.fn().mockReturnThis();
      const mockWorkoutSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      const mockSamplesInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      supabase.from.mockImplementation((table: string) => {
        if (table === "workouts") {
          return {
            insert: mockWorkoutInsert,
            select: mockWorkoutSelect,
            single: mockWorkoutSingle,
          };
        } else if (table === "workout_samples") {
          return {
            insert: mockSamplesInsert,
          };
        }
        return {};
      });

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: mockHRSamples,
        cyclingSamples: [],
      };

      const result = await service.createWorkout("user-123", data);

      expect(supabase.from).toHaveBeenCalledWith("workout_samples");
      expect(mockSamplesInsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            workout_id: "workout-1",
            sample_type: "heart_rate",
            sample_count: 2,
          }),
        ]),
      );
      expect(result.id).toBe("workout-1");
    });

    it("should create workout with cycling samples", async () => {
      const mockWorkoutInsert = jest.fn().mockReturnThis();
      const mockWorkoutSelect = jest.fn().mockReturnThis();
      const mockWorkoutSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      const mockSamplesInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      supabase.from.mockImplementation((table: string) => {
        if (table === "workouts") {
          return {
            insert: mockWorkoutInsert,
            select: mockWorkoutSelect,
            single: mockWorkoutSingle,
          };
        } else if (table === "workout_samples") {
          return {
            insert: mockSamplesInsert,
          };
        }
        return {};
      });

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: [],
        cyclingSamples: mockCyclingSamples,
      };

      const result = await service.createWorkout("user-123", data);

      expect(mockSamplesInsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            workout_id: "workout-1",
            sample_type: "cycling",
            sample_count: 2,
          }),
        ]),
      );
      expect(result.id).toBe("workout-1");
    });

    it("should create workout with both HR and cycling samples", async () => {
      const mockWorkoutInsert = jest.fn().mockReturnThis();
      const mockWorkoutSelect = jest.fn().mockReturnThis();
      const mockWorkoutSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      const mockSamplesInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      supabase.from.mockImplementation((table: string) => {
        if (table === "workouts") {
          return {
            insert: mockWorkoutInsert,
            select: mockWorkoutSelect,
            single: mockWorkoutSingle,
          };
        } else if (table === "workout_samples") {
          return {
            insert: mockSamplesInsert,
          };
        }
        return {};
      });

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: mockHRSamples,
        cyclingSamples: mockCyclingSamples,
      };

      const result = await service.createWorkout("user-123", data);

      expect(mockSamplesInsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ sample_type: "heart_rate" }),
          expect.objectContaining({ sample_type: "cycling" }),
        ]),
      );
      expect(result.id).toBe("workout-1");
    });

    it("should handle workout creation error", async () => {
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

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: [],
        cyclingSamples: [],
      };

      await expect(service.createWorkout("user-123", data)).rejects.toThrow(
        "Failed to create workout: Database error",
      );
    });

    it("should not throw if samples insertion fails", async () => {
      const mockWorkoutInsert = jest.fn().mockReturnThis();
      const mockWorkoutSelect = jest.fn().mockReturnThis();
      const mockWorkoutSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      const mockSamplesInsert = jest.fn().mockResolvedValue({
        error: { message: "Samples error" },
      });

      supabase.from.mockImplementation((table: string) => {
        if (table === "workouts") {
          return {
            insert: mockWorkoutInsert,
            select: mockWorkoutSelect,
            single: mockWorkoutSingle,
          };
        } else if (table === "workout_samples") {
          return {
            insert: mockSamplesInsert,
          };
        }
        return {};
      });

      const data: CreateWorkoutData = {
        workout: mockWorkout,
        hrSamples: mockHRSamples,
        cyclingSamples: [],
      };

      // Should not throw - workout is already created
      const result = await service.createWorkout("user-123", data);
      expect(result.id).toBe("workout-1");
    });
  });

  describe("getWorkout", () => {
    it("should fetch workout successfully", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockWorkoutRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getWorkout("workout-1");

      expect(supabase.from).toHaveBeenCalledWith("workouts");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "workout-1");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("workout-1");
    });

    it("should return null if workout not found", async () => {
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

      const result = await service.getWorkout("non-existent");

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

      await expect(service.getWorkout("workout-1")).rejects.toThrow(
        "Failed to fetch workout: Database error",
      );
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

      const result = await service.getWorkout("workout-1");

      expect(result).toBeNull();
    });
  });

  describe("getWorkouts", () => {
    it("should fetch workouts with count", async () => {
      const mockCountEq = jest.fn().mockResolvedValue({
        count: 2,
        error: null,
      });

      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: [mockWorkoutRow, mockWorkoutRow],
        error: null,
      });

      supabase.from.mockImplementation((table: string) => {
        return {
          select: jest
            .fn()
            .mockImplementation((fields?: string, options?: any) => {
              // Count query with head: true
              if (options?.head === true) {
                return {
                  eq: mockCountEq,
                };
              }
              // Regular data query
              return {
                eq: mockEq,
                order: mockOrder,
                range: mockRange,
              };
            }),
        };
      });

      const result = await service.getWorkouts("user-123", 50, 0);

      expect(result.workouts).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("should handle count error", async () => {
      const mockCountSelect = jest.fn().mockReturnThis();
      const mockCountEq = jest.fn().mockResolvedValue({
        count: null,
        error: { message: "Count error" },
      });

      supabase.from.mockReturnValue({
        select: mockCountSelect,
        eq: mockCountEq,
      });

      await expect(service.getWorkouts("user-123")).rejects.toThrow(
        "Failed to count workouts: Count error",
      );
    });

    it("should handle fetch error", async () => {
      const mockCountEq = jest.fn().mockResolvedValue({
        count: 0,
        error: null,
      });

      const mockSelect = jest.fn().mockImplementation((fields?: string) => {
        if (fields === "*") {
          const mockEq = jest.fn().mockReturnThis();
          const mockOrder = jest.fn().mockReturnThis();
          const mockRange = jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Fetch error" },
          });
          return { eq: mockEq, order: mockOrder, range: mockRange };
        }
        return { eq: mockCountEq };
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      await expect(service.getWorkouts("user-123")).rejects.toThrow(
        "Failed to fetch workouts: Fetch error",
      );
    });
  });

  describe("updateWorkout", () => {
    it("should update workout successfully", async () => {
      const updatedRow = { ...mockWorkoutRow, title: "Updated Title" };

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

      const result = await service.updateWorkout("workout-1", {
        title: "Updated Title",
      });

      expect(supabase.from).toHaveBeenCalledWith("workouts");
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "workout-1");
      expect(result.title).toBe("Updated Title");
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
        service.updateWorkout("workout-1", { title: "New Title" }),
      ).rejects.toThrow("Failed to update workout: Update error");
    });
  });

  describe("deleteWorkout", () => {
    it("should delete workout successfully", async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await service.deleteWorkout("workout-1");

      expect(supabase.from).toHaveBeenCalledWith("workouts");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "workout-1");
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

      await expect(service.deleteWorkout("workout-1")).rejects.toThrow(
        "Failed to delete workout: Delete error",
      );
    });
  });

  describe("getHRSamples", () => {
    it("should fetch HR samples successfully", async () => {
      const mockSamplesRow = {
        id: "sample-1",
        workout_id: "workout-1",
        sample_type: "heart_rate",
        data: [
          [1678886400000, 140],
          [1678886401000, 142],
        ],
        sample_count: 2,
        created_at: "2023-03-15T08:00:00.000Z",
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockSamplesRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getHRSamples("workout-1");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ timestamp: 1678886400000, bpm: 140 });
      expect(result[1]).toEqual({ timestamp: 1678886401000, bpm: 142 });
    });

    it("should return empty array if no HR samples found", async () => {
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

      const result = await service.getHRSamples("workout-1");

      expect(result).toEqual([]);
    });
  });

  describe("getCyclingSamples", () => {
    it("should fetch cycling samples successfully", async () => {
      const mockSamplesRow = {
        id: "sample-1",
        workout_id: "workout-1",
        sample_type: "cycling",
        data: [
          [1678886400000, 25, 80, 180, 0],
          [1678886401000, 26, 82, 185, 25],
        ],
        sample_count: 2,
        created_at: "2023-03-15T08:00:00.000Z",
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockSamplesRow,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await service.getCyclingSamples("workout-1");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: 1678886400000,
        speed: 25,
        cadence: 80,
        power: 180,
        distance: 0,
      });
    });

    it("should return empty array if no cycling samples found", async () => {
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

      const result = await service.getCyclingSamples("workout-1");

      expect(result).toEqual([]);
    });
  });
});
