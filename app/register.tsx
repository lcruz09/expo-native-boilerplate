import { Button } from "@/components/atoms/Button";
import { FormInput } from "@/components/atoms/FormInput";
import { FormSelector } from "@/components/atoms/FormSelector";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/auth/useAuth";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import {
  RegisterFormData,
  createRegisterSchema,
} from "@/schemas/registerSchema";
import { Gender } from "@/types/profile";
import {
  AUTH_ERROR_CODES,
  getErrorCode,
  isExpectedError,
} from "@/utils/errors";
import { createLogger } from "@/utils/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const logger = createLogger("RegisterScreen");

/**
 * Registration Screen
 *
 * Allows new users to create an account with profile information.
 * Collects both authentication credentials and profile data.
 *
 * @example
 * ```tsx
 * // Accessed via routing
 * router.push(ROUTES.REGISTER);
 * ```
 */
const RegisterScreen = () => {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { register: registerUser, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<RegisterFormData>({
    // Type assertion is safe here because:
    // 1. The schema correctly transforms strings to numbers at runtime
    // 2. We have a compile-time type guard (_AssertFormDataMatches) in the schema file
    // 3. The form successfully validated and created a user in Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createRegisterSchema(t)) as any,
    mode: "onBlur", // Changed from "onChange" to prevent keyboard closing
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      gender: Gender.MALE,
      birthYear: undefined,
      height: undefined,
      weight: undefined,
      firstName: "",
      lastName: "",
      restingHeartRate: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Debug: Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      logger.warn("Form validation errors:", errors);
    }
  }, [errors]);

  const onSubmit = async (data: RegisterFormData) => {
    logger.debug("Form submitted - onSubmit called");
    try {
      setSubmitError(null);
      logger.debug("Starting registration with data:", {
        email: data.email,
        hasPassword: !!data.password,
        birthYear: data.birthYear,
        gender: data.gender,
      });
      await registerUser(data);
      logger.info("Registration successful!");
      // Navigation will be handled automatically by auth state change
    } catch (error) {
      const errorCode = getErrorCode(error);

      // Log expected errors as warnings, unexpected as errors
      if (isExpectedError(errorCode)) {
        logger.warn("Registration failed with expected error:", errorCode);
      } else {
        logger.error("Registration failed with unexpected error:", error);
      }

      // Check if it's the email confirmation required message
      if (errorCode === AUTH_ERROR_CODES.CONFIRMATION_REQUIRED) {
        // Redirect to email confirmation page with email as parameter
        router.push(
          `${ROUTES.CONFIRM_EMAIL}?email=${encodeURIComponent(data.email)}`,
        );
        return;
      }

      // Handle other errors
      let errorMessage = t("auth.registrationFailed");
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          errorMessage = t("auth.emailAlreadyRegistered");
        } else if (error.message.includes("Invalid")) {
          errorMessage = error.message;
        } else if (error.message.includes("supabaseUrl is required")) {
          errorMessage = t("auth.configError");
        } else {
          errorMessage = error.message;
        }
      }
      setSubmitError(errorMessage);
    }
  };

  const genderOptions = [
    { label: t("profile.genderMale"), value: Gender.MALE, icon: "male" },
    { label: t("profile.genderFemale"), value: Gender.FEMALE, icon: "female" },
    { label: t("profile.genderOther"), value: Gender.OTHER, icon: "person" },
  ];

  const content = (
    <FormProvider {...methods}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-8">
          {/* Header */}
          <View className="mb-6">
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {t("auth.createAccountDescription")}
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

          {/* Form */}
          <View className="mb-6">
            <Typography variant="subtitle" className="mb-4">
              {t("auth.accountInformation")}
            </Typography>
            <FormInput
              control={control}
              name="email"
              label={`${t("auth.email")} *`}
              icon="mail-outline"
              keyboardType="email-address"
              placeholder={t("auth.emailPlaceholder")}
            />
            <FormInput
              control={control}
              name="password"
              label={`${t("auth.password")} *`}
              icon="lock-closed-outline"
              secureTextEntry
              placeholder={t("auth.passwordPlaceholder")}
            />
            <FormInput
              control={control}
              name="confirmPassword"
              label={`${t("auth.confirmPassword")} *`}
              icon="lock-closed-outline"
              secureTextEntry
              placeholder={t("auth.confirmPasswordPlaceholder")}
            />

            <Typography variant="subtitle" className="mb-4 mt-6">
              {t("auth.personalInformation")}
            </Typography>
            <FormInput
              control={control}
              name="firstName"
              label={t("auth.firstName")}
              icon="person-outline"
              placeholder={t("auth.firstNamePlaceholder")}
            />
            <FormInput
              control={control}
              name="lastName"
              label={t("auth.lastName")}
              icon="person-outline"
              placeholder={t("auth.lastNamePlaceholder")}
            />

            <Typography variant="subtitle" className="mb-4 mt-6">
              {t("auth.profileDetails")}
            </Typography>
            <FormSelector
              name="gender"
              label={`${t("profile.gender")} *`}
              icon="male-female-outline"
              title={t("profile.selectGender")}
              options={genderOptions}
              placeholder={t("profile.selectGender")}
            />
            <FormInput
              control={control}
              name="birthYear"
              label={`${t("auth.birthYear")} *`}
              icon="calendar-outline"
              keyboardType="numeric"
              placeholder={t("auth.birthYearPlaceholder")}
            />
            <FormInput
              control={control}
              name="height"
              label={`${t("auth.height")} *`}
              icon="resize-outline"
              keyboardType="numeric"
              placeholder={t("auth.heightPlaceholder")}
              unit="cm"
            />
            <FormInput
              control={control}
              name="weight"
              label={`${t("auth.weight")} *`}
              icon="scale-outline"
              keyboardType="decimal-pad"
              placeholder={t("auth.weightPlaceholder")}
              unit="kg"
            />

            <Typography variant="subtitle" className="mb-4 mt-6">
              {t("auth.advancedOptional")}
            </Typography>
            <FormInput
              control={control}
              name="restingHeartRate"
              label={t("auth.restingHeartRate")}
              icon="heart-outline"
              keyboardType="numeric"
              placeholder={t("auth.restingHeartRatePlaceholder")}
              unit="bpm"
            />

            {/* Validation Errors Summary */}
            {Object.keys(errors).length > 0 && (
              <View
                className="mb-4 p-4 rounded-lg"
                style={{ backgroundColor: colors.status.warning + "20" }}
              >
                <Typography
                  variant="body"
                  style={{ color: colors.status.warning, fontWeight: "600" }}
                  className="mb-2"
                >
                  {t("auth.pleaseFix")}:
                </Typography>
                {Object.entries(errors).map(([field, error]) => (
                  <Typography
                    key={field}
                    variant="caption"
                    style={{ color: colors.status.warning }}
                    className="ml-2"
                  >
                    • {error?.message || `${field} is invalid`}
                  </Typography>
                ))}
              </View>
            )}

            <Button
              onPress={() => {
                logger.debug("Create account button pressed");
                handleSubmit(onSubmit)();
              }}
              disabled={isLoading}
            >
              <Typography
                variant="body"
                style={{ color: colors.card, fontWeight: "600" }}
              >
                {isLoading
                  ? t("auth.creatingAccount")
                  : t("auth.createAccount")}
              </Typography>
            </Button>
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mb-4">
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {t("auth.alreadyHaveAccount")}{" "}
            </Typography>
            <Pressable onPress={() => router.push(ROUTES.LOGIN)}>
              <Typography variant="body" style={{ color: colors.primary }}>
                {t("auth.signIn")}
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </FormProvider>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {content}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
