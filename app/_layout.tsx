import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { TabBar } from "@/components/molecules/TabBar";
import { ErrorBoundaryFallback } from "@/components/organisms/ErrorBoundaryFallback";
import { NotificationContainer } from "@/components/organisms/NotificationContainer";
import { config } from "@/config";
import { TAB_BAR_DISPLAY_ROUTE_SEGMENTS } from "@/constants/routes";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { useTheme } from "@/hooks/theme/useTheme";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { setupAuthListener, useAuthStore } from "@/stores/auth/authStore";
import { createLogger, endSession, startSession } from "@/utils/logger";
import { getAuthRedirect } from "@/utils/navigation";
import * as Sentry from "@sentry/react-native";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import "../global.css";

const sentryDsn = config.sentry.dsn;
const logger = createLogger("AppLayout");

if (sentryDsn && !__DEV__) {
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
      Sentry.mobileReplayIntegration(),
      Sentry.feedbackIntegration(),
    ],
  });
}

// Suppress known non-blocking warnings
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

function RootNavigator() {
  const { t } = useTranslation();
  const colors = useColors();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: authLoading,
    initialize,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Initialize logging session
  useEffect(() => {
    const initializeLogging = async () => {
      await startSession();
    };

    initializeLogging();

    return () => {
      endSession();
    };
  }, []);

  // Setup auth state listener
  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const timeout = setTimeout(() => {
      const currentSegment = segments[0];
      const redirectRoute = getAuthRedirect(currentSegment, isAuthenticated);

      if (redirectRoute) {
        router.replace(redirectRoute);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, authLoading, segments, router]);

  const currentSegment = segments[0];
  const shouldShowTabBar =
    isAuthenticated && TAB_BAR_DISPLAY_ROUTE_SEGMENTS.includes(currentSegment);

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text.primary,
            headerTitleStyle: { color: colors.text.primary },
            headerShadowVisible: false,
            headerBackButtonMenuEnabled: false,
            headerLeft: ({ canGoBack }) =>
              canGoBack ? (
                <Pressable onPress={() => router.back()}>
                  <Icon
                    name="chevron-back-outline"
                    color={colors.text.primary}
                  />
                </Pressable>
              ) : null,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen
            name="login"
            options={{
              title: "Login",
              headerShown: false,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              title: t("auth.createAccount"),
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="confirm-email"
            options={{
              title: t("auth.confirmEmail"),
              headerShown: false,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="auth-callback"
            options={{
              title: t("auth.verifyingEmail"),
              headerShown: false,
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{ title: t("navigation.profile") }}
          />
          <Stack.Screen
            name="settings"
            options={{ title: t("navigation.settings") }}
          />
          <Stack.Screen name="about" options={{ title: t("about.title") }} />
        </Stack>
      </SafeAreaView>
      {shouldShowTabBar && (
        <TabBar currentRoute={pathname || "/"} bottomInset={insets.bottom} />
      )}
    </View>
  );
}

const ThemedStatusBar = () => {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
};

const RootLayout = () => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorBoundaryFallback error={error} resetError={resetError} />
      )}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TranslationProvider>
          <ThemeProvider>
            <RootNavigator />
            <ThemedStatusBar />
            <NotificationContainer />
          </ThemeProvider>
        </TranslationProvider>
      </GestureHandlerRootView>
    </Sentry.ErrorBoundary>
  );
};

export default Sentry.wrap(RootLayout);
