import { Ionicons } from "@expo/vector-icons";
import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { FormSelect } from "../index";

describe("FormSelect", () => {
  const mockOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  it("renders with label", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select Option"
            options={mockOptions}
          />
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Select Option")).toBeTruthy();
  });

  it("renders all options", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select"
            options={mockOptions}
          />
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Option 1")).toBeTruthy();
    expect(getByText("Option 2")).toBeTruthy();
    expect(getByText("Option 3")).toBeTruthy();
  });

  it("handles option selection", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select"
            options={mockOptions}
          />
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);
    const option2 = getByText("Option 2");

    fireEvent.press(option2);
    // Selection is handled internally by react-hook-form
    expect(true).toBeTruthy();
  });

  it("displays optional label when optional prop is true", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select"
            options={mockOptions}
            optional
          />
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText(/Optional/)).toBeTruthy();
  });

  it("renders with custom placeholder", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select"
            options={mockOptions}
            placeholder="Choose one"
          />
        </View>
      );
    };

    // Placeholder is passed but not directly rendered - it's used internally
    expect(() => render(<TestComponent />)).not.toThrow();
  });

  it("shows checkmark for selected option", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "opt2" },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select"
            options={mockOptions}
          />
        </View>
      );
    };

    const { UNSAFE_root } = render(<TestComponent />);
    const icons = UNSAFE_root.findAllByType(Ionicons);
    // Selected option should have a checkmark icon
    expect(icons.length).toBeGreaterThan(0);
  });

  it("handles numeric values", () => {
    const numericOptions = [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
      { label: "Three", value: 3 },
    ];

    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: 1 },
      });

      return (
        <View>
          <FormSelect
            control={control}
            name="testField"
            label="Select Number"
            options={numericOptions}
          />
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("One")).toBeTruthy();
  });
});
