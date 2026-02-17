import { Typography } from "@/components/atoms/Typography";
import { PageLayout } from "@/components/organisms/PageLayout";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { useAuthStore } from "@/stores/auth/authStore";
import React from "react";
import { View } from "react-native";

/**
 * Home Screen (Generic Boilerplate version)
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAuthStore();

  return (
    <PageLayout>
      <View
        className="flex-1 px-6 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <Typography
          variant="h2"
          style={{ color: colors.text.primary }}
          className="mb-4 text-center"
        >
          {t("common.welcome")}
        </Typography>

        <Typography
          variant="body"
          style={{ color: colors.text.secondary }}
          className="text-center"
        >
          Welcome, {user?.email}! This is your new Expo project boilerplate.
        </Typography>

        <View className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm w-full">
          <Typography
            variant="subtitle"
            style={{ color: colors.text.primary }}
            className="mb-2"
          >
            Getting Started
          </Typography>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary }}
            className="mb-4"
          >
            This boilerplate includes:
          </Typography>
          <View className="space-y-2">
            {[
              "Auth System",
              "Theming Engine",
              "i18n Setup",
              "Atomic UI Components",
            ].map((item) => (
              <Typography
                key={item}
                variant="body"
                style={{ color: colors.primary }}
              >
                • {item}
              </Typography>
            ))}
          </View>
        </View>
      </View>
    </PageLayout>
  );
}
