/**
 * Internationalization (i18n) Configuration
 *
 * This file sets up the i18n instance with all supported languages
 * and their translations.
 *
 * Note: The locale is managed by TranslationProvider and should not be set here.
 */

import { I18n } from "i18n-js";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { ja } from "./locales/ja";
import { ptBR } from "./locales/pt-BR";

/**
 * Initialize i18n with all translations
 */
export const i18n = new I18n({
  en,
  es,
  de,
  ja,
  "pt-BR": ptBR,
});

/**
 * Enable fallback to default language when a translation is missing
 */
i18n.enableFallback = true;

/**
 * Set default locale to English
 */
i18n.defaultLocale = "en";

/**
 * Supported locales in the app
 */
export const supportedLocales = ["en", "es", "de", "ja", "pt-BR"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];
