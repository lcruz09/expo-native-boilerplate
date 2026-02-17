import { render } from "@testing-library/react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import { Spinner } from "../index";

describe("Spinner", () => {
  it("renders correctly", () => {
    const { root } = render(<Spinner />);
    expect(root).toBeTruthy();
  });

  it("renders with default size (small)", () => {
    const { UNSAFE_root } = render(<Spinner />);
    const activityIndicator = UNSAFE_root.findAllByType(ActivityIndicator);
    expect(activityIndicator.length).toBeGreaterThan(0);
    expect(activityIndicator[0].props.size).toBe("small");
  });

  it("renders with large size", () => {
    const { UNSAFE_root } = render(<Spinner size="large" />);
    const activityIndicator = UNSAFE_root.findAllByType(ActivityIndicator);
    expect(activityIndicator[0].props.size).toBe("large");
  });

  it("renders with default color", () => {
    const { UNSAFE_root } = render(<Spinner />);
    const activityIndicator = UNSAFE_root.findAllByType(ActivityIndicator);
    expect(activityIndicator[0].props.color).toBe("#00E1A9");
  });

  it("renders with custom color", () => {
    const { UNSAFE_root } = render(<Spinner color="#FF0000" />);
    const activityIndicator = UNSAFE_root.findAllByType(ActivityIndicator);
    expect(activityIndicator[0].props.color).toBe("#FF0000");
  });

  it("accepts additional ActivityIndicator props", () => {
    expect(() =>
      render(<Spinner testID="my-spinner" animating={true} />),
    ).not.toThrow();
  });

  it("renders with all props", () => {
    expect(() =>
      render(
        <Spinner
          size="large"
          color="#00FF00"
          testID="full-spinner"
          animating={true}
        />,
      ),
    ).not.toThrow();
  });
});
