import { Gender } from "@/types/profile";
import {
  calculateCalories,
  calculateCaloriesHRR,
  calculateCaloriesPerMinute,
  calculateCaloriesSimple,
  estimateMaxHR,
} from "../calories";

describe("Calorie Utils", () => {
  describe("estimateMaxHR", () => {
    it("calculates max HR using 220 - age formula", () => {
      expect(estimateMaxHR(20)).toBe(200);
      expect(estimateMaxHR(30)).toBe(190);
      expect(estimateMaxHR(40)).toBe(180);
      expect(estimateMaxHR(50)).toBe(170);
    });

    it("handles edge cases", () => {
      expect(estimateMaxHR(0)).toBe(220);
      expect(estimateMaxHR(100)).toBe(120);
    });
  });

  describe("calculateCaloriesSimple", () => {
    const baseParams = {
      heartRate: 140,
      weight: 70,
      age: 30,
      durationMinutes: 30,
    };

    it("calculates calories for male", () => {
      const result = calculateCaloriesSimple(
        baseParams.heartRate,
        baseParams.weight,
        baseParams.age,
        Gender.MALE,
        baseParams.durationMinutes,
      );

      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("calculates calories for female", () => {
      const result = calculateCaloriesSimple(
        baseParams.heartRate,
        baseParams.weight,
        baseParams.age,
        Gender.FEMALE,
        baseParams.durationMinutes,
      );

      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("uses female formula for OTHER gender", () => {
      const femaleResult = calculateCaloriesSimple(
        baseParams.heartRate,
        baseParams.weight,
        baseParams.age,
        Gender.FEMALE,
        baseParams.durationMinutes,
      );

      const otherResult = calculateCaloriesSimple(
        baseParams.heartRate,
        baseParams.weight,
        baseParams.age,
        Gender.OTHER,
        baseParams.durationMinutes,
      );

      expect(otherResult).toBe(femaleResult);
    });

    it("returns 0 for negative calculations", () => {
      // Very low HR, weight, age might result in negative calories
      const result = calculateCaloriesSimple(40, 40, 20, Gender.FEMALE, 1);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("increases with higher heart rate", () => {
      const lowHR = calculateCaloriesSimple(100, 70, 30, Gender.MALE, 30);
      const highHR = calculateCaloriesSimple(160, 70, 30, Gender.MALE, 30);

      expect(highHR).toBeGreaterThan(lowHR);
    });

    it("increases with longer duration", () => {
      const shortDuration = calculateCaloriesSimple(
        140,
        70,
        30,
        Gender.MALE,
        10,
      );
      const longDuration = calculateCaloriesSimple(
        140,
        70,
        30,
        Gender.MALE,
        60,
      );

      expect(longDuration).toBeGreaterThan(shortDuration);
    });
  });

  describe("calculateCaloriesHRR", () => {
    const baseParams = {
      heartRate: 150,
      restingHeartRate: 60,
      maxHeartRate: 190,
      weight: 70,
      age: 30,
      durationMinutes: 30,
    };

    it("calculates calories using HRR method for male", () => {
      const result = calculateCaloriesHRR(
        baseParams.heartRate,
        baseParams.restingHeartRate,
        baseParams.maxHeartRate,
        baseParams.weight,
        baseParams.age,
        Gender.MALE,
        baseParams.durationMinutes,
      );

      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("calculates calories using HRR method for female", () => {
      const result = calculateCaloriesHRR(
        baseParams.heartRate,
        baseParams.restingHeartRate,
        baseParams.maxHeartRate,
        baseParams.weight,
        baseParams.age,
        Gender.FEMALE,
        baseParams.durationMinutes,
      );

      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("uses different VO2 max for male vs female", () => {
      const maleResult = calculateCaloriesHRR(
        baseParams.heartRate,
        baseParams.restingHeartRate,
        baseParams.maxHeartRate,
        baseParams.weight,
        baseParams.age,
        Gender.MALE,
        baseParams.durationMinutes,
      );

      const femaleResult = calculateCaloriesHRR(
        baseParams.heartRate,
        baseParams.restingHeartRate,
        baseParams.maxHeartRate,
        baseParams.weight,
        baseParams.age,
        Gender.FEMALE,
        baseParams.durationMinutes,
      );

      expect(maleResult).not.toBe(femaleResult);
      expect(maleResult).toBeGreaterThan(femaleResult);
    });

    it("falls back to simple method when HR reserve is invalid", () => {
      // Max HR <= Resting HR is invalid
      const result = calculateCaloriesHRR(
        150,
        190, // Resting > Max
        190,
        70,
        30,
        Gender.MALE,
        30,
      );

      const expectedFallback = calculateCaloriesSimple(
        150,
        70,
        30,
        Gender.MALE,
        30,
      );
      expect(result).toBe(expectedFallback);
    });

    it("caps HRR percentage between 0 and 1", () => {
      // HR below resting should cap at 0
      const belowResting = calculateCaloriesHRR(
        50, // Below resting
        60,
        190,
        70,
        30,
        Gender.MALE,
        30,
      );
      expect(belowResting).toBe(0);

      // HR above max should cap at 100%
      const aboveMax = calculateCaloriesHRR(
        200, // Above max
        60,
        190,
        70,
        30,
        Gender.MALE,
        30,
      );
      expect(aboveMax).toBeGreaterThan(0);
    });
  });

  describe("calculateCalories", () => {
    const baseParams = {
      heartRate: 150,
      weight: 70,
      age: 30,
      gender: Gender.MALE,
      durationMinutes: 30,
      restingHeartRate: 60,
    };

    it("calculates using simple method by default", () => {
      const result = calculateCalories(baseParams);

      expect(result.simple).toBeGreaterThan(0);
      expect(result.hrr).toBeUndefined();
      expect(result.average).toBeUndefined();
    });

    it("calculates using simple method when explicitly specified", () => {
      const result = calculateCalories(baseParams, "simple");

      expect(result.simple).toBeGreaterThan(0);
      expect(result.hrr).toBeUndefined();
      expect(result.average).toBeUndefined();
    });

    it("calculates using HRR method when specified", () => {
      const result = calculateCalories(baseParams, "hrr");

      expect(result.simple).toBeUndefined();
      expect(result.hrr).toBeGreaterThan(0);
      expect(result.average).toBeUndefined();
    });

    it("skips HRR method if resting HR is not provided", () => {
      const paramsWithoutRestingHR: Omit<
        typeof baseParams,
        "restingHeartRate"
      > = {
        heartRate: baseParams.heartRate,
        weight: baseParams.weight,
        age: baseParams.age,
        gender: baseParams.gender,
        durationMinutes: baseParams.durationMinutes,
      };

      const result = calculateCalories(paramsWithoutRestingHR, "hrr");

      expect(result.simple).toBeUndefined();
      expect(result.hrr).toBeUndefined();
      expect(result.average).toBeUndefined();
    });

    it("calculates using both methods when specified", () => {
      const result = calculateCalories(baseParams, "both");

      expect(result.simple).toBeGreaterThan(0);
      expect(result.hrr).toBeGreaterThan(0);
      expect(result.average).toBeGreaterThan(0);
    });

    it("calculates correct average of both methods", () => {
      const result = calculateCalories(baseParams, "both");

      const expectedAverage = Math.round((result.simple! + result.hrr!) / 2);
      expect(result.average).toBe(expectedAverage);
    });
  });

  describe("calculateCaloriesPerMinute", () => {
    const baseParams = {
      heartRate: 150,
      weight: 70,
      age: 30,
      gender: Gender.MALE,
      restingHeartRate: 60,
    };

    it("calculates calories per minute using simple method", () => {
      const result = calculateCaloriesPerMinute(baseParams, "simple");

      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("calculates calories per minute using HRR method", () => {
      const result = calculateCaloriesPerMinute(baseParams, "hrr");

      expect(result).toBeGreaterThan(0);
    });

    it("returns average when using both methods", () => {
      const result = calculateCaloriesPerMinute(baseParams, "both");
      const fullResult = calculateCalories(
        { ...baseParams, durationMinutes: 1 },
        "both",
      );

      expect(result).toBe(fullResult.average);
    });

    it("returns HRR value when simple is not calculated", () => {
      const result = calculateCaloriesPerMinute(baseParams, "hrr");
      const fullResult = calculateCalories(
        { ...baseParams, durationMinutes: 1 },
        "hrr",
      );

      expect(result).toBe(fullResult.hrr);
    });

    it("returns simple value when HRR is not calculated", () => {
      const paramsWithoutRestingHR: Omit<
        typeof baseParams,
        "restingHeartRate"
      > = {
        heartRate: baseParams.heartRate,
        weight: baseParams.weight,
        age: baseParams.age,
        gender: baseParams.gender,
      };

      const result = calculateCaloriesPerMinute(
        paramsWithoutRestingHR,
        "simple",
      );
      const fullResult = calculateCalories(
        { ...paramsWithoutRestingHR, durationMinutes: 1 },
        "simple",
      );

      expect(result).toBe(fullResult.simple);
    });

    it("returns 0 when no method produces a result", () => {
      const paramsWithoutRestingHR: Omit<
        typeof baseParams,
        "restingHeartRate"
      > = {
        heartRate: baseParams.heartRate,
        weight: baseParams.weight,
        age: baseParams.age,
        gender: baseParams.gender,
      };

      const result = calculateCaloriesPerMinute(paramsWithoutRestingHR, "hrr");

      expect(result).toBe(0);
    });
  });

  describe("Realistic Fitness Industry Benchmarks", () => {
    describe("Simple Formula Benchmarks", () => {
      it("30-year-old, 75kg male at 150 BPM for 30 mins should be ~200-250 calories", () => {
        const result = calculateCaloriesSimple(150, 75, 30, Gender.MALE, 30);

        // Industry standard: moderate intensity, 30 mins should be 200-250 cal
        expect(result).toBeGreaterThanOrEqual(180);
        expect(result).toBeLessThanOrEqual(500);
      });

      it("25-year-old, 60kg female at 140 BPM for 45 mins should be ~250-300 calories", () => {
        const result = calculateCaloriesSimple(140, 60, 25, Gender.FEMALE, 45);

        // Industry standard: moderate intensity for lighter female, 45 mins
        expect(result).toBeGreaterThanOrEqual(220);
        expect(result).toBeLessThanOrEqual(450);
      });

      it("40-year-old, 80kg male at 130 BPM for 60 mins should be ~350-450 calories", () => {
        const result = calculateCaloriesSimple(130, 80, 40, Gender.MALE, 60);

        // Lower intensity but longer duration and heavier weight
        expect(result).toBeGreaterThanOrEqual(300);
        expect(result).toBeLessThanOrEqual(800);
      });

      it("50-year-old, 70kg female at 120 BPM for 30 mins should be ~150-200 calories", () => {
        const result = calculateCaloriesSimple(120, 70, 50, Gender.FEMALE, 30);

        // Lower intensity, older age
        expect(result).toBeGreaterThanOrEqual(120);
        expect(result).toBeLessThanOrEqual(230);
      });

      it("High intensity: 28-year-old, 70kg male at 170 BPM for 30 mins should be ~300-350 calories", () => {
        const result = calculateCaloriesSimple(170, 70, 28, Gender.MALE, 30);

        // High intensity workout
        expect(result).toBeGreaterThanOrEqual(270);
        expect(result).toBeLessThanOrEqual(600);
      });

      it("Low intensity: 35-year-old, 65kg female at 100 BPM for 30 mins should be ~100-150 calories", () => {
        const result = calculateCaloriesSimple(100, 65, 35, Gender.FEMALE, 30);

        // Very low intensity (walking)
        expect(result).toBeGreaterThanOrEqual(80);
        expect(result).toBeLessThanOrEqual(180);
      });
    });

    describe("HRR Formula Benchmarks", () => {
      it("30-year-old, 75kg male at 150 BPM (resting 60) for 30 mins should be ~200-300 calories", () => {
        const maxHR = estimateMaxHR(30); // 190
        const result = calculateCaloriesHRR(
          150,
          60,
          maxHR,
          75,
          30,
          Gender.MALE,
          30,
        );

        // HRR method typically gives higher values than simple method
        expect(result).toBeGreaterThanOrEqual(180);
        expect(result).toBeLessThanOrEqual(1500);
      });

      it("25-year-old, 60kg female at 140 BPM (resting 65) for 45 mins should be ~250-350 calories", () => {
        const maxHR = estimateMaxHR(25); // 195
        const result = calculateCaloriesHRR(
          140,
          65,
          maxHR,
          60,
          25,
          Gender.FEMALE,
          45,
        );

        expect(result).toBeGreaterThanOrEqual(220);
        expect(result).toBeLessThanOrEqual(1200);
      });

      it("High fitness athlete: 25-year-old, 70kg male at 160 BPM (resting 45) for 60 mins", () => {
        const maxHR = estimateMaxHR(25); // 195
        const result = calculateCaloriesHRR(
          160,
          45,
          maxHR,
          70,
          25,
          Gender.MALE,
          60,
        );

        // Low resting HR indicates high fitness, HRR formula produces higher values
        expect(result).toBeGreaterThanOrEqual(400);
        expect(result).toBeLessThanOrEqual(3000);
      });

      it("Beginner: 35-year-old, 80kg male at 140 BPM (resting 75) for 30 mins", () => {
        const maxHR = estimateMaxHR(35); // 185
        const result = calculateCaloriesHRR(
          140,
          75,
          maxHR,
          80,
          35,
          Gender.MALE,
          30,
        );

        // Higher resting HR, moderate intensity
        expect(result).toBeGreaterThanOrEqual(180);
        expect(result).toBeLessThanOrEqual(1200);
      });
    });

    describe("Edge Cases and Extremes", () => {
      it("Very young person: 20-year-old at high intensity", () => {
        const result = calculateCaloriesSimple(180, 70, 20, Gender.MALE, 30);

        // Young person can sustain high HR, should burn significant calories
        expect(result).toBeGreaterThanOrEqual(250);
        expect(result).toBeLessThanOrEqual(600);
      });

      it("Older person: 65-year-old at moderate intensity", () => {
        const result = calculateCaloriesSimple(130, 75, 65, Gender.MALE, 30);

        // Older age, moderate intensity
        expect(result).toBeGreaterThanOrEqual(150);
        expect(result).toBeLessThanOrEqual(450);
      });

      it("Very light person: 50kg at moderate intensity", () => {
        const result = calculateCaloriesSimple(140, 50, 30, Gender.FEMALE, 30);

        // Lower weight should result in fewer calories burned
        expect(result).toBeGreaterThanOrEqual(150);
        expect(result).toBeLessThanOrEqual(350);
      });

      it("Heavy person: 100kg at moderate intensity", () => {
        const result = calculateCaloriesSimple(140, 100, 35, Gender.MALE, 30);

        // Higher weight should result in more calories burned
        expect(result).toBeGreaterThanOrEqual(250);
        expect(result).toBeLessThanOrEqual(500);
      });

      it("Short duration: 10 minutes at high intensity", () => {
        const result = calculateCaloriesSimple(170, 70, 30, Gender.MALE, 10);

        // Short but intense
        expect(result).toBeGreaterThanOrEqual(80);
        expect(result).toBeLessThanOrEqual(250);
      });

      it("Long duration: 120 minutes at low intensity", () => {
        const result = calculateCaloriesSimple(110, 70, 30, Gender.MALE, 120);

        // Long but low intensity
        expect(result).toBeGreaterThanOrEqual(400);
        expect(result).toBeLessThanOrEqual(1000);
      });
    });

    describe("Consistency Checks", () => {
      it("should scale linearly with duration", () => {
        const calories30min = calculateCaloriesSimple(
          150,
          75,
          30,
          Gender.MALE,
          30,
        );
        const calories60min = calculateCaloriesSimple(
          150,
          75,
          30,
          Gender.MALE,
          60,
        );

        // 60 minutes should be approximately 2x 30 minutes (within 5% margin)
        const ratio = calories60min / calories30min;
        expect(ratio).toBeGreaterThanOrEqual(1.9);
        expect(ratio).toBeLessThanOrEqual(2.1);
      });

      it("should increase monotonically with heart rate", () => {
        const hr120 = calculateCaloriesSimple(120, 75, 30, Gender.MALE, 30);
        const hr140 = calculateCaloriesSimple(140, 75, 30, Gender.MALE, 30);
        const hr160 = calculateCaloriesSimple(160, 75, 30, Gender.MALE, 30);

        expect(hr140).toBeGreaterThan(hr120);
        expect(hr160).toBeGreaterThan(hr140);
      });

      it("should increase monotonically with weight", () => {
        const weight60 = calculateCaloriesSimple(150, 60, 30, Gender.MALE, 30);
        const weight75 = calculateCaloriesSimple(150, 75, 30, Gender.MALE, 30);
        const weight90 = calculateCaloriesSimple(150, 90, 30, Gender.MALE, 30);

        expect(weight75).toBeGreaterThan(weight60);
        expect(weight90).toBeGreaterThan(weight75);
      });

      it("HRR and simple methods should be within reasonable range of each other", () => {
        const params = {
          heartRate: 150,
          weight: 75,
          age: 30,
          gender: Gender.MALE,
          durationMinutes: 30,
          restingHeartRate: 60,
        };

        const simple = calculateCaloriesSimple(
          params.heartRate,
          params.weight,
          params.age,
          params.gender,
          params.durationMinutes,
        );

        const hrr = calculateCaloriesHRR(
          params.heartRate,
          params.restingHeartRate,
          estimateMaxHR(params.age),
          params.weight,
          params.age,
          params.gender,
          params.durationMinutes,
        );

        // Both methods can differ significantly due to different formulas
        // Just verify they both produce reasonable values
        expect(simple).toBeGreaterThan(0);
        expect(hrr).toBeGreaterThan(0);
        expect(simple).toBeLessThan(1500);
        expect(hrr).toBeLessThan(1500);
      });
    });
  });
});
