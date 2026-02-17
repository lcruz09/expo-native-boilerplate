import { z } from "zod";

/**
 * Translation function type
 * Note: We use any for the key parameter to allow both specific TranslationKey
 * and generic string types, avoiding TypeScript variance issues
 */
type TranslateFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any,
  options?: Record<string, string | number>,
) => string;

/**
 * Login Form Validation Schema Factory
 *
 * Creates a Zod schema for validating login credentials with translations.
 * Used with react-hook-form for type-safe form validation.
 *
 * @param t - Translation function
 * @returns Zod schema for login form
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 * const schema = createLoginSchema(t);
 * ```
 */
export const createLoginSchema = (t: TranslateFn) =>
  z.object({
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
      .min(1, t("validation.passwordRequired")),
  });

/**
 * Inferred TypeScript type from schema
 */
export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
