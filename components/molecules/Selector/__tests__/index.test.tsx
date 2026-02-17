import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Selector, SelectorOption } from "../index";

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

describe("Selector", () => {
  const mockOptions: SelectorOption<string>[] = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3", label: "Option 3" },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { root } = render(
      <Selector
        title="Select"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />,
    );
    expect(root).toBeTruthy();
  });

  it("displays selected option label", () => {
    const { getByText } = render(
      <Selector
        title="Select"
        options={mockOptions}
        value="opt2"
        onChange={mockOnChange}
      />,
    );
    expect(getByText("Option 2")).toBeTruthy();
  });

  it("displays placeholder when no value selected", () => {
    const { getByText } = render(
      <Selector
        title="Select"
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        placeholder="Choose one"
      />,
    );
    expect(getByText("Choose one")).toBeTruthy();
  });

  it("displays default placeholder", () => {
    const { getByText } = render(
      <Selector
        title="Select"
        options={mockOptions}
        value={undefined}
        onChange={mockOnChange}
      />,
    );
    expect(getByText("Select")).toBeTruthy();
  });

  it("opens modal when button is pressed", async () => {
    const { getByText, queryByTestId } = render(
      <Selector
        title="Select Option"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />,
    );

    // Modal should not be visible initially
    expect(queryByTestId("mock-modal-selector")).toBeNull();

    // Press the select button
    fireEvent.press(getByText("Option 1"));

    // Modal should now be visible
    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });
  });

  it("calls onChange when an option is selected", async () => {
    const { getByText } = render(
      <Selector
        title="Select Option"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />,
    );

    // Open modal
    fireEvent.press(getByText("Option 1"));

    // Select a different option
    await waitFor(() => {
      fireEvent.press(getByText("Option 3"));
    });

    expect(mockOnChange).toHaveBeenCalledWith("opt3");
  });

  it("closes modal after selection", async () => {
    const { getByText, queryByTestId } = render(
      <Selector
        title="Select Option"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />,
    );

    // Open modal
    fireEvent.press(getByText("Option 1"));

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeTruthy();
    });

    // Select an option
    fireEvent.press(getByText("Option 2"));

    await waitFor(() => {
      expect(queryByTestId("mock-modal-selector")).toBeNull();
    });
  });

  it("handles options with string icons", () => {
    const optionsWithIcons: SelectorOption<string>[] = [
      { value: "home", label: "Home", icon: "home-outline" },
      { value: "heart", label: "Heart", icon: "heart-outline" },
    ];

    const { getByText } = render(
      <Selector
        title="Select"
        options={optionsWithIcons}
        value="home"
        onChange={mockOnChange}
      />,
    );

    expect(getByText("Home")).toBeTruthy();
  });

  it("handles numeric values", () => {
    const numericOptions: SelectorOption<number>[] = [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
    ];

    const mockNumberChange = jest.fn();

    const { getByText } = render(
      <Selector
        title="Select Number"
        options={numericOptions}
        value={1}
        onChange={mockNumberChange}
      />,
    );

    expect(getByText("One")).toBeTruthy();
  });

  it("updates when value changes", () => {
    const { getByText, rerender } = render(
      <Selector
        title="Select"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />,
    );
    expect(getByText("Option 1")).toBeTruthy();

    rerender(
      <Selector
        title="Select"
        options={mockOptions}
        value="opt3"
        onChange={mockOnChange}
      />,
    );
    expect(getByText("Option 3")).toBeTruthy();
  });
});
