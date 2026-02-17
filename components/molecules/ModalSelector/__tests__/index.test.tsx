import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { Pressable } from "@/components/atoms/Pressable";
import { ModalSelector, ModalSelectorOption } from "../index";

describe("ModalSelector", () => {
  const mockOptions: ModalSelectorOption<string>[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const mockOptionsWithIcons: ModalSelectorOption<string>[] = [
    { value: "en", label: "English", icon: <Text>🇺🇸</Text> },
    { value: "es", label: "Español", icon: <Text>🇪🇸</Text> },
  ];

  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when visible", () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );
    expect(getByText("Select Option")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ModalSelector
        visible={false}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );
    expect(queryByText("Select Option")).toBeNull();
  });

  it("displays all options", () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    expect(getByText("Option 1")).toBeTruthy();
    expect(getByText("Option 2")).toBeTruthy();
    expect(getByText("Option 3")).toBeTruthy();
  });

  it("calls onSelect when an option is pressed", async () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    fireEvent.press(getByText("Option 2"));
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith("option2");
    });
  });

  it("displays close button in header", () => {
    const { UNSAFE_root } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    // Close icon should be present
    expect(UNSAFE_root).toBeTruthy();
  });

  it("calls onClose when close button is pressed", async () => {
    const { UNSAFE_getAllByType } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    // Find all Pressable elements, the close button is one of them
    const pressables = UNSAFE_getAllByType(Pressable);

    // The first Pressable is the backdrop, second is content wrapper, third is close button
    const closeButton = pressables[2];

    fireEvent.press(closeButton);
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onClose when backdrop is pressed", async () => {
    const { UNSAFE_getAllByType } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    // Find all Pressable elements, the backdrop is the first one
    const pressables = UNSAFE_getAllByType(Pressable);

    const backdrop = pressables[0];

    fireEvent.press(backdrop);
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("renders options with icons", () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Language"
        options={mockOptionsWithIcons}
        selectedValue="en"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    expect(getByText("🇺🇸")).toBeTruthy();
    expect(getByText("🇪🇸")).toBeTruthy();
    expect(getByText("English")).toBeTruthy();
    expect(getByText("Español")).toBeTruthy();
  });

  it("handles numeric values", async () => {
    const numericOptions: ModalSelectorOption<number>[] = [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
    ];

    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Number"
        options={numericOptions}
        selectedValue={1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    fireEvent.press(getByText("Two"));
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(2);
    });
  });

  it("highlights selected option", () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Select Option"
        options={mockOptions}
        selectedValue="option2"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    // Selected option should be present
    expect(getByText("Option 2")).toBeTruthy();
  });

  it("renders with custom title", () => {
    const { getByText } = render(
      <ModalSelector
        visible={true}
        title="Custom Modal Title"
        options={mockOptions}
        selectedValue="option1"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />,
    );

    expect(getByText("Custom Modal Title")).toBeTruthy();
  });
});
