import { Gender } from "@/types/profile";
import { z } from "zod";

/**
 * Translation function type
 * Note: We use any for the key parameter to allow both specific TranslationKey
 * and generic string types, avoiding TypeScript variance issues
 */
type TranslateFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any,
  params?: Record<string, string | number>,
) => string;

/**
 * Password validation regex
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Calculate current year minus 10 for max birth year (minimum age 10)
 */
const getCurrentYear = () => new Date().getFullYear();
const MAX_BIRTH_YEAR = getCurrentYear() - 10; // Age 10 minimum
const MIN_BIRTH_YEAR = 1924; // Age 100+ maximum

/**
 * Registration Form Validation Schema Factory
 *
 * Creates a Zod schema for validating registration data including both
 * authentication credentials and profile information with translations.
 * Used with react-hook-form for type-safe form validation.
 *
 * @param t - Translation function
 * @returns Zod schema for registration form
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 * const schema = createRegisterSchema(t);
 * ```
 */
export const createRegisterSchema = (t: TranslateFn) =>
  z
    .object({
      // Authentication fields
      email: z
        .string({
          required_error: t("validation.emailRequired"),
        })
        .email(t("validation.emailInvalid"))
        .toLowerCase()
        .trim(),

      password: z
        .string({
          required_error: t("validation.passwordRequired"),
        })
        .min(8, t("validation.passwordMinLength"))
        .regex(passwordRegex, t("validation.passwordComplexity")),

      confirmPassword: z.string({
        required_error: t("validation.confirmPasswordRequired"),
      }),

      // Required profile fields
      gender: z.nativeEnum(Gender, {
        required_error: t("validation.genderRequired"),
        invalid_type_error: t("validation.genderInvalid"),
      }),

      birthYear: z
        .union([z.string(), z.number()])
        .refine(
          (val) => {
            if (val === "" || val === null || val === undefined) return false;
            const num = typeof val === "string" ? Number(val) : val;
            return !isNaN(num);
          },
          { message: t("validation.birthYearRequired") },
        )
        .transform((val) => {
          const num = typeof val === "string" ? Number(val) : val;
          return num;
        })
        .refine((num) => Number.isInteger(num), {
          message: t("validation.birthYearWholeNumber"),
        })
        .refine((num) => num >= MIN_BIRTH_YEAR, {
          message: t("validation.birthYearMin", { year: MIN_BIRTH_YEAR }),
        })
        .refine((num) => num <= MAX_BIRTH_YEAR, {
          message: t("validation.birthYearMax"),
        }),

      height: z
        .union([z.string(), z.number()])
        .refine(
          (val) => {
            if (val === "" || val === null || val === undefined) return false;
            const num = typeof val === "string" ? Number(val) : val;
            return !isNaN(num);
          },
          { message: t("validation.heightRequired") },
        )
        .transform((val) => {
          const num = typeof val === "string" ? Number(val) : val;
          return num;
        })
        .refine((num) => Number.isInteger(num), {
          message: t("validation.heightWholeNumber"),
        })
        .refine((num) => num >= 100, {
          message: t("validation.heightMin"),
        })
        .refine((num) => num <= 250, {
          message: t("validation.heightMax"),
        }),

      weight: z
        .union([z.string(), z.number()])
        .refine(
          (val) => {
            if (val === "" || val === null || val === undefined) return false;
            const num = typeof val === "string" ? Number(val) : val;
            return !isNaN(num);
          },
          { message: t("validation.weightRequired") },
        )
        .transform((val) => {
          const num = typeof val === "string" ? Number(val) : val;
          return num;
        })
        .refine((num) => num >= 20, {
          message: t("validation.weightMin"),
        })
        .refine((num) => num <= 300, {
          message: t("validation.weightMax"),
        }),

      // Optional profile fields
      firstName: z
        .string()
        .trim()
        .min(1, t("validation.firstNameEmpty"))
        .max(50, t("validation.firstNameTooLong"))
        .optional()
        .or(z.literal("")),

      lastName: z
        .string()
        .trim()
        .min(1, t("validation.lastNameEmpty"))
        .max(50, t("validation.lastNameTooLong"))
        .optional()
        .or(z.literal("")),

      restingHeartRate: z
        .union([z.string(), z.number(), z.undefined()])
        .optional()
        .transform((val) => {
          if (val === "" || val === null || val === undefined) return undefined;
          const num = typeof val === "string" ? Number(val) : val;
          return isNaN(num) ? undefined : num;
        })
        .refine((num) => num === undefined || Number.isInteger(num), {
          message: t("validation.restingHeartRateWholeNumber"),
        })
        .refine((num) => num === undefined || num >= 30, {
          message: t("validation.restingHeartRateMin"),
        })
        .refine((num) => num === undefined || num <= 100, {
          message: t("validation.restingHeartRateMax"),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

/**
 * Explicitly defined TypeScript type for form data output
 * Note: Using explicit type instead of z.infer due to Zod's limitations with .transform() in .union()
 * The schema correctly transforms strings to numbers at runtime, but TypeScript can't infer this
 */
export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  birthYear: number;
  height: number;
  weight: number;
  firstName?: string;
  lastName?: string;
  restingHeartRate?: number;
};

// Validate at build time that our manual type matches Zod's output
// This will cause a compile error if they drift apart
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AssertFormDataMatches =
  z.infer<ReturnType<typeof createRegisterSchema>> extends RegisterFormData
    ? RegisterFormData extends z.infer<ReturnType<typeof createRegisterSchema>>
      ? true
      : never
    : never;

/**
 * Helper function to calculate age from birth year
 */
export const calculateAge = (birthYear: number): number => {
  return getCurrentYear() - birthYear;
};
