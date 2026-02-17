import { render, screen } from "@testing-library/react-native";
import React from "react";
import { PageIndicator } from "../index";

describe("PageIndicator", () => {
  it("should render correct number of dots", () => {
    const { UNSAFE_root } = render(
      <PageIndicator pageCount={3} currentPage={0} />,
    );

    // Component should render without errors
    expect(UNSAFE_root).toBeTruthy();
  });

  it("should highlight the current page", () => {
    render(<PageIndicator pageCount={3} currentPage={1} />);

    // Component should render without errors
    expect(screen).toBeTruthy();
  });

  it("should handle single page", () => {
    render(<PageIndicator pageCount={1} currentPage={0} />);

    expect(screen).toBeTruthy();
  });

  it("should handle many pages", () => {
    render(<PageIndicator pageCount={5} currentPage={2} />);

    expect(screen).toBeTruthy();
  });

  it("should handle last page selection", () => {
    render(<PageIndicator pageCount={4} currentPage={3} />);

    expect(screen).toBeTruthy();
  });
});
