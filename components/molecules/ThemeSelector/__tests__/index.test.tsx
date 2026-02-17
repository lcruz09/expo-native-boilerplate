import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { ThemeSelector } from "../index";

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

// Mock useTranslation hook
jest.mock("@/hooks/localization/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "settings.themeLight": "Light",
        "settings.themeDark": "Dark",
        "settings.themeSystem": "System",
        "settings.selectTheme": "Select Theme",
      };
      return translations[key] || key;
    },
    locale: "en",
    changeLocale: jest.fn(),
  }),
}));

// Mock useTheme hook
const mockSetTheme = jest.fn();
jest.mock("@/hooks/theme/useTheme", () => ({
  useTheme: () => ({
    mode: "light",
    setTheme: mockSetTheme,
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

describe("ThemeSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { root } = render(<ThemeSelector />);
    expect(root).toBeTruthy();
  });

  it("displays current theme mode", () => {
    const { getByText } = render(<ThemeSelector />);
    expect(getByText("Light")).toBeTruthy();
  });

  it("opens modal when button is pressed", async () => {
    const { getByText, queryByTestId } = render(<ThemeSelector />);

    // Modal should not be visible initially
    expect(queryByTestId("mock-modal-selector")).toBeNull();

    // Press the select button
    fireEvent.press(getByText("Light"));

    // Modal should now be visible
    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });
  });

  it("displays modal title", async () => {
    const { getByText } = render(<ThemeSelector />);

    // Open modal
    fireEvent.press(getByText("Light"));

    await waitFor(() => {
      expect(getByText("Select Theme")).toBeTruthy();
    });
  });

  it("displays all theme options in modal", async () => {
    const { getByText, getAllByText } = render(<ThemeSelector />);

    // Open modal
    fireEvent.press(getByText("Light"));

    await waitFor(() => {
      // Light appears twice (button + modal option)
      const lightOptions = getAllByText("Light");
      expect(lightOptions.length).toBeGreaterThan(0);
      expect(getByText("Dark")).toBeTruthy();
      expect(getByText("System")).toBeTruthy();
    });
  });

  it("calls setTheme when a theme is selected", async () => {
    const { getByText, getAllByText } = render(<ThemeSelector />);

    // Open modal
    fireEvent.press(getByText("Light"));

    await waitFor(() => {
      // Select Dark theme (need to get the one in the modal, not the button)
      const darkOptions = getAllByText("Dark");
      fireEvent.press(darkOptions[darkOptions.length - 1]);
    });

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("closes modal after selecting a theme", async () => {
    const { getByText, queryByTestId, getAllByText } = render(
      <ThemeSelector />,
    );

    // Open modal
    fireEvent.press(getByText("Light"));

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });

    // Select a theme
    const darkOptions = getAllByText("Dark");
    fireEvent.press(darkOptions[darkOptions.length - 1]);

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeNull();
    });
  });

  it("renders with custom className", () => {
    expect(() =>
      render(<ThemeSelector className="custom-class" />),
    ).not.toThrow();
  });
});
