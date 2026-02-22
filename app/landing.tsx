import { Button } from '@/components/atoms/Button';
import { PageLayout } from '@/components/organisms/PageLayout';
import { config } from '@/config';
import { useTranslation } from '@/hooks/localization/useTranslation';
import { useColors } from '@/hooks/theme/useColors';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function LandingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <PageLayout>
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-zinc-950">
        <View className="mb-12 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-xl shadow-blue-500/20">
            <View className="h-10 w-10 rotate-45 rounded-lg border-4 border-white" />
          </View>
          <Text className="text-center text-4xl font-bold" style={{ color: colors.text.primary }}>
            {config.name}
          </Text>
          <Text
            className="mt-2 text-center text-lg opacity-60"
            style={{ color: colors.text.secondary }}
          >
            {t('auth.landing.tagline')}
          </Text>
        </View>

        <View className="w-full max-w-xs space-y-4">
          <Button onPress={() => router.push('/login')} variant="primary" size="large">
            {t('auth.landing.loginButton')}
          </Button>

          <Text
            className="mt-4 text-center text-sm opacity-40"
            style={{ color: colors.text.secondary }}
          >
            {t('about.version')} 1.0.0
          </Text>
        </View>
      </View>
    </PageLayout>
  );
}
