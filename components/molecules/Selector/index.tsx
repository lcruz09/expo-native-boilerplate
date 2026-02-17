import { Icon } from "@/components/atoms/Icon";
import { SelectButton } from "@/components/atoms/SelectButton";
import { ModalSelector } from "@/components/molecules/ModalSelector";
import { useColors } from "@/hooks/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import { View } from "react-native";

export interface SelectorOption<T = string> {
  /**
   * Unique value for this option
   */
  value: T;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional icon (Ionicons name or ReactNode)
   */
  icon?: keyof typeof Ionicons.glyphMap | ReactNode;
}

export interface SelectorProps<T = string> {
  /**
   * Modal title
   */
  title: string;
  /**
   * Available options
   */
  options: SelectorOption<T>[];
  /**
   * Currently selected value (can be null/undefined)
   */
  value: T | null | undefined;
  /**
   * Callback when value changes
   */
  onChange: (value: T) => void;
  /**
   * Placeholder text when no selection
   */
  placeholder?: string;
  /**
   * Optional custom styling
   */
  className?: string;
  /**
   * Hide icon in the select button (but keep in modal options)
   */
  hideButtonIcon?: boolean;
  /**
   * Whether to close the modal when an option is selected
   * @default true
   */
  closeOnSelect?: boolean;
}

/**
 * Generic Selector component with modal selection.
 *
 * Displays a button showing the current selection, opens a modal to change it.
 * Reusable for any single-choice selection.
 *
 * @example
 * ```tsx
 * <Selector
 *   title="Select Workout Type"
 *   options={workoutTypes}
 *   value={selectedType}
 *   onChange={setSelectedType}
 * />
 * ```
 */
export function Selector<T = string>({
  title,
  options,
  value,
  onChange,
  placeholder = "Select",
  className,
  hideButtonIcon = false,
  closeOnSelect = true,
}: SelectorProps<T>) {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = value
    ? options.find((opt) => opt.value === value)
    : null;

  const handleSelect = (newValue: T) => {
    onChange(newValue);
    if (closeOnSelect) {
      setModalVisible(false);
    }
  };

  // Render icon (either string icon name or ReactNode)
  const renderIcon = (
    icon?: keyof typeof Ionicons.glyphMap | ReactNode,
    size = 20,
  ) => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return (
        <View>
          <Icon
            name={icon as keyof typeof Ionicons.glyphMap}
            size={size}
            color={colors.text.primary}
          />
        </View>
      );
    }

    return <View>{icon}</View>;
  };

  // Transform options for ModalSelector
  const modalOptions = options.map((option) => ({
    value: option.value,
    label: option.label,
    icon: renderIcon(option.icon, 24),
  }));

  return (
    <>
      <SelectButton
        label={selectedOption?.label ?? placeholder}
        icon={hideButtonIcon ? undefined : renderIcon(selectedOption?.icon)}
        onPress={() => setModalVisible(true)}
        className={className}
      />

      <ModalSelector
        visible={modalVisible}
        title={title}
        options={modalOptions}
        selectedValue={value ?? ("" as T)}
        onSelect={handleSelect}
        onClose={() => setModalVisible(false)}
        closeOnSelect={closeOnSelect}
      />
    </>
  );
}
