import { IconButton } from '@/components/molecules/IconButton';
import { PageLayout } from '@/components/organisms/PageLayout';
import { useAuth } from '@/hooks/api/useAuth';
import { useTranslation } from '@/hooks/localization/useTranslation';
import { useColors } from '@/hooks/theme/useColors';
import { type SupportedLocale } from '@/i18n/config';
import { useThemeStore, type ThemeMode } from '@/stores/theme/themeStore';
import { Stack } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

/**
 * Settings Screen
 *
 * Allows authenticated users to configure theme, language, and log out.
 * Accessible via the settings icon in the home screen header.
 */
export default function SettingsScreen() {
  const { t, locale, changeLocale } = useTranslation();
  const colors = useColors();
  const { mode, setMode } = useThemeStore();
  const { logout, isLoggingOut } = useAuth();

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: t('settings.appearance.light'), value: 'light' },
    { label: t('settings.appearance.dark'), value: 'dark' },
    { label: t('settings.appearance.system'), value: 'system' },
  ];

  const languageOptions: { label: string; value: SupportedLocale }[] = [
    { label: t('settings.language.en'), value: 'en' },
    { label: t('settings.language.es'), value: 'es' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('settings.title'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      />
      <PageLayout hasTabBar={false}>
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{ padding: 24, gap: 32 }}
        >
          {/* Appearance */}
          <View>
            <Text
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: colors.text.tertiary }}
            >
              {t('settings.appearance.title')}
            </Text>
            <View
              className="flex-row overflow-hidden rounded-2xl"
              style={{ borderWidth: 1, borderColor: colors.border.light }}
            >
              {themeOptions.map((option, index) => {
                const isActive = mode === option.value;
                const isFirst = index === 0;
                const isLast = index === themeOptions.length - 1;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setMode(option.value)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: 'center',
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderLeftWidth: isFirst ? 0 : 1,
                      borderLeftColor: colors.border.light,
                      borderTopLeftRadius: isFirst ? 16 : 0,
                      borderBottomLeftRadius: isFirst ? 16 : 0,
                      borderTopRightRadius: isLast ? 16 : 0,
                      borderBottomRightRadius: isLast ? 16 : 0,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: isActive ? '#000' : colors.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Language */}
          <View>
            <Text
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: colors.text.tertiary }}
            >
              {t('settings.language.title')}
            </Text>
            <View
              className="flex-row overflow-hidden rounded-2xl"
              style={{ borderWidth: 1, borderColor: colors.border.light }}
            >
              {languageOptions.map((option, index) => {
                const isActive = locale === option.value;
                const isFirst = index === 0;
                const isLast = index === languageOptions.length - 1;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => changeLocale(option.value)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: 'center',
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderLeftWidth: isFirst ? 0 : 1,
                      borderLeftColor: colors.border.light,
                      borderTopLeftRadius: isFirst ? 16 : 0,
                      borderBottomLeftRadius: isFirst ? 16 : 0,
                      borderTopRightRadius: isLast ? 16 : 0,
                      borderBottomRightRadius: isLast ? 16 : 0,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: isActive ? '#000' : colors.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Account */}
          <View>
            <Text
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: colors.text.tertiary }}
            >
              {t('settings.account.title')}
            </Text>
            <IconButton
              icon="log-out-outline"
              label={t('settings.account.logout')}
              testID="logout-button"
              onPress={logout}
              loading={isLoggingOut}
              iconColor={colors.status.error}
              textColor={colors.status.error}
            />
          </View>
        </ScrollView>
      </PageLayout>
    </>
  );
}
