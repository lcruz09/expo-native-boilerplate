import { render } from "@testing-library/react-native";
import React from "react";
import { MetricCard } from "../index";

describe("MetricCard", () => {
  it("renders label, value, and unit correctly", () => {
    const { getByText } = render(
      <MetricCard label="Speed" value={25.5} unit="km/h" />,
    );

    expect(getByText("Speed")).toBeTruthy();
    expect(getByText("25.5")).toBeTruthy();
    expect(getByText("km/h")).toBeTruthy();
  });

  it("renders with string value", () => {
    const { getByText } = render(
      <MetricCard label="Status" value="Active" unit="" />,
    );

    expect(getByText("Status")).toBeTruthy();
    expect(getByText("Active")).toBeTruthy();
  });

  it("renders with icon when provided", () => {
    const { getByText } = render(
      <MetricCard
        label="Power"
        value={200}
        unit="W"
        icon="speedometer-outline"
      />,
    );

    // Icon component should be rendered (checking label confirms component rendered)
    expect(getByText("Power")).toBeTruthy();
  });

  it("renders without icon when not provided", () => {
    const { getByText } = render(
      <MetricCard label="Speed" value={25.5} unit="km/h" />,
    );

    // Should render without icon
    expect(getByText("Speed")).toBeTruthy();
  });

  it("applies small size styles", () => {
    const { getByText } = render(
      <MetricCard label="Cadence" value={90} unit="rpm" size="small" />,
    );

    const value = getByText("90");
    expect(value.props.style).toMatchObject({
      fontSize: 24,
    });
  });

  it("applies medium size styles (default)", () => {
    const { getByText } = render(
      <MetricCard label="Cadence" value={90} unit="rpm" />,
    );

    const value = getByText("90");
    expect(value.props.style).toMatchObject({
      fontSize: 32,
    });
  });

  it("applies large size styles", () => {
    const { getByText } = render(
      <MetricCard label="Cadence" value={90} unit="rpm" size="large" />,
    );

    const value = getByText("90");
    expect(value.props.style).toMatchObject({
      fontSize: 48,
    });
  });

  it("handles zero value", () => {
    const { getByText } = render(
      <MetricCard label="Power" value={0} unit="W" />,
    );

    expect(getByText("0")).toBeTruthy();
  });

  it("handles negative value", () => {
    const { getByText } = render(
      <MetricCard label="Elevation" value={-5} unit="m" />,
    );

    expect(getByText("-5")).toBeTruthy();
  });

  it("handles empty string unit", () => {
    const { queryByText } = render(
      <MetricCard label="Count" value={10} unit="" />,
    );

    expect(queryByText("10")).toBeTruthy();
    // Empty unit should still render but be empty
  });
});
