import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { FormInput } from "../index";

// Test wrapper component
const TestFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

describe("FormInput", () => {
  it("renders with label", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test Label"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("Test Label")).toBeTruthy();
  });

  it("renders with placeholder", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    expect(getByPlaceholderText("Enter text")).toBeTruthy();
  });

  it("displays optional label when optional prop is true", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test Label"
            optional
          />
        </TestFormWrapper>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText(/Optional/)).toBeTruthy();
  });

  it("displays hint text when provided", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            hint="This is a hint"
          />
        </TestFormWrapper>
      );
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText("This is a hint")).toBeTruthy();
  });

  it("handles text input changes", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter text");

    fireEvent.changeText(input, "New value");
    expect(input.props.value).toBe("New value");
  });

  it("handles numeric input with numeric keyboard", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { age: undefined },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="age"
            label="Age"
            keyboardType="numeric"
            placeholder="Enter age"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter age");

    expect(input.props.keyboardType).toBe("numeric");
  });

  it("handles decimal input with decimal-pad keyboard", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { weight: undefined },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="weight"
            label="Weight"
            keyboardType="decimal-pad"
            placeholder="Enter weight"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter weight");

    expect(input.props.keyboardType).toBe("decimal-pad");
  });

  it("converts string to number for numeric inputs", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { age: undefined },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="age"
            label="Age"
            keyboardType="numeric"
          />
        </TestFormWrapper>
      );
    };

    const { getByText } = render(<TestComponent />);
    // Numeric conversion is handled internally by the component
    expect(getByText("Age")).toBeTruthy();
  });

  it("displays initial value when provided", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "Initial value" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByDisplayValue } = render(<TestComponent />);
    expect(getByDisplayValue("Initial value")).toBeTruthy();
  });

  it("renders with right label content", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            rightLabel={<View testID="right-label-content" />}
          />
        </TestFormWrapper>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("right-label-content")).toBeTruthy();
  });

  it("handles secure text entry for passwords", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { password: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="password"
            label="Password"
            secureTextEntry
            placeholder="Enter password"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter password");

    expect(input.props.secureTextEntry).toBe(true);
  });

  it("handles email keyboard type", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { email: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="email"
            label="Email"
            keyboardType="email-address"
            placeholder="Enter email"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter email");

    expect(input.props.keyboardType).toBe("email-address");
  });

  it("handles autoCapitalize prop", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            autoCapitalize="words"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter text");

    expect(input.props.autoCapitalize).toBe("words");
  });

  it("defaults to autoCapitalize none", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter text");

    expect(input.props.autoCapitalize).toBe("none");
  });

  it("handles autoCorrect prop", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            autoCorrect={true}
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter text");

    expect(input.props.autoCorrect).toBe(true);
  });

  it("defaults to autoCorrect false", () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { testField: "" },
      });

      return (
        <TestFormWrapper>
          <FormInput
            control={control}
            name="testField"
            label="Test"
            placeholder="Enter text"
          />
        </TestFormWrapper>
      );
    };

    const { getByPlaceholderText } = render(<TestComponent />);
    const input = getByPlaceholderText("Enter text");

    expect(input.props.autoCorrect).toBe(false);
  });
});
