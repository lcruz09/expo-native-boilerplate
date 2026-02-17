import { SelectButton } from "@/components/atoms/SelectButton";
import { Typography } from "@/components/atoms/Typography";
import { ModalSelector } from "@/components/molecules/ModalSelector";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { SupportedLocale, supportedLocales } from "@/i18n/config";
import React, { useState } from "react";

export interface LanguageSwitcherProps {
  /**
   * Optional custom styling.
   */
  className?: string;
}

const languageNames: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  "pt-BR": "Português (BR)",
};

const languageFlags: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  de: "🇩🇪",
  ja: "🇯🇵",
  "pt-BR": "🇧🇷",
};

/**
 * Language switcher component with modal selection.
 *
 * Displays current language and opens a modal to select from all supported languages.
 *
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 */
export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { locale, changeLocale } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    changeLocale(newLocale);
    setModalVisible(false);
  };

  const languageOptions = supportedLocales.map((lang) => ({
    value: lang,
    label: languageNames[lang],
    icon: (
      <Typography variant="title" color="primary">
        {languageFlags[lang]}
      </Typography>
    ),
  }));

  return (
    <>
      <SelectButton
        label={languageNames[locale as SupportedLocale]}
        icon={
          <Typography variant="body" color="primary">
            {languageFlags[locale as SupportedLocale]}
          </Typography>
        }
        onPress={() => setModalVisible(true)}
        className={className}
      />

      <ModalSelector
        visible={modalVisible}
        title={t("settings.selectLanguage")}
        options={languageOptions}
        selectedValue={locale}
        onSelect={handleLanguageChange}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
