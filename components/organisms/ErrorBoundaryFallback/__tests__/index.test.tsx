import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { ErrorBoundaryFallback } from "../index";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe("ErrorBoundaryFallback", () => {
  const mockReplace = jest.fn();
  const globalWithDev = global as typeof globalThis & { __DEV__: boolean };
  const originalDev = globalWithDev.__DEV__;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterAll(() => {
    globalWithDev.__DEV__ = originalDev;
  });

  it("renders the error message when in dev mode", () => {
    globalWithDev.__DEV__ = true;
    const error = new Error("Dev only message");

    const { getByText } = render(<ErrorBoundaryFallback error={error} />);

    expect(getByText("Dev only message")).toBeTruthy();
  });

  it("renders the generic description when not in dev mode", () => {
    globalWithDev.__DEV__ = false;

    const { getByText } = render(<ErrorBoundaryFallback />);

    expect(getByText("errors.boundary.description")).toBeTruthy();
  });

  it("navigates home and resets the boundary when action is pressed", async () => {
    const resetError = jest.fn();
    globalWithDev.__DEV__ = false;

    const { getByText } = render(
      <ErrorBoundaryFallback resetError={resetError} />,
    );

    fireEvent.press(getByText("errors.boundary.cta"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
    expect(resetError).toHaveBeenCalled();
  });
});
