import { WorkoutSession, WorkoutStatus } from "@/types/workout";
import { getWorkoutHistory, detectNewWorkout } from "../workoutHistory";

describe("getWorkoutHistory", () => {
  const completedWorkout1: WorkoutSession = {
    id: "1",
    type: "STRENGTH" as any,
    status: WorkoutStatus.COMPLETED,
    startTime: 1000,
    endTime: 2000,
    duration: 1000,
    avgHR: 0,
    maxHR: 0,
    minHR: 0,
    calories: 0,
    hrSamples: [],
  };

  const completedWorkout2: WorkoutSession = {
    id: "2",
    type: "HIIT" as any,
    status: WorkoutStatus.COMPLETED,
    startTime: 2000,
    endTime: 3000,
    duration: 1000,
    avgHR: 0,
    maxHR: 0,
    minHR: 0,
    calories: 0,
    hrSamples: [],
  };

  const activeWorkout: WorkoutSession = {
    id: "3",
    type: "STRENGTH" as any,
    status: WorkoutStatus.IN_PROGRESS,
    startTime: 3000,
    endTime: null,
    duration: 0,
    avgHR: 0,
    maxHR: 0,
    minHR: 0,
    calories: 0,
    hrSamples: [],
  };

  it("filters only completed workouts", () => {
    const workouts = [completedWorkout1, activeWorkout, completedWorkout2];
    const result = getWorkoutHistory(workouts);

    expect(result).toHaveLength(2);
    expect(result.every((w) => w.status === WorkoutStatus.COMPLETED)).toBe(
      true,
    );
  });

  it("sorts workouts by start time (newest first)", () => {
    const workouts = [completedWorkout1, completedWorkout2];
    const result = getWorkoutHistory(workouts);

    expect(result[0].id).toBe("2"); // startTime 2000
    expect(result[1].id).toBe("1"); // startTime 1000
  });

  it("handles empty array", () => {
    const result = getWorkoutHistory([]);
    expect(result).toHaveLength(0);
  });

  it("handles array with no completed workouts", () => {
    const result = getWorkoutHistory([activeWorkout]);
    expect(result).toHaveLength(0);
  });

  it("handles array with only completed workouts", () => {
    const workouts = [completedWorkout1, completedWorkout2];
    const result = getWorkoutHistory(workouts);

    expect(result).toHaveLength(2);
  });

  it("does not modify original array", () => {
    const workouts = [completedWorkout2, completedWorkout1];
    const originalOrder = [...workouts];

    getWorkoutHistory(workouts);

    expect(workouts).toEqual(originalOrder);
  });
});

describe("detectNewWorkout", () => {
  const workout1: WorkoutSession = {
    id: "1",
    type: "STRENGTH" as any,
    status: WorkoutStatus.COMPLETED,
    startTime: 1000,
    endTime: 2000,
    duration: 1000,
    avgHR: 0,
    maxHR: 0,
    minHR: 0,
    calories: 0,
    hrSamples: [],
  };

  const workout2: WorkoutSession = {
    id: "2",
    type: "HIIT" as any,
    status: WorkoutStatus.COMPLETED,
    startTime: 2000,
    endTime: 3000,
    duration: 1000,
    avgHR: 0,
    maxHR: 0,
    minHR: 0,
    calories: 0,
    hrSamples: [],
  };

  it("returns null on initial load", () => {
    const result = detectNewWorkout([workout1], null, true);

    expect(result.newWorkoutId).toBeNull();
    expect(result.updatedPreviousId).toBe("1");
  });

  it("detects new workout when first item changes", () => {
    const result = detectNewWorkout([workout2, workout1], "1", false);

    expect(result.newWorkoutId).toBe("2");
    expect(result.updatedPreviousId).toBe("2");
  });

  it("returns null when no change detected", () => {
    const result = detectNewWorkout([workout1], "1", false);

    expect(result.newWorkoutId).toBeNull();
    expect(result.updatedPreviousId).toBe("1");
  });

  it("handles empty workout array", () => {
    const result = detectNewWorkout([], "1", false);

    expect(result.newWorkoutId).toBeNull();
    expect(result.updatedPreviousId).toBe("1");
  });

  it("handles transition from empty to first workout", () => {
    const result = detectNewWorkout([workout1], null, false);

    expect(result.newWorkoutId).toBeNull();
    expect(result.updatedPreviousId).toBe("1");
  });

  it("detects new workout after initial load", () => {
    // Simulate: Initial load (no animation)
    const initial = detectNewWorkout([workout1], null, true);
    expect(initial.newWorkoutId).toBeNull();

    // Then new workout added (should animate)
    const updated = detectNewWorkout(
      [workout2, workout1],
      initial.updatedPreviousId,
      false,
    );
    expect(updated.newWorkoutId).toBe("2");
  });

  it("handles multiple workouts but same first item", () => {
    const result = detectNewWorkout([workout1, workout2], "1", false);

    expect(result.newWorkoutId).toBeNull();
    expect(result.updatedPreviousId).toBe("1");
  });
});
