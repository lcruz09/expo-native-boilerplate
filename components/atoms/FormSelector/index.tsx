import { Icon, IconName } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { Selector, SelectorOption } from "@/components/molecules/Selector";
import { useColors } from "@/hooks/theme/useColors";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

export interface FormSelectorProps<V = string> {
  /**
   * Field name (must match schema)
   */
  name: string;
  /**
   * Input label
   */
  label: string;
  /**
   * Modal title
   */
  title: string;
  /**
   * Available options
   */
  options: SelectorOption<V>[];
  /**
   * Placeholder text when no selection
   */
  placeholder?: string;
  /**
   * Whether the field is optional
   */
  optional?: boolean;
  /**
   * Icon to display on the left side of the label
   */
  icon?: IconName;
}

/**
 * Form Selector Component
 *
 * Modal-based selector integrated with react-hook-form.
 * Uses the reusable Selector component with form validation.
 * Displays icon next to label, while options retain their icons in the modal.
 *
 * @example
 * ```tsx
 * <FormSelector
 *   name="gender"
 *   label="Gender"
 *   icon="male-female-outline"
 *   title="Select Gender"
 *   options={[
 *     { label: "Male", value: Gender.MALE, icon: "male" },
 *     { label: "Female", value: Gender.FEMALE, icon: "female" },
 *   ]}
 * />
 * ```
 */
export function FormSelector<V = string>({
  name,
  label,
  title,
  options,
  placeholder,
  optional = false,
  icon,
}: FormSelectorProps<V>) {
  const { control } = useFormContext();
  const colors = useColors();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              {icon && (
                <Icon name={icon} size={20} color={colors.text.primary} />
              )}
              <Typography variant="body" style={{ color: colors.text.primary }}>
                {label}
                {optional && (
                  <Typography
                    variant="caption"
                    style={{ color: colors.text.secondary }}
                  >
                    {" "}
                    (Optional)
                  </Typography>
                )}
              </Typography>
            </View>
          </View>

          <Selector
            title={title}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            hideButtonIcon
          />

          {error && (
            <Typography
              variant="caption"
              style={{ color: colors.status.error }}
              className="mt-1"
            >
              {error.message}
            </Typography>
          )}
        </View>
      )}
    />
  );
}
