import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Button } from "../index";

describe("Button", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders with text children", () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Click Me</Button>,
    );
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Click Me</Button>,
    );
    fireEvent.press(getByText("Click Me"));
    await waitFor(() => {
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  it("renders with default variant (primary)", () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Primary Button</Button>,
    );
    expect(getByText("Primary Button")).toBeTruthy();
  });

  it("renders with secondary variant", () => {
    const { getByText } = render(
      <Button variant="secondary" onPress={mockOnPress}>
        Secondary Button
      </Button>,
    );
    expect(getByText("Secondary Button")).toBeTruthy();
  });

  it("renders with danger variant", () => {
    const { getByText } = render(
      <Button variant="danger" onPress={mockOnPress}>
        Danger Button
      </Button>,
    );
    expect(getByText("Danger Button")).toBeTruthy();
  });

  it("renders with small size", () => {
    const { getByText } = render(
      <Button size="small" onPress={mockOnPress}>
        Small Button
      </Button>,
    );
    expect(getByText("Small Button")).toBeTruthy();
  });

  it("renders with medium size (default)", () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Medium Button</Button>,
    );
    expect(getByText("Medium Button")).toBeTruthy();
  });

  it("renders with large size", () => {
    const { getByText } = render(
      <Button size="large" onPress={mockOnPress}>
        Large Button
      </Button>,
    );
    expect(getByText("Large Button")).toBeTruthy();
  });

  it("handles disabled state", () => {
    const { getByText } = render(
      <Button disabled onPress={mockOnPress}>
        Disabled Button
      </Button>,
    );
    fireEvent.press(getByText("Disabled Button"));
    // Button should not call onPress when disabled
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders with fullWidth prop", () => {
    expect(() =>
      render(
        <Button fullWidth onPress={mockOnPress}>
          Full Width Button
        </Button>,
      ),
    ).not.toThrow();
  });

  it("renders with custom className", () => {
    expect(() =>
      render(
        <Button onPress={mockOnPress} className="custom-class">
          Custom Button
        </Button>,
      ),
    ).not.toThrow();
  });

  it("accepts testID prop", () => {
    const { getByTestId } = render(
      <Button onPress={mockOnPress} testID="my-button">
        Test Button
      </Button>,
    );
    expect(getByTestId("my-button")).toBeTruthy();
  });

  it("renders with non-string children", () => {
    const CustomChild = () => <></>;
    expect(() =>
      render(
        <Button onPress={mockOnPress}>
          <CustomChild />
        </Button>,
      ),
    ).not.toThrow();
  });

  it("renders correctly with all props", () => {
    expect(() =>
      render(
        <Button
          variant="danger"
          size="large"
          fullWidth
          disabled={false}
          onPress={mockOnPress}
          className="custom"
          testID="full-button"
        >
          Full Props Button
        </Button>,
      ),
    ).not.toThrow();
  });
});
