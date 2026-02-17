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
 * Profile Form Validation Schema Factory
 *
 * Creates a Zod schema for validating user profile data in forms with translations.
 * Used with react-hook-form for type-safe form validation.
 *
 * @param t - Translation function
 * @returns Zod schema for profile form
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 * const schema = createProfileSchema(t);
 * ```
 */
const getCurrentYear = () => new Date().getFullYear();
const MAX_BIRTH_YEAR = getCurrentYear() - 10; // Age 10 minimum
const MIN_BIRTH_YEAR = 1924; // Age 100+ maximum

export const createProfileSchema = (t: TranslateFn) =>
  z.object({
    birthYear: z
      .number({
        required_error: t("validation.birthYearRequired"),
        invalid_type_error: t("validation.birthYearInvalid"),
      })
      .int(t("validation.birthYearWholeNumber"))
      .min(
        MIN_BIRTH_YEAR,
        t("validation.birthYearMin", { year: MIN_BIRTH_YEAR }),
      )
      .max(MAX_BIRTH_YEAR, t("validation.birthYearMax")),

    weight: z
      .number({
        required_error: t("validation.weightRequired"),
        invalid_type_error: t("validation.weightInvalid"),
      })
      .min(20, t("validation.weightMin"))
      .max(300, t("validation.weightMax")),

    height: z
      .number({
        required_error: t("validation.heightRequired"),
        invalid_type_error: t("validation.heightInvalid"),
      })
      .int(t("validation.heightWholeNumber"))
      .min(100, t("validation.heightMin"))
      .max(250, t("validation.heightMax")),

    gender: z.nativeEnum(Gender, {
      required_error: t("validation.genderRequired"),
      invalid_type_error: t("validation.genderInvalid"),
    }),

    restingHeartRate: z
      .number({
        invalid_type_error: t("validation.restingHeartRateInvalid"),
      })
      .int(t("validation.restingHeartRateWholeNumber"))
      .min(30, t("validation.restingHeartRateMin"))
      .max(100, t("validation.restingHeartRateMax"))
      .optional()
      .or(z.literal(undefined))
      .or(z.nan().transform(() => undefined)),
  });

/**
 * Inferred TypeScript type from schema
 */
export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;
