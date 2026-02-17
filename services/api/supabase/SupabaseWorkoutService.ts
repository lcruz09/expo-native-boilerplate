import { CyclingSample, HRSample, WorkoutSession } from "@/types/workout";
import { createLogger } from "@/utils/logger";
import {
  CreateWorkoutData,
  IWorkoutService,
  WorkoutWithSamples,
} from "../interfaces/IWorkoutService";
import { supabase } from "./client";
import {
  WorkoutRow,
  WorkoutSamplesRow,
  cyclingSamplesToRow,
  hrSamplesToRow,
  rowToCyclingSamples,
  rowToHRSamples,
  rowToWorkout,
  workoutToRow,
} from "./mappings";

const logger = createLogger("SupabaseWorkoutService");

/**
 * Supabase Workout Service
 *
 * Implementation of IWorkoutService for Supabase database.
 * Handles all workout CRUD operations using Supabase as the backend.
 *
 * @example
 * ```typescript
 * const workoutService = new SupabaseWorkoutService();
 * const workout = await workoutService.createWorkout(userId, workoutData);
 * ```
 */
export class SupabaseWorkoutService implements IWorkoutService {
  /**
   * Create a new workout with samples in Supabase
   */
  async createWorkout(
    userId: string,
    data: CreateWorkoutData,
  ): Promise<WorkoutSession> {
    logger.info("Creating workout:", data.workout.id);

    // Insert workout
    const workoutRow = workoutToRow(userId, data.workout);
    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .insert(workoutRow)
      .select()
      .single();

    if (workoutError) {
      throw new Error(`Failed to create workout: ${workoutError.message}`);
    }

    const workoutId = workoutData.id;

    // Insert samples as compact JSONB (if any)
    const sampleRows: Omit<WorkoutSamplesRow, "id" | "created_at">[] = [];

    if (data.hrSamples.length > 0) {
      sampleRows.push(hrSamplesToRow(workoutId, data.hrSamples));
    }

    if (data.cyclingSamples.length > 0) {
      sampleRows.push(cyclingSamplesToRow(workoutId, data.cyclingSamples));
    }

    if (sampleRows.length > 0) {
      const { error: samplesError } = await supabase
        .from("workout_samples")
        .insert(sampleRows);

      if (samplesError) {
        logger.error("Failed to insert workout samples:", samplesError);
        // Don't throw - workout is already created
      } else {
        logger.debug(
          `Inserted ${data.hrSamples.length} HR samples and ${data.cyclingSamples.length} cycling samples as JSONB`,
        );
      }
    }

    logger.info("Workout created successfully:", workoutId);
    return rowToWorkout(workoutData as WorkoutRow);
  }

  /**
   * Get a workout by ID with samples from Supabase
   */
  async getWorkout(workoutId: string): Promise<WorkoutWithSamples | null> {
    logger.debug("Fetching workout with samples:", workoutId);

    // Fetch workout
    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", workoutId)
      .single();

    if (workoutError) {
      if (workoutError.code === "PGRST116") {
        logger.debug("No workout found:", workoutId);
        return null;
      }
      throw new Error(`Failed to fetch workout: ${workoutError.message}`);
    }

    if (!workoutData) {
      return null;
    }

    const workoutRow = workoutData as WorkoutRow;

    // Fetch route waypoints if workout has a route
    let routeWaypoints;
    if (workoutRow.route_id) {
      const { data: routeData, error: routeError } = await supabase
        .from("routes")
        .select("waypoints")
        .eq("id", workoutRow.route_id)
        .single();

      if (routeError) {
        logger.warn(
          `Failed to fetch route for workout ${workoutId}:`,
          routeError,
        );
      } else if (routeData) {
        routeWaypoints = routeData.waypoints;
      }
    }

    const workout = rowToWorkout(workoutRow, routeWaypoints);

    // Fetch all samples (both types in one query)
    const { data: samplesData, error: samplesError } = await supabase
      .from("workout_samples")
      .select("*")
      .eq("workout_id", workoutId);

    if (samplesError) {
      logger.warn("Failed to fetch workout samples:", samplesError);
    }

    let hrSamples: HRSample[] = [];
    let cyclingSamples: CyclingSample[] = [];

    // Parse JSONB data back to typed arrays
    if (samplesData) {
      for (const row of samplesData as WorkoutSamplesRow[]) {
        if (row.sample_type === "heart_rate") {
          hrSamples = rowToHRSamples(row);
        } else if (row.sample_type === "cycling") {
          cyclingSamples = rowToCyclingSamples(row);
        }
      }
    }

    logger.debug(
      `Fetched workout with ${hrSamples.length} HR samples and ${cyclingSamples.length} cycling samples`,
    );

    return {
      ...workout,
      hrSamples,
      cyclingSamples,
    };
  }

