import { ErrorBoundary } from '@/components/organisms/ErrorBoundary';
import { useAuth } from '@/hooks/api/useAuth';
import { useDeepLinking } from '@/hooks/linking/useDeepLinking';
import { useTranslation } from '@/hooks/localization/useTranslation';
import { useTheme } from '@/hooks/theme/useTheme';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { TranslationProvider } from '@/providers/TranslationProvider';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

// Keep the splash screen visible while auth state is being resolved.
// It is hidden once `isLoading` becomes false (see RootNavigator below).
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { t } = useTranslation();

  // Handle incoming deep links (e.g. email confirmation callbacks)
  useDeepLinking();

  // Hide the splash screen as soon as the initial auth state is known
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to landing if not authenticated and trying to access protected routes
      router.replace('/landing');
    } else if (isAuthenticated && !inAuthGroup) {
      // Redirect to home if authenticated and trying to access guest routes
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="landing"
        options={{ title: t('layout.welcome'), headerBackVisible: false }}
      />
      <Stack.Screen name="login" options={{ title: t('layout.login') }} />
    </Stack>
  );
}

const ThemedStatusBar = () => {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
};

const RootLayout = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <TranslationProvider>
            <ThemeProvider>
              <RootNavigator />
              <ThemedStatusBar />
            </ThemeProvider>
          </TranslationProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default RootLayout;
