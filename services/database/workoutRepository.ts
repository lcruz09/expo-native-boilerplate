import { CyclingSample, HRSample, WorkoutSession } from "@/types/workout";
import { createLogger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { workouts, workoutSamples } from "./schema";

const logger = createLogger("WorkoutRepository");

export const workoutRepository = {
  /**
   * Create a new workout session in the database
   */
  createWorkout: async (workout: WorkoutSession) => {
    try {
      await db.insert(workouts).values({
        id: workout.id,
        type: workout.type,
        startTime: workout.startTime,
        status: workout.status,
        deviceName: workout.deviceName,
        fitnessDeviceName: workout.fitnessDeviceName,
        routeId: workout.routeId || null,
        routeName: workout.routeName || null,
        virtualRideSensitivity: workout.virtualRideSensitivity || null,
        routeJson: workout.route ? JSON.stringify(workout.route) : null,
        routeElevationProfileJson: workout.routeElevationProfile
          ? JSON.stringify(workout.routeElevationProfile)
          : null,
        routeCoordinatesJson: workout.routeCoordinates
          ? JSON.stringify(workout.routeCoordinates)
          : null,
      });
      logger.info(`✅ Workout created in DB: ${workout.id}`);
    } catch (error) {
      logger.error("❌ Failed to create workout in DB:", error);
      throw error;
    }
  },

  /**
   * Add a heart rate sample
   */
  addHRSample: async (workoutId: string, sample: HRSample) => {
    try {
      await db.insert(workoutSamples).values({
        workoutId,
        timestamp: sample.timestamp,
        type: "hr",
        heartRate: sample.bpm,
      });
    } catch (error) {
      logger.error("❌ Failed to add HR sample:", error);
      // Don't throw, just log - we don't want to crash the ride for a missed sample
    }
  },

  /**
   * Add a cycling sample
   */
  addCyclingSample: async (workoutId: string, sample: CyclingSample) => {
    try {
      await db.insert(workoutSamples).values({
        workoutId,
        timestamp: sample.timestamp,
        type: "cycling",
        speed: sample.speed,
        cadence: sample.cadence,
        power: sample.power,
        distance: sample.distance,
      });
    } catch (error) {
      logger.error("❌ Failed to add cycling sample:", error);
    }
  },

  /**
   * Get all samples for a workout (used when finishing)
   */
  getWorkoutSamples: async (workoutId: string) => {
    try {
      const samples = await db
        .select()
        .from(workoutSamples)
        .where(eq(workoutSamples.workoutId, workoutId));

      const hrSamples: HRSample[] = samples
        .filter((s) => s.type === "hr" && s.heartRate !== null)
        .map((s) => ({
          timestamp: s.timestamp,
          bpm: s.heartRate!,
        }));

      const cyclingSamples: CyclingSample[] = samples
        .filter((s) => s.type === "cycling")
        .map((s) => ({
          timestamp: s.timestamp,
          speed: s.speed || 0,
          cadence: s.cadence || 0,
          power: s.power || 0,
          distance: s.distance || 0,
        }));

      return { hrSamples, cyclingSamples };
    } catch (error) {
      logger.error("❌ Failed to get workout samples:", error);
      throw error;
    }
  },

  /**
   * Delete a workout and its samples
   */
  deleteWorkout: async (workoutId: string) => {
    try {
      await db.delete(workouts).where(eq(workouts.id, workoutId));
      logger.info(`🗑️ Workout deleted from DB: ${workoutId}`);
    } catch (error) {
      logger.error("❌ Failed to delete workout:", error);
      throw error;
    }
  },
};
