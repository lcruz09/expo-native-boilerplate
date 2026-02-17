import { render } from "@testing-library/react-native";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { FormSelector } from "../index";

interface SelectorProps {
  title: string;
  options: { label: string; value: string | number; icon?: string }[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

// Mock Selector component
jest.mock("@/components/molecules/Selector", () => ({
  Selector: ({
    title,
    options,
    value,
    onChange,
    placeholder,
  }: SelectorProps) => {
    const {
      View: MockView,
      Text,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require("react-native");
    return (
      <MockView testID="mock-selector">
        <Text>{title}</Text>
        {placeholder && <Text>{placeholder}</Text>}
      </MockView>
    );
  },
}));

describe("FormSelector", () => {
  const mockOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  it("renders with label", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select Option"
              title="Choose One"
              options={mockOptions}
            />
          </View>
        </FormProvider>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Select Option")).toBeTruthy();
  });

  it("renders Selector with title", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select"
              title="Choose One"
              options={mockOptions}
            />
          </View>
        </FormProvider>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Choose One")).toBeTruthy();
  });

  it("displays optional label when optional prop is true", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select"
              title="Choose"
              options={mockOptions}
              optional
            />
          </View>
        </FormProvider>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText(/Optional/)).toBeTruthy();
  });

  it("renders with placeholder", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select"
              title="Choose"
              options={mockOptions}
              placeholder="Pick one"
            />
          </View>
        </FormProvider>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Pick one")).toBeTruthy();
  });

  it("renders Selector component", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select"
              title="Choose"
              options={mockOptions}
            />
          </View>
        </FormProvider>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("mock-selector")).toBeTruthy();
  });

  it("handles initial value", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { testField: "opt2" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="testField"
              label="Select"
              title="Choose"
              options={mockOptions}
            />
          </View>
        </FormProvider>
      );
    };

    expect(() => render(<TestComponent />)).not.toThrow();
  });

  it("works with options containing icons", () => {
    const iconOptions = [
      { label: "Male", value: "male", icon: "male" },
      { label: "Female", value: "female", icon: "female" },
    ];

    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { gender: "" },
      });

      return (
        <FormProvider {...methods}>
          <View>
            <FormSelector
              name="gender"
              label="Gender"
              title="Select Gender"
              options={iconOptions}
            />
          </View>
        </FormProvider>
      );
    };

    expect(() => render(<TestComponent />)).not.toThrow();
  });
});
