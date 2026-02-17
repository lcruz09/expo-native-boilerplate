import { CreateWorkoutData } from "@/services/api/interfaces/IWorkoutService";
import { WorkoutSession, WorkoutStatus, WorkoutType } from "@/types/workout";
import { SyncStatus, useSyncQueue } from "../syncQueue";

// Mock dependencies
jest.mock("@/services/storage/kvStorage", () => ({
  createZustandStorage: jest.fn(() => ({
    setItem: jest.fn(),
    getItem: jest.fn(() => null),
    removeItem: jest.fn(),
  })),
  STORAGE_IDS: {
    APP_DATA: "app-data",
  },
}));
jest.mock("@/utils/logger");

describe("syncQueue", () => {
  const mockWorkout: WorkoutSession = {
    id: "workout-1",
    type: WorkoutType.INDOOR_CYCLING,
    status: WorkoutStatus.COMPLETED,
    startTime: 1234567890000,
    endTime: 1234567900000,
    duration: 10000,
    avgHR: 150,
    maxHR: 180,
    minHR: 120,
    calories: 200,
    hrSamples: [],
  };

  const mockWorkoutData: CreateWorkoutData = {
    workout: mockWorkout,
    hrSamples: [
      { timestamp: 1234567890000, bpm: 150 },
      { timestamp: 1234567891000, bpm: 152 },
    ],
    cyclingSamples: [],
  };

  beforeEach(() => {
    // Reset store state before each test
    useSyncQueue.getState().clearAll();
    jest.clearAllMocks();
  });

  // Helper to get fresh queue state
  const getQueue = () => useSyncQueue.getState().queue;

  describe("addToQueue", () => {
    it("should add workout to queue with pending status", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);

      const queue = getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        data: mockWorkoutData,
        status: SyncStatus.PENDING,
        attempts: 0,
        lastAttempt: null,
        lastError: null,
      });
      expect(queue[0].queueId).toMatch(/^queue-/);
      expect(queue[0].queuedAt).toBeGreaterThan(0);
    });

    it("should add multiple workouts to queue", () => {
      const workout2 = {
        ...mockWorkoutData,
        workout: { ...mockWorkout, id: "workout-2" },
      };

      useSyncQueue.getState().addToQueue(mockWorkoutData);
      useSyncQueue.getState().addToQueue(workout2);

      const queue = getQueue();
      expect(queue).toHaveLength(2);
      expect(queue[0].data.workout.id).toBe("workout-1");
      expect(queue[1].data.workout.id).toBe("workout-2");
    });
  });

  describe("updateStatus", () => {
    it("should update status to syncing", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);
      const queueId = getQueue()[0].queueId;

      useSyncQueue.getState().updateStatus(queueId, SyncStatus.SYNCING);

      const queue = getQueue();
      expect(queue[0].status).toBe(SyncStatus.SYNCING);
      expect(queue[0].attempts).toBe(1);
      expect(queue[0].lastAttempt).toBeGreaterThan(0);
    });

    it("should update status to failed with error message", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);
      const queueId = getQueue()[0].queueId;

      useSyncQueue
        .getState()
        .updateStatus(queueId, SyncStatus.FAILED, "Network error");

      const queue = getQueue();
      expect(queue[0].status).toBe(SyncStatus.FAILED);
      expect(queue[0].attempts).toBe(1);
      expect(queue[0].lastError).toBe("Network error");
    });
  });

  describe("removeFromQueue", () => {
    it("should remove workout from queue", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);
      const queueId = getQueue()[0].queueId;

      useSyncQueue.getState().removeFromQueue(queueId);

      expect(getQueue()).toHaveLength(0);
    });
  });

  describe("getReadyForSync", () => {
    it("should return pending workouts", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);

      const ready = useSyncQueue.getState().getReadyForSync();

      expect(ready).toHaveLength(1);
      expect(ready[0].status).toBe(SyncStatus.PENDING);
    });

    it("should not return syncing workouts", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);
      const queueId = getQueue()[0].queueId;
      useSyncQueue.getState().updateStatus(queueId, SyncStatus.SYNCING);

      const ready = useSyncQueue.getState().getReadyForSync();

      expect(ready).toHaveLength(0);
    });
  });

  describe("clearSynced", () => {
    it("should remove synced workouts from queue", () => {
      const workout2 = {
        ...mockWorkoutData,
        workout: { ...mockWorkout, id: "workout-2" },
      };

      useSyncQueue.getState().addToQueue(mockWorkoutData);
      useSyncQueue.getState().addToQueue(workout2);

      const queueId = getQueue()[0].queueId;
      useSyncQueue.getState().updateStatus(queueId, SyncStatus.SYNCED);

      useSyncQueue.getState().clearSynced();

      const queue = getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].data.workout.id).toBe("workout-2");
    });
  });

  describe("getStats", () => {
    it("should return correct stats", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);

      const stats = useSyncQueue.getState().getStats();

      expect(stats).toEqual({
        total: 1,
        pending: 1,
        syncing: 0,
        synced: 0,
        failed: 0,
      });
    });
  });

  describe("getWorkoutFromQueue", () => {
    it("should return queued workout by workout ID", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);

      const found = useSyncQueue.getState().getWorkoutFromQueue("workout-1");

      expect(found).toBeDefined();
      expect(found?.data.workout.id).toBe("workout-1");
    });

    it("should return null for non-existent workout ID", () => {
      useSyncQueue.getState().addToQueue(mockWorkoutData);

      const found = useSyncQueue
        .getState()
        .getWorkoutFromQueue("non-existent-id");

      expect(found).toBeNull();
    });
  });
});
