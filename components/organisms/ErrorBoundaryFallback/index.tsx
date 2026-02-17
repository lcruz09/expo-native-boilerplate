import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ErrorBoundaryFallbackProps {
  /**
   * The error that triggered the boundary.
   */
  error?: unknown;

  /**
   * Callback to reset the boundary state.
   */
  resetError?: () => void;
}

/**
 * Error boundary fallback UI
 *
 * Displays developer-friendly error details in dev mode and a generic
 * user-friendly message otherwise. Provides an action to return to the
 * Home screen and retry the workflow.
 */
export const ErrorBoundaryFallback = ({
  error,
  resetError,
}: ErrorBoundaryFallbackProps) => {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const devMessage =
    __DEV__ && error
      ? error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : undefined
      : undefined;

  const description = devMessage || t("errors.boundary.description");

  const handleGoHome = () => {
    router.replace(ROUTES.HOME);
    resetError?.();
  };

  return (
    <View
      className="flex-1 justify-center px-6"
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + 32,
        paddingBottom: insets.bottom + 32,
      }}
    >
      <View
        className="w-full items-center rounded-3xl border p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border.light,
        }}
      >
        <View className="mb-4">
          <Icon name="warning-outline" color={colors.status.error} size={48} />
        </View>
        <Typography variant="title" centered className="text-center">
          {t("errors.boundary.title")}
        </Typography>
        <Typography
          variant="body"
          color="secondary"
          centered
          className="mt-2 mb-6 text-center"
        >
          {description}
        </Typography>

        <Pressable
          onPress={handleGoHome}
          className="w-full rounded-3xl px-4 py-3.5"
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Typography
            variant="label"
            centered
            className="text-center"
            style={{ color: colors.background }}
          >
            {t("errors.boundary.cta")}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
};