  /**
   * Get all workouts for a user from Supabase (without samples)
   */
  async getWorkouts(
    userId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ workouts: WorkoutSession[]; total: number }> {
    logger.debug(
      `Fetching workouts for user (limit: ${limit}, offset: ${offset}):`,
      userId,
    );

    // Get total count
    const { count, error: countError } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      throw new Error(`Failed to count workouts: ${countError.message}`);
    }

    // Get workouts
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch workouts: ${error.message}`);
    }

    // Get unique route IDs from workouts
    const routeIds = [
      ...new Set(
        data
          .map((row) => (row as WorkoutRow).route_id)
          .filter((id): id is string => !!id),
      ),
    ];

    // Fetch route waypoints for all routes (if any)
    const routeWaypointsMap = new Map<string, any[]>();
    if (routeIds.length > 0) {
      const { data: routesData, error: routesError } = await supabase
        .from("routes")
        .select("id, waypoints")
        .in("id", routeIds);

      if (routesError) {
        logger.warn("Failed to fetch routes for workouts:", routesError);
      } else if (routesData) {
        for (const route of routesData) {
          routeWaypointsMap.set(route.id, route.waypoints);
        }
      }
    }

    const workouts = data.map((row) => {
      const workoutRow = row as WorkoutRow;
      const routeWaypoints = workoutRow.route_id
        ? routeWaypointsMap.get(workoutRow.route_id)
        : undefined;
      return rowToWorkout(workoutRow, routeWaypoints);
    });

    logger.info(
      `Fetched ${workouts.length} of ${count} total workouts for user:`,
      userId,
    );

    return {
      workouts,
      total: count || 0,
    };
  }

  /**
   * Update a workout in Supabase
   */
  async updateWorkout(
    workoutId: string,
    updates: Partial<WorkoutSession>,
  ): Promise<WorkoutSession> {
    logger.debug("Updating workout:", workoutId);

    // Convert updates to database format
    const dbUpdates: Partial<WorkoutRow> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title || null;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description || null;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.endTime !== undefined)
      dbUpdates.end_time = updates.endTime
        ? new Date(updates.endTime).toISOString()
        : null;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.avgHR !== undefined) dbUpdates.avg_hr = updates.avgHR || null;
    if (updates.maxHR !== undefined) dbUpdates.max_hr = updates.maxHR || null;
    if (updates.minHR !== undefined) dbUpdates.min_hr = updates.minHR || null;
    if (updates.calories !== undefined)
      dbUpdates.calories = updates.calories || null;

    const { data, error } = await supabase
      .from("workouts")
      .update(dbUpdates)
      .eq("id", workoutId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update workout: ${error.message}`);
    }

    logger.info("Workout updated successfully:", workoutId);
    return rowToWorkout(data as WorkoutRow);
  }

  /**
   * Delete a workout from Supabase (cascades to samples)
   */
  async deleteWorkout(workoutId: string): Promise<void> {
    logger.info("Deleting workout:", workoutId);

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) {
      throw new Error(`Failed to delete workout: ${error.message}`);
    }

    logger.info("Workout deleted successfully:", workoutId);
  }

  /**
   * Get HR samples for a workout
   */
  async getHRSamples(workoutId: string): Promise<HRSample[]> {
    logger.debug("Fetching HR samples for workout:", workoutId);

    const { data, error } = await supabase
      .from("workout_samples")
      .select("*")
      .eq("workout_id", workoutId)
      .eq("sample_type", "heart_rate")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No HR samples found
        return [];
      }
      throw new Error(`Failed to fetch HR samples: ${error.message}`);
    }

    return data ? rowToHRSamples(data as WorkoutSamplesRow) : [];
  }

  /**
   * Get cycling samples for a workout
   */
  async getCyclingSamples(workoutId: string): Promise<CyclingSample[]> {
    logger.debug("Fetching cycling samples for workout:", workoutId);

    const { data, error } = await supabase
      .from("workout_samples")
      .select("*")
      .eq("workout_id", workoutId)
      .eq("sample_type", "cycling")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No cycling samples found
        return [];
      }
      throw new Error(`Failed to fetch cycling samples: ${error.message}`);
    }

    return data ? rowToCyclingSamples(data as WorkoutSamplesRow) : [];
  }
}
