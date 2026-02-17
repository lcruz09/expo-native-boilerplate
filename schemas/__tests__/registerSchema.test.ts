/**
 * Tests for Registration Schema
 *
 * Validates all registration form validation rules including:
 * - Email validation
 * - Password validation and confirmation
 * - Required profile fields (gender, birth year, height, weight)
 * - Optional profile fields (first name, last name, resting heart rate)
 * - Translation function integration
 */

import { Gender } from "@/types/profile";
import { createRegisterSchema, RegisterFormData } from "../registerSchema";

// Mock translation function
const mockT = (key: string, params?: Record<string, string | number>) => {
  const translations: Record<string, string> = {
    "validation.emailRequired": "Email is required",
    "validation.emailInvalid": "Email is invalid",
    "validation.passwordRequired": "Password is required",
    "validation.passwordMinLength": `Password must be at least ${params?.min || 8} characters`,
    "validation.passwordComplexity":
      "Password must contain uppercase, lowercase, number and special character",
    "validation.confirmPasswordRequired": "Confirm password is required",
    "validation.passwordsDoNotMatch": "Passwords do not match",
    "validation.genderRequired": "Gender is required",
    "validation.genderInvalid": "Gender is invalid",
    "validation.birthYearRequired": "Birth year is required",
    "validation.birthYearInvalid": "Birth year must be a number",
    "validation.birthYearWholeNumber": "Birth year must be a whole number",
    "validation.birthYearMin": `Birth year must be ${params?.year} or later`,
    "validation.birthYearMax": "Birth year cannot be in the future",
    "validation.heightRequired": "Height is required",
    "validation.heightInvalid": "Height must be a number",
    "validation.heightMin": `Height must be at least ${params?.min} cm`,
    "validation.heightMax": `Height must be at most ${params?.max} cm`,
    "validation.weightRequired": "Weight is required",
    "validation.weightInvalid": "Weight must be a number",
    "validation.weightMin": `Weight must be at least ${params?.min} kg`,
    "validation.weightMax": `Weight must be at most ${params?.max} kg`,
    "validation.firstNameMax": `First name must be at most ${params?.max} characters`,
    "validation.lastNameMax": `Last name must be at most ${params?.max} characters`,
    "validation.restingHeartRateInvalid": "Resting heart rate must be a number",
    "validation.restingHeartRateWholeNumber":
      "Resting heart rate must be a whole number",
    "validation.restingHeartRateMin": `Resting heart rate must be at least ${params?.min} bpm`,
    "validation.restingHeartRateMax": `Resting heart rate must be at most ${params?.max} bpm`,
  };
  return translations[key] || key;
};

