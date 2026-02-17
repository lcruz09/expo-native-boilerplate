import { ROUTES, ROUTE_SEGMENTS } from "@/constants/routes";
import { useAuthStore } from "@/stores/auth/authStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

/**
 * Auth Guard Hook
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to login screen.
 *
 * @example
 * ```tsx
 * export default function ProtectedScreen() {
 *   useAuthGuard();
 *
 *   return (
 *     <View>
 *       <Text>This content requires authentication</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      // Wait for auth to initialize
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inLoginScreen = segments[0] === ROUTE_SEGMENTS.LOGIN;
    const inRegisterScreen = segments[0] === ROUTE_SEGMENTS.REGISTER;
    const inAuthFlow = inAuthGroup || inLoginScreen || inRegisterScreen;

    if (!isAuthenticated && !inAuthFlow) {
      // User is not authenticated and not in auth flow - redirect to login
      router.replace(ROUTES.LOGIN);
    } else if (isAuthenticated && inAuthFlow) {
      // User is authenticated but in auth flow - redirect to home
      router.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return {
    isAuthenticated,
    isLoading,
  };
};
