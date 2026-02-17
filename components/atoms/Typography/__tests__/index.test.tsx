import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Typography } from "../index";

describe("Typography", () => {
  it("renders text content", () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("applies default variant (body)", () => {
    const { getByText } = render(<Typography>Default Text</Typography>);
    const text = getByText("Default Text");
    expect(text.props.className).toContain("text-base");
  });

  it("applies title variant", () => {
    const { getByText } = render(
      <Typography variant="title">Title Text</Typography>,
    );
    const text = getByText("Title Text");
    expect(text.props.className).toContain("text-2xl");
    expect(text.props.className).toContain("font-bold");
  });

  it("applies subtitle variant", () => {
    const { getByText } = render(
      <Typography variant="subtitle">Subtitle Text</Typography>,
    );
    const text = getByText("Subtitle Text");
    expect(text.props.className).toContain("text-xl");
    expect(text.props.className).toContain("font-semibold");
  });

  it("applies caption variant", () => {
    const { getByText } = render(
      <Typography variant="caption">Caption Text</Typography>,
    );
    const text = getByText("Caption Text");
    expect(text.props.className).toContain("text-sm");
  });

  it("applies display variant", () => {
    const { getByText } = render(
      <Typography variant="display">Display Text</Typography>,
    );
    const text = getByText("Display Text");
    expect(text.props.className).toContain("text-6xl");
    expect(text.props.className).toContain("font-bold");
  });

  it("applies label variant", () => {
    const { getByText } = render(
      <Typography variant="label">Label Text</Typography>,
    );
    const text = getByText("Label Text");
    expect(text.props.className).toContain("text-lg");
    expect(text.props.className).toContain("font-semibold");
  });

  it("applies default color (primary)", () => {
    const { getByText } = render(<Typography>Primary Color</Typography>);
    const text = getByText("Primary Color");
    expect(text.props.className).toContain("text-text-primary");
  });

  it("applies secondary color", () => {
    const { getByText } = render(
      <Typography color="secondary">Secondary Color</Typography>,
    );
    const text = getByText("Secondary Color");
    expect(text.props.className).toContain("text-text-secondary");
  });

  it("applies accent color", () => {
    const { getByText } = render(
      <Typography color="accent">Accent Color</Typography>,
    );
    const text = getByText("Accent Color");
    expect(text.props.className).toContain("text-primary");
  });

  it("applies success color", () => {
    const { getByText } = render(
      <Typography color="success">Success Color</Typography>,
    );
    const text = getByText("Success Color");
    expect(text.props.className).toContain("text-green-600");
  });

  it("applies warning color", () => {
    const { getByText } = render(
      <Typography color="warning">Warning Color</Typography>,
    );
    const text = getByText("Warning Color");
    expect(text.props.className).toContain("text-accent");
  });

  it("applies danger color", () => {
    const { getByText } = render(
      <Typography color="danger">Danger Color</Typography>,
    );
    const text = getByText("Danger Color");
    expect(text.props.className).toContain("text-red-600");
  });

  it("applies centered alignment", () => {
    const { getByText } = render(<Typography centered>Centered</Typography>);
    const text = getByText("Centered");
    expect(text.props.className).toContain("text-center");
  });

  it("does not apply centered alignment by default", () => {
    const { getByText } = render(<Typography>Not Centered</Typography>);
    const text = getByText("Not Centered");
    expect(text.props.className).not.toContain("text-center");
  });

  it("accepts custom className", () => {
    const { getByText } = render(
      <Typography className="custom-class">Custom Class</Typography>,
    );
    const text = getByText("Custom Class");
    expect(text.props.className).toContain("custom-class");
  });

  it("passes through additional RNText props", () => {
    const { getByText } = render(
      <Typography numberOfLines={1} ellipsizeMode="tail">
        Long Text
      </Typography>,
    );
    const text = getByText("Long Text");
    expect(text.props.numberOfLines).toBe(1);
    expect(text.props.ellipsizeMode).toBe("tail");
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <Typography>
        <Typography variant="caption">Nested</Typography>
      </Typography>,
    );
    expect(getByText("Nested")).toBeTruthy();
  });
});
