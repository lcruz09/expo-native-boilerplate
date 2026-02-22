import { I18n } from 'i18n-js';
import { en } from './locales/en';
import { es } from './locales/es';

/**
 * Initialize i18n with supported translations
 */
export const i18n = new I18n({
  en,
  es,
});

/**
 * Enable fallback to default language when a translation is missing
 */
i18n.enableFallback = true;

/**
 * Set default locale to English
 */
i18n.defaultLocale = 'en';

/**
 * Supported locales in the app
 */
export const supportedLocales = ['en', 'es'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];
