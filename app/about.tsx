import { Typography } from "@/components/atoms/Typography";
import { PageLayout } from "@/components/organisms/PageLayout";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { ScrollView, View } from "react-native";

/**
 * About Screen
 *
 * Displays information about the app including:
 * - App description
 * - Version information
 * - Future: FAQs, support links, etc.
 *
 * Accessible to both authenticated and unauthenticated users.
 */
export default function AboutScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <PageLayout>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="p-6">
          {/* App Information Section */}
          <View className="mb-8">
            <Typography variant="subtitle" color="primary" className="mb-4">
              {t("about.title")}
            </Typography>

            <View
              className="p-6 rounded-xl"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border.light,
                borderWidth: 1,
              }}
            >
              <Typography
                variant="body"
                color="secondary"
                centered
                className="mb-4"
              >
                {t("about.description")}
              </Typography>
              <Typography
                variant="caption"
                color="secondary"
                centered
                className="mb-2"
              >
                {t("about.madeWith")}
              </Typography>
              <Typography variant="caption" color="secondary" centered>
                {t("about.version")} 1.0.0
              </Typography>
            </View>
          </View>

          {/* Placeholder for future sections */}
          {/* TODO: Add FAQs section */}
          {/* TODO: Add support/contact section */}
          {/* TODO: Add credits/acknowledgments section */}
        </View>
      </ScrollView>
    </PageLayout>
  );
}
