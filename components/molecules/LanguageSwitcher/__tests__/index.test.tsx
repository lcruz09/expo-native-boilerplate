import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { LanguageSwitcher } from "../index";

interface ModalOption {
  value: string | number;
  label: string;
}

interface ModalSelectorProps {
  visible: boolean;
  title: string;
  options: ModalOption[];
  onSelect: (value: string | number) => void;
  onClose: () => void;
}

// Mock MMKV
jest.mock("react-native-mmkv", () => ({
  MMKV: jest.fn(),
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock useTranslation hook
const mockChangeLocale = jest.fn();
jest.mock("@/hooks/localization/useTranslation", () => ({
  useTranslation: () => ({
    locale: "en",
    changeLocale: mockChangeLocale,
    t: (key: string) => key,
  }),
}));

// Mock ModalSelector
jest.mock("@/components/molecules/ModalSelector", () => ({
  ModalSelector: ({
    visible,
    title,
    options,
    onSelect,
    onClose,
  }: ModalSelectorProps) => {
    const {
      View: MockView,
      Text,
      Pressable: RNPressable,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require("react-native");
    if (!visible) return null;
    return (
      <MockView testID="mock-modal-selector">
        <Text>{title}</Text>
        {options.map((opt) => (
          <RNPressable
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
          >
            <Text>{opt.label}</Text>
          </RNPressable>
        ))}
        <RNPressable onPress={onClose}>
          <Text>Close</Text>
        </RNPressable>
      </MockView>
    );
  },
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { root } = render(<LanguageSwitcher />);
    expect(root).toBeTruthy();
  });

  it("displays current language", () => {
    const { getByText } = render(<LanguageSwitcher />);
    expect(getByText("English")).toBeTruthy();
  });

  it("displays language flag", () => {
    const { getByText } = render(<LanguageSwitcher />);
    expect(getByText("🇺🇸")).toBeTruthy();
  });

  it("opens modal when button is pressed", async () => {
    const { getByText, queryByTestId } = render(<LanguageSwitcher />);

    // Modal should not be visible initially
    expect(queryByTestId("mock-modal-selector")).toBeNull();

    // Press the select button
    fireEvent.press(getByText("English"));

    // Modal should now be visible
    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });
  });

  it("displays all language options in modal", async () => {
    const { getByText, getAllByText } = render(<LanguageSwitcher />);

    // Open modal
    fireEvent.press(getByText("English"));

    await waitFor(() => {
      // English appears twice (button + modal option)
      const englishOptions = getAllByText("English");
      expect(englishOptions.length).toBeGreaterThan(0);
      expect(getByText("Español")).toBeTruthy();
      expect(getByText("Deutsch")).toBeTruthy();
      expect(getByText("日本語")).toBeTruthy();
    });
  });

  it("calls changeLocale when a language is selected", async () => {
    const { getByText } = render(<LanguageSwitcher />);

    // Open modal
    fireEvent.press(getByText("English"));

    await waitFor(() => {
      // Select Spanish
      fireEvent.press(getByText("Español"));
    });

    expect(mockChangeLocale).toHaveBeenCalledWith("es");
  });

  it("closes modal after selecting a language", async () => {
    const { getByText, queryByTestId } = render(<LanguageSwitcher />);

    // Open modal
    fireEvent.press(getByText("English"));

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });

    // Select a language
    fireEvent.press(getByText("Español"));

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeNull();
    });
  });

  it("renders with custom className", () => {
    expect(() =>
      render(<LanguageSwitcher className="custom-class" />),
    ).not.toThrow();
  });

  it("displays language flags", () => {
    const { getByText } = render(<LanguageSwitcher />);

    // US flag is displayed for current language (English)
    expect(getByText("🇺🇸")).toBeTruthy();
    expect(getByText("English")).toBeTruthy();
  });
});
