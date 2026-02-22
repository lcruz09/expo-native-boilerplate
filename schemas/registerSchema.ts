import { z } from 'zod';

/**
 * Translation function type
 */
type TranslateFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any,
  params?: Record<string, string | number>
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
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Registration Form Validation Schema Factory
 *
 * Creates a Zod schema for validating registration data.
 * Used with react-hook-form for type-safe form validation.
 */
export const createRegisterSchema = (t: TranslateFn) =>
  z
    .object({
      // Authentication fields
      email: z
        .string({
          required_error: t('validation.emailRequired'),
        })
        .email(t('validation.emailInvalid'))
        .toLowerCase()
        .trim(),

      password: z
        .string({
          required_error: t('validation.passwordRequired'),
        })
        .min(8, t('validation.passwordMinLength'))
        .regex(passwordRegex, t('validation.passwordComplexity')),

      confirmPassword: z.string({
        required_error: t('validation.confirmPasswordRequired'),
      }),

      // Profile fields
      firstName: z
        .string()
        .trim()
        .max(50, t('validation.firstNameTooLong'))
        .optional()
        .or(z.literal('')),

      lastName: z
        .string()
        .trim()
        .max(50, t('validation.lastNameTooLong'))
        .optional()
        .or(z.literal('')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

/**
 * Inferred TypeScript type from schema
 */
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
