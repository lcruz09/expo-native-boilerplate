import { formatNumber, formatNumberAuto } from "../formatNumber";

describe("formatNumber", () => {
  describe("with default parameters", () => {
    it("should format integer to 0 decimal places", () => {
      expect(formatNumber(123)).toBe("123");
    });

    it("should format decimal to 0 decimal places (rounds)", () => {
      expect(formatNumber(123.456)).toBe("123");
      expect(formatNumber(123.678)).toBe("124");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-123.456)).toBe("-123");
    });
  });

  describe("with custom decimal places", () => {
    it("should format to 1 decimal place", () => {
      expect(formatNumber(123.456, 1)).toBe("123.5");
    });

    it("should format to 2 decimal places", () => {
      expect(formatNumber(123.456, 2)).toBe("123.46");
    });

    it("should format to 3 decimal places", () => {
      expect(formatNumber(123.456789, 3)).toBe("123.457");
    });

    it("should pad with zeros if needed", () => {
      expect(formatNumber(123, 2)).toBe("123.00");
      expect(formatNumber(123.4, 2)).toBe("123.40");
    });
  });

  describe("with null/undefined values", () => {
    it("should return default '0' for null", () => {
      expect(formatNumber(null)).toBe("0");
    });

    it("should return default '0' for undefined", () => {
      expect(formatNumber(undefined)).toBe("0");
    });

    it("should return custom default for null", () => {
      expect(formatNumber(null, 0, "-")).toBe("-");
    });

    it("should return custom default for undefined", () => {
      expect(formatNumber(undefined, 2, "N/A")).toBe("N/A");
    });

    it("should return default with decimal places format", () => {
      expect(formatNumber(null, 2)).toBe("0");
      expect(formatNumber(undefined, 1)).toBe("0");
    });
  });

  describe("with NaN values", () => {
    it("should return default for NaN", () => {
      expect(formatNumber(NaN)).toBe("0");
    });

    it("should return custom default for NaN", () => {
      expect(formatNumber(NaN, 2, "Invalid")).toBe("Invalid");
    });
  });

  describe("edge cases", () => {
    it("should handle very small numbers", () => {
      expect(formatNumber(0.001, 3)).toBe("0.001");
      expect(formatNumber(0.0001, 4)).toBe("0.0001");
    });

    it("should handle very large numbers", () => {
      expect(formatNumber(1234567890, 0)).toBe("1234567890");
      expect(formatNumber(1234567890.123, 2)).toBe("1234567890.12");
    });

    it("should handle negative zero", () => {
      expect(formatNumber(-0)).toBe("0");
    });
  });
});

describe("formatNumberAuto", () => {
  describe("integer handling", () => {
    it("should format integers without decimals", () => {
      expect(formatNumberAuto(123)).toBe("123");
      expect(formatNumberAuto(1)).toBe("1");
      expect(formatNumberAuto(0)).toBe("0");
    });

    it("should format negative integers without decimals", () => {
      expect(formatNumberAuto(-123)).toBe("-123");
      expect(formatNumberAuto(-1)).toBe("-1");
    });
  });

  describe("small numbers (< 10)", () => {
    it("should format to 2 decimal places", () => {
      expect(formatNumberAuto(1.456)).toBe("1.46");
      expect(formatNumberAuto(9.999)).toBe("10.00");
      expect(formatNumberAuto(0.123)).toBe("0.12");
    });

    it("should format negative small numbers to 2 decimal places", () => {
      expect(formatNumberAuto(-1.456)).toBe("-1.46");
      expect(formatNumberAuto(-9.123)).toBe("-9.12");
    });
  });

  describe("medium numbers (10-100)", () => {
    it("should format to 1 decimal place", () => {
      expect(formatNumberAuto(12.456)).toBe("12.5");
      expect(formatNumberAuto(99.99)).toBe("100.0");
      expect(formatNumberAuto(10.1)).toBe("10.1");
    });

    it("should format negative medium numbers to 1 decimal place", () => {
      expect(formatNumberAuto(-12.456)).toBe("-12.5");
      expect(formatNumberAuto(-99.123)).toBe("-99.1");
    });
  });

  describe("large numbers (>= 100)", () => {
    it("should format to 0 decimal places", () => {
      expect(formatNumberAuto(123.456)).toBe("123");
      expect(formatNumberAuto(999.99)).toBe("1000");
      expect(formatNumberAuto(100.1)).toBe("100");
    });

    it("should format negative large numbers to 0 decimal places", () => {
      expect(formatNumberAuto(-123.456)).toBe("-123");
      expect(formatNumberAuto(-999.123)).toBe("-999");
    });
  });

  describe("with null/undefined values", () => {
    it("should return default '0' for null", () => {
      expect(formatNumberAuto(null)).toBe("0");
    });

    it("should return default '0' for undefined", () => {
      expect(formatNumberAuto(undefined)).toBe("0");
    });

    it("should return custom default for null", () => {
      expect(formatNumberAuto(null, "-")).toBe("-");
    });

    it("should return custom default for undefined", () => {
      expect(formatNumberAuto(undefined, "N/A")).toBe("N/A");
    });
  });

  describe("with NaN values", () => {
    it("should return default for NaN", () => {
      expect(formatNumberAuto(NaN)).toBe("0");
    });

    it("should return custom default for NaN", () => {
      expect(formatNumberAuto(NaN, "Invalid")).toBe("Invalid");
    });
  });

  describe("boundary cases", () => {
    it("should handle values exactly at thresholds", () => {
      expect(formatNumberAuto(10)).toBe("10");
      expect(formatNumberAuto(100)).toBe("100");
      expect(formatNumberAuto(10.0)).toBe("10");
      expect(formatNumberAuto(100.0)).toBe("100");
    });

    it("should handle values just below thresholds", () => {
      expect(formatNumberAuto(9.99)).toBe("9.99");
      expect(formatNumberAuto(99.99)).toBe("100.0");
    });

    it("should handle negative boundaries", () => {
      expect(formatNumberAuto(-10)).toBe("-10");
      expect(formatNumberAuto(-100)).toBe("-100");
      expect(formatNumberAuto(-9.99)).toBe("-9.99");
    });
  });

  describe("edge cases", () => {
    it("should handle very small decimal numbers", () => {
      expect(formatNumberAuto(0.001)).toBe("0.00");
      expect(formatNumberAuto(0.999)).toBe("1.00");
    });

    it("should handle very large numbers", () => {
      expect(formatNumberAuto(1234567890)).toBe("1234567890");
      expect(formatNumberAuto(1234567890.123)).toBe("1234567890");
    });

    it("should handle negative zero", () => {
      expect(formatNumberAuto(-0)).toBe("0");
    });
  });
});