describe("createRegisterSchema", () => {
  const schema = createRegisterSchema(mockT);

  describe("Email Validation", () => {
    it("should accept valid email", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = {
        email: "invalid-email",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is invalid");
      }
    });

    it("should require email", () => {
      const data = {
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is required");
      }
    });

    it("should lowercase email", () => {
      const data: RegisterFormData = {
        email: "TEST@EXAMPLE.COM",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("test@example.com");
      }
    });
  });

  describe("Password Validation", () => {
    it("should require password", () => {
      const data = {
        email: "test@example.com",
        confirmPassword: "password123",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Password is required",
        );
      }
    });

    it("should enforce minimum password length", () => {
      const data = {
        email: "test@example.com",
        password: "Short1!", // Only 7 characters
        confirmPassword: "Short1!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Password must be at least",
        );
      }
    });

    it("should enforce password complexity", () => {
      const data = {
        email: "test@example.com",
        password: "simplepassword123", // No uppercase or special char
        confirmPassword: "simplepassword123",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("Password must contain"),
          ),
        ).toBe(true);
      }
    });

    it("should require password confirmation", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Confirm password is required",
        );
      }
    });

    it("should validate passwords match", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "DifferentPass456!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("Passwords do not match"),
          ),
        ).toBe(true);
      }
    });
  });

  describe("Gender Validation", () => {
    it("should accept valid gender", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.FEMALE,
        birthYear: 1990,
        height: 165,
        weight: 60,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should require gender", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Gender is required");
      }
    });

    it("should accept all gender options", () => {
      const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
      genders.forEach((gender) => {
        const data: RegisterFormData = {
          email: "test@example.com",
          password: "Password123!",
          confirmPassword: "Password123!",
          gender,
          birthYear: 1990,
          height: 175,
          weight: 70,
        };
        const result = schema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Birth Year Validation", () => {
    it("should accept valid birth year", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1995,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should convert string birth year to number", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: "1995",
        height: "175",
        weight: "70",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.birthYear).toBe("number");
        expect(result.data.birthYear).toBe(1995);
      }
    });

    it("should require birth year", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // When field is completely missing, union returns "Invalid input"
        const hasError = result.error.issues.some(
          (issue) =>
            issue.path.includes("birthYear") &&
            (issue.message.includes("Birth year") ||
              issue.message.includes("Invalid input")),
        );
        expect(hasError).toBe(true);
      }
    });

    it("should reject birth year too far in past", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1899,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Birth year must be");
      }
    });

    it("should reject future birth year", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: new Date().getFullYear() + 1,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Birth year cannot be in the future",
        );
      }
    });
  });

  describe("Height Validation", () => {
    it("should accept valid height", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 180,
        weight: 75,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should convert string height to number", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: "180",
        weight: "75",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.height).toBe("number");
        expect(result.data.height).toBe(180);
      }
    });

    it("should require height", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // When field is completely missing, union returns "Invalid input"
        const hasError = result.error.issues.some(
          (issue) =>
            issue.path.includes("height") &&
            (issue.message.includes("Height") ||
              issue.message.includes("Invalid input")),
        );
        expect(hasError).toBe(true);
      }
    });

    it("should reject height below minimum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 49,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Height must be at least",
        );
      }
    });

    it("should reject height above maximum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 251,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Height must be at most",
        );
      }
    });
  });

  describe("Weight Validation", () => {
    it("should accept valid weight", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 80,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should convert string weight to number", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: "175",
        weight: "80",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.weight).toBe("number");
        expect(result.data.weight).toBe(80);
      }
    });

    it("should require weight", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // When field is completely missing, union returns "Invalid input"
        const hasError = result.error.issues.some(
          (issue) =>
            issue.path.includes("weight") &&
            (issue.message.includes("Weight") ||
              issue.message.includes("Invalid input")),
        );
        expect(hasError).toBe(true);
      }
    });

    it("should reject weight below minimum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 19,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Weight must be at least",
        );
      }
    });

    it("should reject weight above maximum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 301,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Weight must be at most",
        );
      }
    });
  });

  describe("Optional Fields", () => {
    it("should accept valid first name", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        firstName: "John",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept valid last name", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        lastName: "Doe",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept valid resting heart rate", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        restingHeartRate: 60,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should convert string resting heart rate to number", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        restingHeartRate: "65",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.restingHeartRate).toBe("number");
        expect(result.data.restingHeartRate).toBe(65);
      }
    });

    it("should allow empty optional fields", () => {
      const data: RegisterFormData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBeUndefined();
        expect(result.data.lastName).toBeUndefined();
        expect(result.data.restingHeartRate).toBeUndefined();
      }
    });

    it("should reject resting heart rate below minimum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        restingHeartRate: 29,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Resting heart rate must be at least",
        );
      }
    });

    it("should reject resting heart rate above maximum", () => {
      const data = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 175,
        weight: 70,
        restingHeartRate: 101,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Resting heart rate must be at most",
        );
      }
    });
  });

  describe("Complete Form Validation", () => {
    it("should accept complete valid form data", () => {
      const data: RegisterFormData = {
        email: "john.doe@example.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
        gender: Gender.MALE,
        birthYear: 1990,
        height: 180,
        weight: 75,
        firstName: "John",
        lastName: "Doe",
        restingHeartRate: 60,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("should accept minimal valid form data", () => {
      const data: RegisterFormData = {
        email: "minimal@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
        gender: Gender.OTHER,
        birthYear: 2000,
        height: 170,
        weight: 65,
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
