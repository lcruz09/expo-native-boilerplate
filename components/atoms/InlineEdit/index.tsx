import { Icon } from "@/components/atoms/Icon";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

export interface InlineEditProps {
  /**
   * Current value to display or edit
   */
  value: string;

  /**
   * Callback when value is saved
   */
  onSave: (newValue: string) => void;

  /**
   * Placeholder text when value is empty
   */
  placeholder?: string;

  /**
   * Typography variant for display mode
   * @default "body"
   */
  variant?: "display" | "title" | "subtitle" | "body" | "label" | "caption";

  /**
   * Maximum number of lines for multiline editing
   * If > 1, enables multiline mode
   * @default 1
   */
  maxLines?: number;

  /**
   * Additional styles for the container
   */
  style?: ViewStyle;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * InlineEdit Atom Component
 *
 * Displays text with an edit icon. When clicked, switches to an input
 * field for inline editing. Supports both single-line and multiline editing.
 *
 * @example
 * ```tsx
 * <InlineEdit
 *   value={workout.title}
 *   onSave={(newTitle) => updateWorkout(workout.id, { title: newTitle })}
 *   placeholder="Add a title..."
 *   variant="title"
 * />
 *
 * <InlineEdit
 *   value={workout.description}
 *   onSave={(newDesc) => updateWorkout(workout.id, { description: newDesc })}
 *   placeholder="Add a description..."
 *   maxLines={4}
 * />
 * ```
 */
export function InlineEdit({
  value,
  onSave,
  placeholder = "Tap to edit",
  variant = "body",
  maxLines = 1,
  style,
  testID,
}: InlineEditProps) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const isMultiline = maxLines > 1;

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    onSave(trimmedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    // Edit Mode
    const inputProps: TextInputProps = {
      value: editValue,
      onChangeText: setEditValue,
      autoFocus: true,
      style: {
        color: colors.text.primary,
        fontFamily: "Inter_400Regular",
        fontSize:
          variant === "display"
            ? 32
            : variant === "title"
              ? 20
              : variant === "caption"
                ? 12
                : 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.primary,
      },
      placeholderTextColor: colors.text.secondary,
      placeholder,
      testID: testID ? `${testID}-input` : undefined,
    };

    if (isMultiline) {
      inputProps.multiline = true;
      inputProps.numberOfLines = maxLines;
      inputProps.textAlignVertical = "top";
    }

    return (
      <View style={style} testID={testID}>
        <TextInput {...inputProps} />

        {/* Action Buttons */}
        <View className="flex-row gap-2 mt-2">
          <Pressable
            onPress={handleSave}
            className="flex-1 py-2 px-4 rounded-lg items-center"
            style={{ backgroundColor: colors.primary }}
            testID={testID ? `${testID}-save-button` : undefined}
          >
            <Typography variant="body" className="font-semibold text-white">
              Save
            </Typography>
          </Pressable>

          <Pressable
            onPress={handleCancel}
            className="flex-1 py-2 px-4 rounded-lg items-center"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border.light,
              borderWidth: 1,
            }}
            testID={testID ? `${testID}-cancel-button` : undefined}
          >
            <Typography
              variant="body"
              className="font-semibold"
              style={{ color: colors.text.secondary }}
            >
              Cancel
            </Typography>
          </Pressable>
        </View>
      </View>
    );
  }

  // Display Mode
  const displayValue = value || placeholder;
  const isEmpty = !value;
  const displayLines = isMultiline ? maxLines : undefined;

  return (
    <Pressable
      onPress={handleEdit}
      className="flex-row items-start gap-2"
      style={style}
      testID={testID}
    >
      <View className="flex-1">
        <Typography
          variant={variant}
          style={{
            color: isEmpty ? colors.text.secondary : colors.text.primary,
            fontStyle: isEmpty ? "italic" : "normal",
          }}
          numberOfLines={displayLines}
        >
          {displayValue}
        </Typography>
      </View>

      <Icon name="create-outline" size={20} color={colors.text.secondary} />
    </Pressable>
  );
}
