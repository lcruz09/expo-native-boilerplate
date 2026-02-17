import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { getAuthService } from "@/services/api/factory";
import { useAuthStore } from "@/stores/auth/authStore";
import { createLogger } from "@/utils/logger";
import { useLinkingURL } from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";

const authService = getAuthService();
const logger = createLogger("AuthCallbackScreen");

/**
 * Auth Callback Screen
 *
 * This page handles email confirmation deeplinks from Supabase.
 * It shows a loading indicator while processing the confirmation,
 * then redirects to home on success or shows an error message.
 *
 * @example
 * ```
 * // Opened via deeplink from email:
 * wattr-app://auth-callback#access_token=...&refresh_token=...&type=signup
 * ```
 */
const AuthCallbackScreen = () => {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();

  // Use useURL() to get the current URL including hash fragments
  // This works whether the app was already open or opened by the link
  const url = useLinkingURL();

  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent double execution with a ref
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Wait for URL to be available
    if (!url) {
      logger.debug("Waiting for URL...");
      return;
    }

    // Skip if already processed
    if (hasProcessed.current) {
      logger.debug("Auth callback already processed, skipping");
      return;
    }

    // Only process auth-callback URLs
    if (!url.includes("auth-callback")) {
      logger.warn("Not an auth-callback URL:", url);
      return;
    }

    const handleCallback = async () => {
      try {
        // Mark as processed immediately to prevent double execution
        hasProcessed.current = true;

        logger.info("Processing auth callback");
        logger.info("Full URL with hash fragment:", url);
        setIsProcessing(true);
        setError(null);

        const result = await authService.handleEmailConfirmation(url);

        if (result?.session && result?.user) {
          // Update auth store with the new session
          useAuthStore.getState().setSession(result.user, result.session);

          logger.info("Email confirmed successfully, redirecting to home");

          // Show success message and redirect
          Alert.alert(
            t("auth.emailConfirmed"),
            t("auth.emailConfirmedMessage"),
            [
              {
                text: t("common.ok"),
                onPress: () => {
                  router.replace(ROUTES.HOME);
                },
              },
            ],
          );
        } else {
          throw new Error("No session returned from confirmation");
        }
      } catch (err) {
        logger.error("Error handling auth callback:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("auth.emailConfirmationFailed");
        setError(errorMessage);
        setIsProcessing(false);

        // Show error and redirect to login
        Alert.alert(t("errors.unexpectedError"), errorMessage, [
          {
            text: t("common.ok"),
            onPress: () => {
              router.replace(ROUTES.LOGIN);
            },
          },
        ]);
      }
    };

    handleCallback();
  }, [url, router, t]);

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: colors.background }}
    >
      {isProcessing ? (
        <>
          {/* Loading State */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <Icon name="mail" size={64} color={colors.primary} />
          </View>

          <Spinner size="large" color={colors.primary} />

          <Typography
            variant="title"
            className="mt-6 mb-2 text-center"
            style={{ color: colors.text.primary }}
          >
            {t("auth.verifyingEmail")}
          </Typography>

          <Typography
            variant="body"
            style={{ color: colors.text.secondary, textAlign: "center" }}
          >
            {t("auth.pleaseWait")}
          </Typography>
        </>
      ) : error ? (
        <>
          {/* Error State */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.status.error + "20" }}
          >
            <Icon name="alert-circle" size={64} color={colors.status.error} />
          </View>

          <Typography
            variant="title"
            className="mb-2 text-center"
            style={{ color: colors.text.primary }}
          >
            {t("errors.unexpectedError")}
          </Typography>

          <Typography
            variant="body"
            style={{ color: colors.text.secondary, textAlign: "center" }}
          >
            {error}
          </Typography>
        </>
      ) : null}
    </View>
  );
};

export default AuthCallbackScreen;
