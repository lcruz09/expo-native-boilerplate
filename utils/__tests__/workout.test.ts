import { WorkoutType } from "@/types/workout";
import {
  formatDate,
  formatDuration,
  formatTime,
  getWorkoutIcon,
  getWorkoutTypeLabelKey,
} from "../workout";

describe("Workout Utils", () => {
  describe("getWorkoutIcon", () => {
    it("returns correct icon for STRENGTH workout", () => {
      expect(getWorkoutIcon(WorkoutType.STRENGTH)).toBe("barbell-outline");
    });

    it("returns correct icon for HIIT workout", () => {
      expect(getWorkoutIcon(WorkoutType.HIIT)).toBe("flash-outline");
    });

    it("returns correct icon for INDOOR_CYCLING workout", () => {
      expect(getWorkoutIcon(WorkoutType.INDOOR_CYCLING)).toBe(
        "bicycle-outline",
      );
    });

    it("returns correct icon for INDOOR_RUNNING workout", () => {
      expect(getWorkoutIcon(WorkoutType.INDOOR_RUNNING)).toBe(
        "fitness-outline",
      );
    });

    it("returns correct icon for WALK_HIKE workout", () => {
      expect(getWorkoutIcon(WorkoutType.WALK_HIKE)).toBe("walk-outline");
    });

    it("returns correct icon for FITNESS_ACTIVITY workout", () => {
      expect(getWorkoutIcon(WorkoutType.FITNESS_ACTIVITY)).toBe(
        "barbell-outline",
      );
    });

    it("returns default icon for unknown workout type", () => {
      expect(getWorkoutIcon("UNKNOWN" as WorkoutType)).toBe("fitness-outline");
    });
  });

  describe("getWorkoutTypeLabelKey", () => {
    it("returns correct label key for STRENGTH workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.STRENGTH)).toBe(
        "workouts.typeStrength",
      );
    });

    it("returns correct label key for HIIT workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.HIIT)).toBe(
        "workouts.typeHIIT",
      );
    });

    it("returns correct label key for INDOOR_CYCLING workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.INDOOR_CYCLING)).toBe(
        "workouts.typeIndoorCycling",
      );
    });

    it("returns correct label key for INDOOR_RUNNING workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.INDOOR_RUNNING)).toBe(
        "workouts.typeIndoorRunning",
      );
    });

    it("returns correct label key for WALK_HIKE workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.WALK_HIKE)).toBe(
        "workouts.typeWalkHike",
      );
    });

    it("returns correct label key for FITNESS_ACTIVITY workout", () => {
      expect(getWorkoutTypeLabelKey(WorkoutType.FITNESS_ACTIVITY)).toBe(
        "workouts.typeFitnessActivity",
      );
    });

    it("returns default label key for unknown workout type", () => {
      expect(getWorkoutTypeLabelKey("UNKNOWN" as WorkoutType)).toBe(
        "workouts.typeOther",
      );
    });
  });

  describe("formatDuration", () => {
    it("formats seconds only (< 1 minute)", () => {
      expect(formatDuration(0)).toBe("00s");
      expect(formatDuration(30)).toBe("30s");
      expect(formatDuration(59)).toBe("59s");
    });

    it("formats minutes and seconds (< 1 hour)", () => {
      expect(formatDuration(60)).toBe("01m 00s");
      expect(formatDuration(90)).toBe("01m 30s");
      expect(formatDuration(3599)).toBe("59m 59s");
    });

    it("formats hours and minutes (>= 1 hour)", () => {
      expect(formatDuration(3600)).toBe("01h 00m");
      expect(formatDuration(5400)).toBe("01h 30m");
      expect(formatDuration(7200)).toBe("02h 00m");
      expect(formatDuration(7259)).toBe("02h 00m"); // Seconds are truncated for hours
    });

    it("pads single digits with zeros", () => {
      expect(formatDuration(65)).toBe("01m 05s");
      expect(formatDuration(3605)).toBe("01h 00m");
    });
  });

  describe("formatTime", () => {
    it("formats time correctly", () => {
      const date = new Date("2025-11-07T14:30:00");
      const result = formatTime(date);
      // Format may vary by locale, so just check structure
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("handles midnight", () => {
      const date = new Date("2025-11-07T00:00:00");
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("handles noon", () => {
      const date = new Date("2025-11-07T12:00:00");
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2025-11-07T14:30:00");
      const result = formatDate(date);
      // Format may vary by locale, but should include year, month, day
      expect(result).toMatch(/\d{4}/); // Year
      expect(result.length).toBeGreaterThan(8); // At least "M 7, 2025"
    });

    it("handles different months", () => {
      const date1 = new Date("2025-01-15T10:00:00");
      const date2 = new Date("2025-12-25T10:00:00");

      const result1 = formatDate(date1);
      const result2 = formatDate(date2);

      expect(result1).not.toBe(result2);
    });
  });
});
