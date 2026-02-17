import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { Typography } from "@/components/atoms/Typography";
import { useColors } from "@/hooks/theme/useColors";
import { ImpactFeedbackStyle } from "expo-haptics";
import React, { ReactNode } from "react";
import { Modal, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ModalSelectorOption<T> {
  /**
   * Unique value for this option
   */
  value: T;
  /**
   * Display label for this option
   */
  label: string;
  /**
   * Optional icon/emoji
   */
  icon?: ReactNode;
}

export interface ModalSelectorProps<T> {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Modal title
   */
  title: string;
  /**
   * Available options
   */
  options: ModalSelectorOption<T>[];
  /**
   * Currently selected value
   */
  selectedValue: T;
  /**
   * Callback when an option is selected
   */
  onSelect: (value: T) => void;
  /**
   * Callback when modal is closed
   */
  onClose: () => void;
  /**
   * Optional description content to show below options
   */
  description?: ReactNode;
  /**
   * Whether to close the modal when an option is selected
   * @default true
   */
  closeOnSelect?: boolean;
}

/**
 * ModalSelector component for selecting from a list of options.
 *
 * @example
 * ```tsx
 * <ModalSelector
 *   visible={modalVisible}
 *   title="Select Language"
 *   options={languageOptions}
 *   selectedValue={currentLanguage}
 *   onSelect={handleLanguageChange}
 *   onClose={() => setModalVisible(false)}
 * />
 * ```
 */
export const ModalSelector = <T,>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  description,
  closeOnSelect = true,
}: ModalSelectorProps<T>) => {
  const colors = useColors();

  const handleSelect = (value: T) => {
    onSelect(value);
    if (closeOnSelect) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
        hapticStyle="none"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          hapticStyle="none"
          className="bg-background dark:bg-background-dark rounded-t-3xl"
        >
          <SafeAreaView>
            <View className="p-6">
              {/* Header with title and close button */}
              <View className="flex-row items-center justify-between mb-4">
                <Typography variant="title" color="primary">
                  {title}
                </Typography>
                <Pressable
                  onPress={onClose}
                  className="p-2 -mr-2"
                  hapticStyle={ImpactFeedbackStyle.Light}
                >
                  <Icon name="close" size={24} color={colors.text.primary} />
                </Pressable>
              </View>

              {/* Options list */}
              <ScrollView className="max-h-96">
                {options.map((option) => (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => handleSelect(option.value)}
                    className={`flex-row items-center gap-3 p-4 rounded-lg mb-2 ${
                      selectedValue === option.value
                        ? "bg-primary/10"
                        : "bg-secondary dark:bg-secondary-dark"
                    } active:opacity-70`}
                  >
                    {option.icon && <View className="w-8">{option.icon}</View>}
                    <Typography
                      variant="body"
                      color={
                        selectedValue === option.value ? "accent" : "primary"
                      }
                    >
                      {option.label}
                    </Typography>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Optional description */}
              {description && (
                <View
                  className="mt-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  {description}
                </View>
              )}
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
