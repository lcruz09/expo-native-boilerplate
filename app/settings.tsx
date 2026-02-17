import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { CalorieMethodSelector } from "@/components/molecules/CalorieMethodSelector";
import { IconButton } from "@/components/molecules/IconButton";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { ThemeSelector } from "@/components/molecules/ThemeSelector";
import { PageLayout } from "@/components/organisms/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/auth/useAuth";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { useColors } from "@/hooks/theme/useColors";
import { getRouteService, getWorkoutService } from "@/services/api/factory";
import { getAllLogFiles } from "@/services/storage/logFileManager";
import { useProfileStore } from "@/stores/profile/profileStore";
import { addRouteToStore } from "@/stores/routes/routesStore";
import { useSettingsStore } from "@/stores/settings/settingsStore";
import { importWorkoutFromFit } from "@/utils/fitFile";
import { createLogger } from "@/utils/logger";
import { formatDuration } from "@/utils/workout";
import * as DocumentPicker from "expo-document-picker";
import { NotificationFeedbackType, notificationAsync } from "expo-haptics";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, Switch, View } from "react-native";

const logger = createLogger("Settings");
const workoutService = getWorkoutService();
const routeService = getRouteService();

/**
 * Settings Screen
 *
 * Provides access to app configuration including:
 * - Theme selection (Light, Dark, System)
 * - Language selection
 * - Calorie calculation method
 * - About information
 */
