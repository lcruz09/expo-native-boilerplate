import {
    createZustandStorage,
    STORAGE_IDS,
} from "@/services/storage/kvStorage";
import { createLogger } from "@/utils/logger";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CreateWorkoutData } from "../api/interfaces/IWorkoutService";

const logger = createLogger("SyncQueue");

/**
 * Sync status for a queued workout
 */
export enum SyncStatus {
  PENDING = "pending",
  SYNCING = "syncing",
  SYNCED = "synced",
  FAILED = "failed",
}

/**
 * Queued workout with sync metadata
 */
export interface QueuedWorkout {
  /**
   * Unique queue item ID
   */
  queueId: string;

  /**
   * Workout data to sync
   */
  data: CreateWorkoutData;

  /**
   * Current sync status
   */
  status: SyncStatus;

  /**
   * Number of sync attempts
   */
  attempts: number;

  /**
   * Last sync attempt timestamp
   */
  lastAttempt: number | null;

  /**
   * Error message from last failed attempt
   */
  lastError: string | null;

  /**
   * Timestamp when workout was queued
   */
  queuedAt: number;
}

/**
 * Sync Queue Store State Interface
 */
interface SyncQueueStore {
  /**
   * Queue of workouts pending sync
   */
  queue: QueuedWorkout[];

  /**
   * Add a workout to the sync queue
   */
  addToQueue: (data: CreateWorkoutData) => void;

  /**
   * Update sync status for a queued workout
   */
  updateStatus: (queueId: string, status: SyncStatus, error?: string) => void;

  /**
   * Remove a workout from the queue
   */
  removeFromQueue: (queueId: string) => void;

  /**
   * Get workouts ready for sync (pending or failed with retry eligible)
   */
  getReadyForSync: () => QueuedWorkout[];

  /**
   * Clear all synced workouts from queue
   */
  clearSynced: () => void;

  /**
   * Clear entire queue (use with caution)
   */
  clearAll: () => void;

  /**
   * Get queue statistics
   */
  getStats: () => {
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  };

  /**
   * Get a workout from the queue by workout ID
   */
  getWorkoutFromQueue: (workoutId: string) => QueuedWorkout | null;
}

/**
 * Calculate exponential backoff delay in milliseconds
 *
 * @param attempts - Number of failed attempts
 * @returns Delay in milliseconds before next retry
 */
const calculateBackoff = (attempts: number): number => {
  // Base delay: 5 seconds
  // Max delay: 5 minutes
  const baseDelay = 5000;
  const maxDelay = 300000;
  const delay = Math.min(baseDelay * Math.pow(2, attempts), maxDelay);
  return delay;
};

/**
 * Check if a failed workout is ready for retry
 *
 * @param workout - Queued workout to check
 * @returns True if ready for retry
 */
const isReadyForRetry = (workout: QueuedWorkout): boolean => {
  if (workout.status !== SyncStatus.FAILED) {
    return false;
  }

  if (!workout.lastAttempt) {
    return true;
  }

  const backoffDelay = calculateBackoff(workout.attempts);
  const timeSinceLastAttempt = Date.now() - workout.lastAttempt;

  return timeSinceLastAttempt >= backoffDelay;
};

/**
 * Sync Queue Store
 *
 * Manages a queue of workouts waiting to be synced to Supabase.
 * Provides retry logic with exponential backoff for failed syncs.
 *
 * @example
 * ```tsx
 * const { addToQueue, getReadyForSync } = useSyncQueue();
 *
 * // Add workout to queue
 * addToQueue({ workout, hrSamples, cyclingSamples });
 *
 * // Get workouts ready to sync
 * const ready = getReadyForSync();
 * ```
 */
export const useSyncQueue = create<SyncQueueStore>()(
  persist(
    (set, get) => ({
      queue: [],

      addToQueue: (data: CreateWorkoutData) => {
        const queueId = `queue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const queuedWorkout: QueuedWorkout = {
          queueId,
          data,
          status: SyncStatus.PENDING,
          attempts: 0,
          lastAttempt: null,
          lastError: null,
          queuedAt: Date.now(),
        };

        set((state) => ({
          queue: [...state.queue, queuedWorkout],
        }));

        logger.info(
          `Workout queued for sync: ${data.workout.id} (queue ID: ${queueId})`,
        );
      },

      updateStatus: (queueId: string, status: SyncStatus, error?: string) => {
        set((state) => ({
          queue: state.queue.map((item) => {
            if (item.queueId !== queueId) {
              return item;
            }

            const updates: Partial<QueuedWorkout> = {
              status,
              lastAttempt: Date.now(),
            };

            if (status === SyncStatus.SYNCING || status === SyncStatus.FAILED) {
              updates.attempts = item.attempts + 1;
            }

            if (error) {
              updates.lastError = error;
            }

            return { ...item, ...updates };
          }),
        }));

        logger.debug(
          `Queue item ${queueId} status updated to: ${status}`,
          error ? { error } : {},
        );
      },

      removeFromQueue: (queueId: string) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.queueId !== queueId),
        }));

        logger.debug(`Removed from queue: ${queueId}`);
      },

      getReadyForSync: () => {
        const { queue } = get();

        return queue.filter(
          (workout) =>
            workout.status === SyncStatus.PENDING || isReadyForRetry(workout),
        );
      },

      clearSynced: () => {
        set((state) => ({
          queue: state.queue.filter(
            (item) => item.status !== SyncStatus.SYNCED,
          ),
        }));

        logger.info("Cleared synced workouts from queue");
      },

      clearAll: () => {
        set({ queue: [] });
        logger.warn("Cleared entire sync queue");
      },

      getStats: () => {
        const { queue } = get();

        return {
          total: queue.length,
          pending: queue.filter((w) => w.status === SyncStatus.PENDING).length,
          syncing: queue.filter((w) => w.status === SyncStatus.SYNCING).length,
          synced: queue.filter((w) => w.status === SyncStatus.SYNCED).length,
          failed: queue.filter((w) => w.status === SyncStatus.FAILED).length,
        };
      },

      getWorkoutFromQueue: (workoutId: string) => {
        const { queue } = get();
        const queuedWorkout = queue.find(
          (item) => item.data.workout.id === workoutId,
        );
        return queuedWorkout || null;
      },
    }),
    {
      name: "sync-queue",
      storage: createJSONStorage(() =>
        createZustandStorage(STORAGE_IDS.APP_DATA),
      ),
    },
  ),
);
