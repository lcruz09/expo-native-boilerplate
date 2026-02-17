import { PageLayout } from "@/components/organisms/PageLayout";
import { ProfileForm } from "@/components/organisms/ProfileForm";
import { useColors } from "@/hooks/theme/useColors";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { ProfileFormData } from "@/schemas/profileSchema";
import { useProfileStore } from "@/stores/profile/profileStore";
import { createLogger } from "@/utils/logger";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

const logger = createLogger("ProfileScreen");

/**
 * Profile Edit Screen
 *
 * Allows users to view and edit their profile information.
 * Pre-fills form with current profile data.
 */
export default function ProfileScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      updateProfile(data);
      Alert.alert(t("common.done"), t("profile.updated"));
      router.back();
    } catch (error) {
      logger.error("Failed to update profile:", error);
      Alert.alert(t("errors.unexpectedError"), t("errors.tryAgain"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <View
        className="flex-1 px-6 py-4"
        style={{ backgroundColor: colors.background }}
      >
        <ProfileForm
          defaultValues={profile || undefined}
          submitLabel={t("profile.update")}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </View>
    </PageLayout>
  );
}