export default function SettingsScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const profile = useProfileStore((state) => state.profile);
  const { enableMockDevices, setEnableMockDevices } = useSettingsStore();

  const [isImporting, setIsImporting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasLogFiles, setHasLogFiles] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      // Hide back header if we are authenticated
      headerLeft: () =>
        isAuthenticated ? null : (
          <Pressable onPress={() => router.back()}>
            <Icon name="chevron-back-outline" color={colors.text.primary} />
          </Pressable>
        ),
    });
  }, [isAuthenticated, navigation, router, colors.text.primary]);

  // Check if log files exist
  useEffect(() => {
    const checkLogFiles = async () => {
      const files = await getAllLogFiles();
      setHasLogFiles(files.length > 0);
    };
    checkLogFiles();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      t("auth.logout"),
      t("auth.logoutConfirm"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("auth.logout"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              await notificationAsync(NotificationFeedbackType.Success);
              // Redirect to login page after successful logout
              router.replace(ROUTES.LOGIN);
            } catch (error) {
              // Error already logged by useAuth hook
              await notificationAsync(NotificationFeedbackType.Error);
              Alert.alert(
                t("auth.logoutFailed"),
                error instanceof Error ? error.message : t("auth.logoutError"),
                [{ text: t("common.ok") }],
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Handle workout import from FIT file
  const handleImport = async () => {
    if (!user?.id) {
      logger.warn("Cannot import: user not authenticated");
      Alert.alert(
        t("auth.loginFailed"),
        t("auth.notAuthenticated"),
        [{ text: t("common.ok") }],
        { cancelable: true },
      );
      return;
    }

    logger.info("📥 Starting FIT file import");

    try {
      // Open document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/octet-stream", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        logger.debug("Import cancelled by user");
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        logger.warn("No file selected");
        return;
      }

      const file = result.assets[0];
      logger.debug("File selected", { name: file.name, uri: file.uri });

      setIsImporting(true);

      // Import workout (pass original filename for title extraction)
      const { workout, warnings } = await importWorkoutFromFit(
        file.uri,
        file.name,
      );

      // Extract samples from workout
      const hrSamples = workout.hrSamples || [];
      const cyclingSamples = workout.cyclingSamples || [];

      // Sync directly to Supabase (imported workouts are already complete)
      logger.info("Syncing imported workout to Supabase");

      // If workout has a new route (GPS data), save it first
      let workoutRouteId = workout.routeId;
      if (workout.route) {
        logger.info(`Saving route from FIT file: ${workout.route.name}`);
        const savedRoute = await routeService.createRoute(
          user.id,
          workout.route,
        );
        workoutRouteId = savedRoute.id;
        logger.info(`✅ Route saved: ${savedRoute.id} (${savedRoute.name})`);

        // Add route to local store for future use
        addRouteToStore(savedRoute);
      }

      // Save workout (ensure route is removed from workout object)
      const workoutToSave = {
        ...workout,
        routeId: workoutRouteId,
        route: undefined,
      };
      await workoutService.createWorkout(user.id, {
        workout: workoutToSave,
        hrSamples,
        cyclingSamples,
      });

      await notificationAsync(NotificationFeedbackType.Success);
      logger.info("✅ Import successful", { id: workout.id });

      // Show success message with warnings if any
      if (warnings.length > 0) {
        Alert.alert(
          t("importExport.importSuccess"),
          `${t("importExport.importWarnings")}\n• ${warnings.join("\n• ")}`,
          [
            {
              text: t("common.ok"),
              onPress: () =>
                router.push(
                  `${ROUTES.WORKOUT_DETAILS(workout.id)}?fromCompletion=true`,
                ),
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          t("importExport.importSuccess"),
          `${t("workouts.workoutTitle")}: ${workout.title || t("workouts.typeFitnessActivity")}\n${t("workouts.duration")}: ${formatDuration(workout.duration)}`,
          [
            {
              text: t("common.ok"),
              onPress: () =>
                router.push(
                  `${ROUTES.WORKOUT_DETAILS(workout.id)}?fromCompletion=true`,
                ),
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {
      logger.error("❌ Import failed:", error);
      await notificationAsync(NotificationFeedbackType.Error);

      // Show error message
      Alert.alert(
        t("importExport.error"),
        error instanceof Error
          ? error.message
          : t("importExport.errorInvalidFile"),
        [{ text: t("common.ok") }],
        { cancelable: true },
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <PageLayout>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="p-6">
          {/* Account Section - Only show when authenticated */}
          {isAuthenticated && (
            <View className="mb-8">
              <Typography variant="subtitle" color="primary" className="mb-4">
                {t("auth.account")}
              </Typography>

              <View
                className="p-6 rounded-xl mb-4"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border.light,
                  borderWidth: 1,
                }}
              >
                {/* User Info */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Icon
                      name="person-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Typography
                      variant="body"
                      color="secondary"
                      className="ml-2"
                    >
                      {profile?.firstName && profile?.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile?.firstName || t("auth.user")}
                    </Typography>
                  </View>

                  <View className="flex-row items-center">
                    <Icon
                      name="mail-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Typography
                      variant="body"
                      color="secondary"
                      className="ml-2"
                    >
                      {user?.email || t("auth.noEmail")}
                    </Typography>
                  </View>
                </View>

                {/* Logout Button */}
                <IconButton
                  icon="log-out-outline"
                  label={isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
                  onPress={handleLogout}
                  loading={isLoggingOut}
                  disabled={isLoggingOut}
                  iconColor={colors.status.error}
                  textColor={colors.status.error}
                />
              </View>
            </View>
          )}

          {/* Theme Section - Always visible */}
          <View className="mb-8">
            <Typography variant="subtitle" color="primary" className="mb-4">
              {t("settings.theme")}
            </Typography>
            <ThemeSelector />
          </View>

          {/* Language Section - Always visible */}
          <View className="mb-8">
            <Typography variant="subtitle" color="primary" className="mb-4">
              {t("settings.language")}
            </Typography>
            <LanguageSwitcher />
          </View>

          {/* Calorie Calculation Method Section - Only show when authenticated */}
          {isAuthenticated && (
            <View className="mb-8">
              <Typography variant="subtitle" color="primary" className="mb-4">
                {t("settings.calorieMethod")}
              </Typography>
              <CalorieMethodSelector />
            </View>
          )}

          {/* Import & Export Section - Only show when authenticated */}
          {isAuthenticated && (
            <View className="mb-8">
              <Typography variant="subtitle" color="primary" className="mb-4">
                {t("importExport.title")}
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
                  className="mb-4 text-center"
                >
                  {t("importExport.importDescription")}
                </Typography>

                <IconButton
                  icon="cloud-upload-outline"
                  label={
                    isImporting ? t("common.loading") : t("importExport.import")
                  }
                  onPress={handleImport}
                  loading={isImporting}
                  disabled={isImporting}
                />
              </View>
            </View>
          )}

          {/* About Link - Always visible */}
          <View className="mt-8">
            <Typography variant="subtitle" color="primary" className="mb-4">
              {t("about.title")}
            </Typography>

            <IconButton
              icon="information-circle-outline"
              label={t("about.viewAbout")}
              onPress={() => router.push(ROUTES.ABOUT)}
            />
          </View>

          {/* Developer Section - Show if log files exist */}
          {hasLogFiles && (
            <View className="mt-8">
              <Typography variant="subtitle" color="primary" className="mb-4">
                {t("settings.developer")}
              </Typography>

              <View
                className="p-6 rounded-xl mb-4"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border.light,
                  borderWidth: 1,
                }}
              >
                {/* Mock Devices Toggle */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <Icon
                      name="construct-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Typography
                      variant="body"
                      color="secondary"
                      className="ml-2 flex-1"
                    >
                      {t("settings.enableMockDevices")}
                    </Typography>
                  </View>
                  <Switch
                    value={enableMockDevices}
                    onValueChange={setEnableMockDevices}
                    trackColor={{
                      false: colors.border.medium,
                      true: colors.primary,
                    }}
                    thumbColor={colors.card}
                  />
                </View>

                {/* Manage Logs Button */}
                <IconButton
                  icon="document-text-outline"
                  label={t("settings.manageLogs")}
                  onPress={() => router.push(ROUTES.MANAGE_LOGS)}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </PageLayout>
  );
}
