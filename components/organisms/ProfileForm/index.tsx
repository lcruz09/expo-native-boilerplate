import { Button } from "@/components/atoms/Button";
import { FormInput } from "@/components/atoms/FormInput";
import { FormSelector } from "@/components/atoms/FormSelector";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { createProfileSchema, ProfileFormData } from "@/schemas/profileSchema";
import { Gender } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";

interface ProfileFormProps {
  /**
   * Initial values for the form (for editing)
   */
  defaultValues?: Partial<ProfileFormData>;

  /**
   * Button text (e.g., "Complete Profile" or "Update Profile")
   */
  submitLabel: string;

  /**
   * Callback when form is submitted with valid data
   */
  onSubmit: (data: ProfileFormData) => void;

  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * Profile Form Organism
 *
 * Complete profile form with validation using react-hook-form and Zod.
 * Includes fields for birth year, weight, height, gender, and optional resting heart rate.
 *
 * @example
 * ```tsx
 * <ProfileForm
 *   defaultValues={profile}
 *   submitLabel="Update Profile"
 *   onSubmit={(data) => updateProfile(data)}
 *   isSubmitting={loading}
 * />
 * ```
 */
export function ProfileForm({
  defaultValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: ProfileFormProps) {
  const { t } = useTranslation();
  const hasInitialized = useRef(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema(t)),
    mode: "onChange",
    defaultValues: defaultValues || {
      birthYear: undefined,
      weight: undefined,
      height: undefined,
      gender: undefined,
      restingHeartRate: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  // Reset form ONLY when defaultValues first become available (initial load)
  // Not on subsequent changes while user is editing
  useEffect(() => {
    if (defaultValues && !hasInitialized.current) {
      reset(defaultValues);
      hasInitialized.current = true;
    }
  }, [defaultValues, reset]);

  const genderOptions = [
    { label: t("profile.genderMale"), value: Gender.MALE, icon: "male" },
    { label: t("profile.genderFemale"), value: Gender.FEMALE, icon: "female" },
    { label: t("profile.genderOther"), value: Gender.OTHER, icon: "person" },
  ];

  return (
    <FormProvider {...methods}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 150 }}
        nestedScrollEnabled={true}
      >
        <View className="gap-2">
          <FormInput
            control={control}
            name="birthYear"
            label={t("profile.birthYear")}
            icon="calendar-outline"
            keyboardType="numeric"
            placeholder="1990"
            unit={t("profile.birthYearUnit")}
          />

          <FormInput
            control={control}
            name="weight"
            label={t("profile.weight")}
            icon="scale-outline"
            keyboardType="decimal-pad"
            placeholder="70"
            unit={t("profile.weightUnit")}
          />

          <FormInput
            control={control}
            name="height"
            label={t("profile.height")}
            icon="resize-outline"
            keyboardType="numeric"
            placeholder="175"
            unit={t("profile.heightUnit")}
          />

          <FormSelector
            name="gender"
            label={t("profile.gender")}
            icon="male-female-outline"
            title={t("profile.selectGender")}
            options={genderOptions}
            placeholder={t("profile.selectGender")}
          />

          <FormInput
            control={control}
            name="restingHeartRate"
            label={t("profile.restingHeartRate")}
            icon="heart-outline"
            keyboardType="numeric"
            placeholder="60"
            optional
            hint={t("profile.restingHeartRateHint")}
            unit={t("profile.restingHeartRateUnit")}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className="mt-4"
          >
            {isSubmitting ? `${submitLabel}...` : submitLabel}
          </Button>
        </View>
      </ScrollView>
    </FormProvider>
  );
}
