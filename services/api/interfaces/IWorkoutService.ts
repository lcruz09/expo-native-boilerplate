import { CyclingSample, HRSample, WorkoutSession } from "@/types/workout";

/**
 * Workout data for creating a new workout
 */
export interface CreateWorkoutData {
  workout: WorkoutSession;
  hrSamples: HRSample[];
  cyclingSamples: CyclingSample[];
}

/**
 * Complete workout data including samples
 */
export interface WorkoutWithSamples extends WorkoutSession {
  hrSamples: HRSample[];
  cyclingSamples: CyclingSample[];
}

/**
 * Workout Service Interface
 *
 * Vendor-agnostic interface for workout management operations.
 * Implementations handle storage and retrieval of workout sessions.
 */
export interface IWorkoutService {
  /**
   * Create a new workout with samples
   */
  createWorkout(
    userId: string,
    data: CreateWorkoutData,
  ): Promise<WorkoutSession>;

  /**
   * Get a workout by ID with samples
   */
  getWorkout(workoutId: string): Promise<WorkoutWithSamples | null>;

  /**
   * Get all workouts for a user (without samples, for list view)
   */
  getWorkouts(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<{
    workouts: WorkoutSession[];
    total: number;
  }>;

  /**
   * Update a workout (title, description, etc.)
   */
  updateWorkout(
    workoutId: string,
    updates: Partial<WorkoutSession>,
  ): Promise<WorkoutSession>;

  /**
   * Delete a workout (cascades to samples)
   */
  deleteWorkout(workoutId: string): Promise<void>;

  /**
   * Get HR samples for a workout
   */
  getHRSamples(workoutId: string): Promise<HRSample[]>;

  /**
   * Get cycling samples for a workout
   */
  getCyclingSamples(workoutId: string): Promise<CyclingSample[]>;
}
