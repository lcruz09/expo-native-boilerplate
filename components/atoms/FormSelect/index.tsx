import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { View } from "react-native";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface FormSelectProps<T extends FieldValues, V = string> {
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
   * Available options
   */
  options: SelectOption<V>[];

  /**
   * Placeholder text when no selection
   */
  placeholder?: string;

  /**
   * Whether the field is optional
   */
  optional?: boolean;
}

/**
 * Form Select Component
 *
 * Dropdown/picker component integrated with react-hook-form.
 * Displays label, selected value, and error messages.
 *
 * @example
 * ```tsx
 * <FormSelect
 *   control={control}
 *   name="gender"
 *   label="Gender"
 *   options={[
 *     { label: "Male", value: Gender.MALE },
 *     { label: "Female", value: Gender.FEMALE },
 *   ]}
 * />
 * ```
 */
export function FormSelect<T extends FieldValues, V = string>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  optional = false,
}: FormSelectProps<T, V>) {
  const colors = useColors();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <View className="mb-4">
            <Typography variant="body" className="text-text mb-2">
              {label}
              {optional && (
                <Typography variant="caption" className="text-textMuted">
                  {" "}
                  (Optional)
                </Typography>
              )}
            </Typography>

            <View className="gap-2">
              {options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => onChange(option.value)}
                    className="border border-border rounded-xl px-5 py-4 flex-row items-center justify-between"
                    style={{
                      borderColor: isSelected
                        ? colors.primary
                        : colors.border.light,
                      backgroundColor: isSelected
                        ? `${colors.primary}15`
                        : colors.card,
                    }}
                  >
                    <Typography
                      variant="body"
                      className={isSelected ? "text-primary" : "text-text"}
                      style={{ fontSize: 16 }}
                    >
                      {option.label}
                    </Typography>

                    {isSelected && (
                      <Icon
                        name="checkmark-circle"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {error && (
              <Typography variant="caption" className="text-error mt-1">
                {error.message}
              </Typography>
            )}
          </View>
        );
      }}
    />
  );
}
