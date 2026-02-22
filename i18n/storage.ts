import { storage } from '@/services/storage/kvStorage';
import type { SupportedLocale } from './config';

/**
 * Load saved locale from storage.
 *
 * @returns The saved locale or null if not found
 */
export const loadLocale = (): SupportedLocale | null => {
  const stored = storage.locale.getItemSync('locale');
  return stored ? (stored as SupportedLocale) : null;
};

/**
 * Save locale to storage.
 *
 * @param locale - The locale to save
 */
export const saveLocale = (locale: SupportedLocale): void => {
  storage.locale.setItemSync('locale', locale);
};
