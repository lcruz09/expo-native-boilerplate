/**
 * Tests for Login Schema
 *
 * Validates login form validation rules including:
 * - Email validation
 * - Password requirement
 * - Translation function integration
 */

import { createLoginSchema, LoginFormData } from "../loginSchema";

// Mock translation function
const mockT = (key: string, params?: Record<string, string | number>) => {
  const translations: Record<string, string> = {
    "validation.emailRequired": "Email is required",
    "validation.emailInvalid": "Email is invalid",
    "validation.passwordRequired": "Password is required",
  };
  return translations[key] || key;
};

describe("createLoginSchema", () => {
  const schema = createLoginSchema(mockT);

  describe("Email Validation", () => {
    it("should accept valid email", () => {
      const data: LoginFormData = {
        email: "test@example.com",
        password: "password123",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = {
        email: "invalid-email",
        password: "password123",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is invalid");
      }
    });

    it("should require email", () => {
      const data = {
        password: "password123",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is required");
      }
    });

    it("should reject empty email", () => {
      const data = {
        email: "",
        password: "password123",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Email is invalid");
      }
    });

    it("should lowercase email", () => {
      const data: LoginFormData = {
        email: "TEST@EXAMPLE.COM",
        password: "password123",
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
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Password is required",
        );
      }
    });

    it("should reject empty password", () => {
      const data = {
        email: "test@example.com",
        password: "",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Password is required",
        );
      }
    });

    it("should accept any non-empty password", () => {
      const passwords = [
        "short",
        "averagePassword123",
        "very-long-password-with-special-chars!@#$%",
        "123456",
        "p",
      ];

      passwords.forEach((password) => {
        const data: LoginFormData = {
          email: "test@example.com",
          password,
        };
        const result = schema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Complete Form Validation", () => {
    it("should accept valid login credentials", () => {
      const data: LoginFormData = {
        email: "user@example.com",
        password: "SecurePassword123!",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "user@example.com",
          password: "SecurePassword123!",
        });
      }
    });

    it("should handle case-insensitive email", () => {
      const data: LoginFormData = {
        email: "UsEr@ExAmPlE.CoM",
        password: "password",
      };
      const result = schema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
        expect(result.data.password).toBe("password");
      }
    });
  });

  describe("Error Messages", () => {
    it("should use translation function for error messages", () => {
      const customT = jest.fn((key: string) => `TRANSLATED_${key}`);
      const customSchema = createLoginSchema(customT);

      const data = {
        email: "",
        password: "",
      };

      customSchema.safeParse(data);

      expect(customT).toHaveBeenCalled();
      expect(customT).toHaveBeenCalledWith(
        expect.stringContaining("validation."),
      );
    });
  });
});
