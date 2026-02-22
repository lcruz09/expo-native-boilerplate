import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Pressable } from '@/components/atoms/Pressable';
import { PageLayout } from '@/components/organisms/PageLayout';
import { useTranslation } from '@/hooks/localization/useTranslation';
import { useColors } from '@/hooks/theme/useColors';
import { useThemeStore } from '@/stores/theme/themeStore';
import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

/**
 * Home Screen (Boilerplate Guide)
 *
 * This is a clean starting point for your Expo project.
 * It demonstrates the use of PageLayout, the theming system, and translations.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { mode, setMode } = useThemeStore();
  const router = useRouter();

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          title: t('layout.home'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              testID="settings-nav-button"
              onPress={() => router.push('/(auth)/settings')}
              style={{
                padding: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="settings-outline" size={24} color={colors.text.primary} />
            </Pressable>
          ),
        }}
      />
      <PageLayout>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className="mb-4 text-center text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t('common.welcome')}
          </Text>

          <Text className="mb-8 text-center text-base" style={{ color: colors.text.secondary }}>
            {t('home.subtitle')}
          </Text>

          <View className="w-full space-y-4">
            <View className="mb-6 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800">
              <Text className="mb-2 font-semibold" style={{ color: colors.text.primary }}>
                {t('home.elementExamples')}
              </Text>
              <View className="mb-2 flex-row items-center justify-between">
                <Text style={{ color: colors.text.secondary }}>{t('home.buttonAtom')}</Text>
                <Button onPress={() => console.log('Pressed')} variant="primary" size="small">
                  {t('home.action')}
                </Button>
              </View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text style={{ color: colors.text.secondary }}>{t('home.themeStore')}</Text>
                <Button onPress={toggleTheme} variant="secondary" size="small">
                  {mode === 'dark' ? t('home.switchLight') : t('home.switchDark')}
                </Button>
              </View>
            </View>

            <Text className="text-center text-sm" style={{ color: colors.text.secondary }}>
              {t('home.docsGuide')}
            </Text>
          </View>
        </View>
      </PageLayout>
    </>
  );
}
