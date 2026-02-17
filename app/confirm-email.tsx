import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { getAuthService } from "@/services/api/factory";
import { createLogger } from "@/utils/logger";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

const authService = getAuthService();
const logger = createLogger("ConfirmEmailScreen");

/**
 * Email Confirmation Screen
 *
 * Displayed after user registers with email confirmation enabled.
 * Shows instructions and allows resending the confirmation email.
 *
 * @example
 * ```tsx
 * // Redirected from registration with email confirmation
 * router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
 * ```
 */
const ConfirmEmailScreen = () => {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string }>();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (!params.email) {
      Alert.alert(t("errors.unexpectedError"), "Email address not found");
      return;
    }

    try {
      setIsResending(true);
      await authService.resendConfirmationEmail(params.email);

      Alert.alert(t("auth.emailResent"), t("auth.emailResentMessage"), [
        { text: t("common.ok") },
      ]);
    } catch (error) {
      logger.error("Error resending email:", error);
      Alert.alert(
        t("errors.unexpectedError"),
        error instanceof Error ? error.message : t("auth.emailResendFailed"),
        [{ text: t("common.ok") }],
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-1 px-6 pt-12 justify-center">
        {/* Icon/Illustration Area */}
        <View className="items-center mb-8">
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <Icon name="mail" size={64} color={colors.primary} />
          </View>
        </View>

        {/* Header */}
        <View className="mb-8">
          <Typography variant="title" className="mb-4 text-center">
            {t("auth.confirmEmailTitle")}
          </Typography>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, textAlign: "center" }}
          >
            {t("auth.confirmEmailMessage")}
          </Typography>
        </View>

        {/* Email Display */}
        {params.email && (
          <View
            className="mb-8 rounded-lg p-4"
            style={{ backgroundColor: colors.card }}
          >
            <Typography
              variant="label"
              style={{ color: colors.text.secondary, marginBottom: 4 }}
            >
              {t("auth.email")}
            </Typography>
            <Typography variant="body" style={{ color: colors.primary }}>
              {params.email}
            </Typography>
          </View>
        )}

        {/* Instructions */}
        <View className="mb-8">
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, lineHeight: 24 }}
          >
            {t("auth.confirmEmailInstructions")}
          </Typography>
        </View>

        {/* Back to Login */}
        <View className="mb-4">
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, marginBottom: 8 }}
          >
            {t("auth.alreadyConfirmed")}
          </Typography>
          <Button onPress={() => router.push(ROUTES.LOGIN)} variant="secondary">
            {t("auth.goToLogin")}
          </Button>
        </View>

        {/* Resend Button */}
        <View className="mb-4">
          <Button
            onPress={handleResendEmail}
            disabled={isResending || !params.email}
            variant="primary"
            fullWidth
          >
            {isResending ? t("auth.resendingEmail") : t("auth.resendEmail")}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ConfirmEmailScreen;
