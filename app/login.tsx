import { Button } from "@/components/atoms/Button";
import { FormInput } from "@/components/atoms/FormInput";
import { Icon } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/auth/useAuth";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { LoginFormData, createLoginSchema } from "@/schemas/loginSchema";
import { AUTH_ERROR_CODES, getErrorCode } from "@/utils/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
} from "react-native";

/**
 * Login Screen
 *
 * Allows users to login with their email and password.
 * Includes links to registration and password reset.
 *
 * @example
 * ```tsx
 * // Accessed via routing
 * router.push(ROUTES.LOGIN);
 * ```
 */
const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitError(null);
      await login(data);
      // Navigation will be handled by auth state change
    } catch (error) {
      // Check if email is not confirmed using error code
      const errorCode = getErrorCode(error);

      if (errorCode === AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED) {
        // Redirect to email confirmation page
        router.push(
          `${ROUTES.CONFIRM_EMAIL}?email=${encodeURIComponent(data.email)}`,
        );
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : t("auth.loginFailed");
      setSubmitError(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for future implementation
    Alert.alert(t("auth.forgotPassword"), t("common.comingSoon"), [
      { text: t("common.ok") },
    ]);
  };

  // Configure header with settings button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t("auth.loginSuccess"),
      headerRight: () => (
        <Pressable
          onPress={() => router.push(ROUTES.SETTINGS)}
          style={{ padding: 8 }}
        >
          <Icon name="settings-outline" size={28} color={colors.text.primary} />
        </Pressable>
      ),
    });
  }, [navigation, t, colors, router]);

  return (
    <KeyboardAvoidingView behavior={"padding"} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-8">
          {/* Header Description */}
          <View className="mb-8">
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {t("auth.loginDescription")}
            </Typography>
          </View>

          {/* Error Message */}
          {submitError && (
            <View
              className="mb-4 rounded-lg p-4"
              style={{ backgroundColor: colors.status.error + "20" }}
            >
              <Typography variant="body" style={{ color: colors.status.error }}>
                {submitError}
              </Typography>
            </View>
          )}

          {/* Login Form */}
          <FormInput
            control={control}
            name="email"
            label={t("auth.email")}
            placeholder={t("auth.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            control={control}
            name="password"
            label={t("auth.password")}
            placeholder={t("auth.passwordPlaceholder")}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Forgot Password Link */}
          <Pressable onPress={handleForgotPassword} className="mb-4">
            <Typography
              variant="body"
              style={{ color: colors.primary, textAlign: "right" }}
            >
              {t("auth.forgotPassword")}
            </Typography>
          </Pressable>

          {/* Login Button */}
          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            <Typography
              variant="body"
              style={{ color: colors.card, fontWeight: "600" }}
            >
              {isLoading ? t("auth.signingIn") : t("auth.signIn")}
            </Typography>
          </Button>

          {/* Register Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {t("auth.dontHaveAccount")}{" "}
            </Typography>
            <Pressable onPress={() => router.push(ROUTES.REGISTER)}>
              <Typography variant="body" style={{ color: colors.primary }}>
                {t("auth.createAccount")}
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
