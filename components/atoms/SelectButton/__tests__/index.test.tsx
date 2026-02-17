import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { SelectButton } from "../index";

describe("SelectButton", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders with label", () => {
    const { getByText } = render(
      <SelectButton label="Test Option" onPress={mockOnPress} />,
    );
    expect(getByText("Test Option")).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const { getByText } = render(
      <SelectButton label="Test Option" onPress={mockOnPress} />,
    );
    fireEvent.press(getByText("Test Option"));
    await waitFor(() => {
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  it("renders with icon", () => {
    const { getByText } = render(
      <SelectButton
        label="Test Option"
        icon={<Text>🇺🇸</Text>}
        onPress={mockOnPress}
      />,
    );
    expect(getByText("🇺🇸")).toBeTruthy();
    expect(getByText("Test Option")).toBeTruthy();
  });

  it("renders without icon", () => {
    const { getByText } = render(
      <SelectButton label="Test Option" onPress={mockOnPress} />,
    );
    expect(getByText("Test Option")).toBeTruthy();
    // Icon should not be present
  });

  it("renders with selected prop as true", () => {
    expect(() =>
      render(
        <SelectButton label="Test Option" selected onPress={mockOnPress} />,
      ),
    ).not.toThrow();
  });

  it("renders with selected prop as false", () => {
    expect(() =>
      render(
        <SelectButton
          label="Test Option"
          selected={false}
          onPress={mockOnPress}
        />,
      ),
    ).not.toThrow();
  });

  it("renders without selected prop", () => {
    expect(() =>
      render(<SelectButton label="Test Option" onPress={mockOnPress} />),
    ).not.toThrow();
  });

  it("accepts custom className", () => {
    expect(() =>
      render(
        <SelectButton
          label="Test Option"
          onPress={mockOnPress}
          className="custom-class"
        />,
      ),
    ).not.toThrow();
  });

  it("accepts different selected states without errors", () => {
    const { rerender } = render(
      <SelectButton
        label="Test Option"
        selected={false}
        onPress={mockOnPress}
      />,
    );
    expect(() =>
      rerender(
        <SelectButton label="Test Option" selected onPress={mockOnPress} />,
      ),
    ).not.toThrow();
  });

  it("renders correctly with all props", () => {
    expect(() =>
      render(
        <SelectButton
          label="Test Option"
          icon={<Text>🇺🇸</Text>}
          selected
          onPress={mockOnPress}
          className="custom-class"
        />,
      ),
    ).not.toThrow();
  });
});
