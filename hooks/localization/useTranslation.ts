/**
 * useTranslation Hook
 *
 * Custom hook for accessing i18n translations throughout the app.
 * Provides type-safe access to translation keys.
 */

import { i18n, type SupportedLocale } from "../../i18n/config";
import type { Translations } from "../../i18n/locales/en";
import { useTranslationContext } from "../../providers/TranslationProvider";

/**
 * Type for nested translation keys
 * Converts nested object structure to dot-notation string type
 */
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];

type TranslationKey = NestedKeyOf<Translations>;

/**
 * Hook for accessing translations
 *
 * @example
 * ```typescript
 * const { t, locale, changeLocale } = useTranslation();
 *
 * // Use translation
 * <Text>{t('common.cancel')}</Text>
 *
 * // Change locale
 * changeLocale('es');
 * ```
 */
export const useTranslation = () => {
  const { locale, changeLocale, version } = useTranslationContext();

  /**
   * Translates a key to the current locale
   *
   * @param key - The translation key in dot notation
   * @param options - Optional interpolation options
   * @returns The translated string
   *
   * Note: This function reads from the global i18n instance.
   * The version dependency ensures re-renders when locale changes.
   */
  const t = (
    key: TranslationKey,
    options?: Record<string, string | number>,
  ) => {
    // Force dependency on version to ensure re-render when locale changes
    // This variable access ensures this component re-renders when version updates
    if (version < 0) return ""; // This will never be true, but creates the dependency
    return i18n.t(key, options);
  };

  /**
   * Checks if a specific locale is currently active
   *
   * @param checkLocale - The locale to check
   * @returns True if the locale is active
   */
  const isLocale = (checkLocale: SupportedLocale) => locale === checkLocale;

  return {
    t,
    locale,
    changeLocale,
    isLocale,
  };
};
