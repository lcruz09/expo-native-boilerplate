import { Icon, IconName } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { ReactNode, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, View } from "react-native";

interface FormInputProps<T extends FieldValues> {
  /**
   * Form control from react-hook-form
   */
  control: Control<T>;

  /**
   * Field name (must match schema)
   */
  name: Path<T>;

  /**
   * Input label
   */
  label: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Keyboard type
   */
  keyboardType?: "default" | "numeric" | "decimal-pad" | "email-address";

  /**
   * Whether the field is optional
   */
  optional?: boolean;

  /**
   * Hint text displayed below input
   */
  hint?: string;

  /**
   * Additional content to display on the right side of the label
   */
  rightLabel?: ReactNode;

  /**
   * Whether to obscure the text input (for passwords)
   */
  secureTextEntry?: boolean;

  /**
   * Whether to show password visibility toggle (only works with secureTextEntry)
   */
  showPasswordToggle?: boolean;

  /**
   * Controls auto-capitalization behavior
   */
  autoCapitalize?: "none" | "sentences" | "words" | "characters";

  /**
   * Whether to enable auto-correction
   */
  autoCorrect?: boolean;

  /**
   * Icon to display on the left side of the label
   */
  icon?: IconName;

  /**
   * Unit/suffix text to display inside the input field on the right
   */
  unit?: string;
}

/**
 * Form Input Component
 *
 * Text input component integrated with react-hook-form.
 * Displays label with optional icon, input field with optional unit suffix,
 * error messages, and optional hint.
 *
 * @example
 * ```tsx
 * <FormInput
 *   control={control}
 *   name="age"
 *   label="Age"
 *   icon="calendar-outline"
 *   keyboardType="numeric"
 *   placeholder="Enter your age"
 *   unit="years"
 * />
 * ```
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  optional = false,
  hint,
  rightLabel,
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = "none",
  autoCorrect = false,
  icon,
  unit,
}: FormInputProps<T>) {
  const colors = useColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              {icon && (
                <Icon name={icon} size={20} color={colors.text.primary} />
              )}
              <Typography variant="body" className="text-text">
                {label}
                {optional && (
                  <Typography variant="caption" className="text-textMuted">
                    {" "}
                    (Optional)
                  </Typography>
                )}
              </Typography>
            </View>
            {rightLabel}
          </View>

          <View className="relative">
            <TextInput
              value={value?.toString() ?? ""}
              onChangeText={(text) => {
                // For numeric inputs, allow empty string temporarily
                // It will be validated on blur/submit
                if (
                  keyboardType === "numeric" ||
                  keyboardType === "decimal-pad"
                ) {
                  // Allow empty string to stay as empty string (for editing)
                  if (text === "") {
                    onChange("" as unknown as number);
                    return;
                  }

                  const num = parseFloat(text);
                  const newValue = isNaN(num) ? ("" as unknown as number) : num;
                  onChange(newValue);
                } else {
                  // Text inputs: handle empty string normally
                  if (text === "") {
                    onChange(undefined);
                    return;
                  }
                  onChange(text);
                }
              }}
              onBlur={onBlur}
              placeholder={placeholder}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              placeholderTextColor={colors.text.tertiary}
              className="border border-border rounded-xl px-5 py-4 text-base text-text bg-card"
              style={{
                borderColor: error ? colors.status.error : colors.border.light,
                color: colors.text.primary,
                backgroundColor: colors.card,
                fontSize: 16,
                paddingRight:
                  unit || (secureTextEntry && showPasswordToggle) ? 60 : 20,
              }}
            />

            {/* Password visibility toggle */}
            {secureTextEntry && showPasswordToggle && (
              <View className="absolute right-5 top-0 bottom-0 justify-center">
                <Pressable
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Icon
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={colors.text.tertiary}
                  />
                </Pressable>
              </View>
            )}

            {/* Unit suffix */}
            {unit && (
              <View
                className="absolute right-5 top-0 bottom-0 justify-center"
                pointerEvents="none"
              >
                <Typography
                  variant="body"
                  style={{ color: colors.text.tertiary }}
                >
                  {unit}
                </Typography>
              </View>
            )}
          </View>

          {error && (
            <Typography
              variant="caption"
              style={{ color: colors.status.error }}
              className="mt-1"
            >
              {error.message}
            </Typography>
          )}

          {hint && !error && (
            <Typography variant="caption" className="text-textMuted mt-1">
              {hint}
            </Typography>
          )}
        </View>
      )}
    />
  );
}
