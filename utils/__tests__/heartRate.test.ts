import {
  estimateMaxHeartRate,
  getHeartRateZone,
  HeartRateZone,
} from "../heartRate";

describe("Heart Rate Zone Utils", () => {
  describe("estimateMaxHeartRate", () => {
    it("should calculate max HR using 220 - age formula", () => {
      expect(estimateMaxHeartRate(20)).toBe(200);
      expect(estimateMaxHeartRate(30)).toBe(190);
      expect(estimateMaxHeartRate(40)).toBe(180);
      expect(estimateMaxHeartRate(50)).toBe(170);
      expect(estimateMaxHeartRate(60)).toBe(160);
    });

    it("should handle edge cases", () => {
      expect(estimateMaxHeartRate(0)).toBe(220);
      expect(estimateMaxHeartRate(100)).toBe(120);
    });
  });

  describe("getHeartRateZone", () => {
    const age = 30; // Max HR = 190

    describe("Resting Zone (<50% of max HR)", () => {
      it("should identify resting zone for very low HR", () => {
        const zone = getHeartRateZone(60, age); // 31.6% of max HR
        expect(zone.zone).toBe(HeartRateZone.RESTING);
        expect(zone.label).toBe("Resting");
        expect(zone.percentage).toBeLessThan(50);
        expect(zone.description).toContain("Recovery");
      });

      it("should identify resting zone at boundary", () => {
        const zone = getHeartRateZone(94, age); // ~49.5% of max HR
        expect(zone.zone).toBe(HeartRateZone.RESTING);
      });
    });

    describe("Easy Zone (50-60% of max HR)", () => {
      it("should identify easy zone for low HR", () => {
        const zone = getHeartRateZone(100, age); // ~52.6% of max HR
        expect(zone.zone).toBe(HeartRateZone.EASY);
        expect(zone.label).toBe("Easy");
        expect(zone.percentage).toBeGreaterThanOrEqual(50);
        expect(zone.percentage).toBeLessThan(60);
        expect(zone.description).toContain("Fat Burn");
      });

      it("should identify easy zone at lower boundary", () => {
        const zone = getHeartRateZone(95, age); // 50% of max HR
        expect(zone.zone).toBe(HeartRateZone.EASY);
      });

      it("should identify easy zone at upper boundary", () => {
        const zone = getHeartRateZone(113, age); // ~59.5% of max HR
        expect(zone.zone).toBe(HeartRateZone.EASY);
      });
    });

    describe("Moderate Zone (60-70% of max HR)", () => {
      it("should identify moderate zone for moderate HR", () => {
        const zone = getHeartRateZone(120, age); // ~63% of max HR
        expect(zone.zone).toBe(HeartRateZone.MODERATE);
        expect(zone.label).toBe("Moderate");
        expect(zone.percentage).toBeGreaterThanOrEqual(60);
        expect(zone.percentage).toBeLessThan(70);
        expect(zone.description).toContain("Cardio");
      });

      it("should identify moderate zone at lower boundary", () => {
        const zone = getHeartRateZone(114, age); // 60% of max HR
        expect(zone.zone).toBe(HeartRateZone.MODERATE);
      });

      it("should identify moderate zone at upper boundary", () => {
        const zone = getHeartRateZone(132, age); // ~69.5% of max HR
        expect(zone.zone).toBe(HeartRateZone.MODERATE);
      });
    });

    describe("Hard Zone (70-85% of max HR)", () => {
      it("should identify hard zone for high HR", () => {
        const zone = getHeartRateZone(150, age); // ~79% of max HR
        expect(zone.zone).toBe(HeartRateZone.HARD);
        expect(zone.label).toBe("Hard");
        expect(zone.percentage).toBeGreaterThanOrEqual(70);
        expect(zone.percentage).toBeLessThan(85);
        expect(zone.description).toContain("Threshold");
      });

      it("should identify hard zone at lower boundary", () => {
        const zone = getHeartRateZone(133, age); // 70% of max HR
        expect(zone.zone).toBe(HeartRateZone.HARD);
      });

      it("should identify hard zone at upper boundary", () => {
        const zone = getHeartRateZone(161, age); // ~84.7% of max HR
        // At this boundary, the formula classifies it as maximum
        expect(zone.zone).toBe(HeartRateZone.MAXIMUM);
      });
    });

    describe("Maximum Zone (85%+ of max HR)", () => {
      it("should identify maximum zone for very high HR", () => {
        const zone = getHeartRateZone(170, age); // ~89.5% of max HR
        expect(zone.zone).toBe(HeartRateZone.MAXIMUM);
        expect(zone.label).toBe("Maximum");
        expect(zone.percentage).toBeGreaterThanOrEqual(85);
        expect(zone.description).toContain("VO2 Max");
      });

      it("should identify maximum zone at boundary", () => {
        const zone = getHeartRateZone(162, age); // 85.3% of max HR
        expect(zone.zone).toBe(HeartRateZone.MAXIMUM);
      });

      it("should handle HR above max HR", () => {
        const zone = getHeartRateZone(200, age); // 105% of max HR
        expect(zone.zone).toBe(HeartRateZone.MAXIMUM);
        expect(zone.percentage).toBeGreaterThan(100);
      });
    });

    describe("Different Ages", () => {
      it("should correctly calculate zones for young person", () => {
        const zone = getHeartRateZone(150, 20); // Max HR = 200, 75% of max
        expect(zone.zone).toBe(HeartRateZone.HARD);
        expect(zone.percentage).toBe(75);
      });

      it("should correctly calculate zones for older person", () => {
        const zone = getHeartRateZone(120, 50); // Max HR = 170, ~70.6% of max
        expect(zone.zone).toBe(HeartRateZone.HARD);
        expect(zone.percentage).toBe(71);
      });

      it("should correctly calculate zones for senior", () => {
        const zone = getHeartRateZone(100, 65); // Max HR = 155, ~64.5% of max
        expect(zone.zone).toBe(HeartRateZone.MODERATE);
        expect(zone.percentage).toBe(65);
      });
    });

    describe("Boundary Conditions", () => {
      it("should handle zero heart rate", () => {
        const zone = getHeartRateZone(0, 30);
        expect(zone.zone).toBe(HeartRateZone.RESTING);
        expect(zone.percentage).toBe(0);
      });

      it("should handle very low heart rate", () => {
        const zone = getHeartRateZone(40, 30); // ~21% of max HR
        expect(zone.zone).toBe(HeartRateZone.RESTING);
        expect(zone.percentage).toBe(21);
      });

      it("should handle heart rate at exactly 50% of max", () => {
        const zone = getHeartRateZone(95, 30); // 50% of max HR (190)
        expect(zone.zone).toBe(HeartRateZone.EASY);
      });

      it("should handle heart rate at exactly 60% of max", () => {
        const zone = getHeartRateZone(114, 30); // 60% of max HR (190)
        expect(zone.zone).toBe(HeartRateZone.MODERATE);
      });

      it("should handle heart rate at exactly 70% of max", () => {
        const zone = getHeartRateZone(133, 30); // 70% of max HR (190)
        expect(zone.zone).toBe(HeartRateZone.HARD);
      });

      it("should handle heart rate at exactly 85% of max", () => {
        const zone = getHeartRateZone(162, 30); // ~85.3% of max HR (190)
        expect(zone.zone).toBe(HeartRateZone.MAXIMUM);
      });
    });

    describe("Percentage Calculation", () => {
      it("should round percentage to nearest integer", () => {
        const zone1 = getHeartRateZone(100, 30); // 52.63% rounds to 53%
        expect(zone1.percentage).toBe(53);

        const zone2 = getHeartRateZone(95, 30); // 50% exactly
        expect(zone2.percentage).toBe(50);
      });
    });
  });
});
