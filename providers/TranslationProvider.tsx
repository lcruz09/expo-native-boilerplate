import { i18n, supportedLocales, type SupportedLocale } from '@/i18n/config';
import { loadLocale, saveLocale } from '@/i18n/storage';
import { getLocales } from 'expo-localization';
import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface TranslationContextValue {
  locale: SupportedLocale;
  changeLocale: (newLocale: SupportedLocale) => void;
  // Force re-render counter to ensure all consumers update
  version: number;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

/**
 * Get the initial locale with the following priority:
 * 1. Saved locale from storage
 * 2. Device locale (if supported)
 * 3. English (fallback)
 */
const getInitialLocale = (): SupportedLocale => {
  // Try to load saved locale first
  const savedLocale = loadLocale();
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale;
  }

  // Fall back to device locale
  const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
  if (supportedLocales.includes(deviceLocale as SupportedLocale)) {
    return deviceLocale as SupportedLocale;
  }

  return 'en';
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  // Use lazy initialization to ensure getInitialLocale() only runs ONCE
  const [locale, setLocale] = useState<SupportedLocale>(() => {
    const initialLocale = getInitialLocale();
    // Set i18n locale synchronously during initialization
    i18n.locale = initialLocale;
    return initialLocale;
  });

  const [version, setVersion] = useState(0);

  const changeLocale = useCallback((newLocale: SupportedLocale) => {
    // Update i18n SYNCHRONOUSLY before state update
    i18n.locale = newLocale;

    // Save to storage
    saveLocale(newLocale);

    // Update state
    setLocale(newLocale);

    // Increment version to force all consumers to re-render
    setVersion((v) => v + 1);
  }, []);

  return (
    <TranslationContext.Provider value={{ locale, changeLocale, version }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};
