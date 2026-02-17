import { Icon } from "@/components/atoms/Icon";
import { Pressable } from "@/components/atoms/Pressable";
import { ROUTES } from "@/constants/routes";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { View as RNView } from "react-native";
import { TabBar } from "../index";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("TabBar", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  describe("rendering", () => {
    it("renders correctly", () => {
      const { root } = render(
        <TabBar currentRoute={ROUTES.HOME} bottomInset={0} />,
      );
      expect(root).toBeTruthy();
    });

    it("renders all 3 tabs", () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.HOME} />);

      expect(getByText("navigation.home")).toBeTruthy();
      expect(getByText("workouts.start")).toBeTruthy();
      expect(getByText("navigation.settings")).toBeTruthy();
    });

    it("renders icons for all tabs", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      // Expect 3 Icon components (one for each tab)
      const icons = UNSAFE_getAllByType(Icon);
      expect(icons.length).toBe(3);
    });

    it("applies bottom inset padding", () => {
      const { UNSAFE_getByType } = render(
        <TabBar currentRoute={ROUTES.HOME} bottomInset={34} />,
      );

      const containerView = UNSAFE_getByType(RNView);
      expect(containerView.props.style.paddingBottom).toBe(34);
    });

    it("uses default bottom inset of 0 when not provided", () => {
      const { UNSAFE_getByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      const containerView = UNSAFE_getByType(RNView);
      expect(containerView.props.style.paddingBottom).toBe(0);
    });
  });

  describe("active state styling", () => {
    it("highlights Home tab when on home route", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      const icons = UNSAFE_getAllByType(Icon);

      // First icon (Home) should have primary color
      const homeIcon = icons[0];
      expect(homeIcon.props.name).toBe("home");
      // Colors are mocked in jest.setup.js, primary is "#00E1A9"
      expect(homeIcon.props.color).toBe("#00E1A9");
    });

    it("highlights Start Workout tab when on start-workout route", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.START_WORKOUT} />,
      );

      const icons = UNSAFE_getAllByType(Icon);

      // Second icon (Start Workout) should have primary color
      const startWorkoutIcon = icons[1];
      expect(startWorkoutIcon.props.name).toBe("play-circle-outline");
      expect(startWorkoutIcon.props.color).toBe("#00E1A9");
    });

    it("highlights Settings tab when on settings route", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.SETTINGS} />,
      );

      const icons = UNSAFE_getAllByType(Icon);

      // Third icon (Settings) should have primary color
      const settingsIcon = icons[2];
      expect(settingsIcon.props.name).toBe("settings-outline");
      expect(settingsIcon.props.color).toBe("#00E1A9");
    });

    it("shows inactive tabs in secondary color", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      const icons = UNSAFE_getAllByType(Icon);

      // Second and third icons should have secondary text color
      const startWorkoutIcon = icons[1];
      const settingsIcon = icons[2];

      // Colors are mocked in jest.mocks.js, text.secondary is "#666666"
      expect(startWorkoutIcon.props.color).toBe("#666666");
      expect(settingsIcon.props.color).toBe("#666666");
    });
  });

  describe("navigation", () => {
    it("navigates to home when Home tab is pressed", async () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.SETTINGS} />);

      const homeTab = getByText("navigation.home");
      fireEvent.press(homeTab);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.HOME);
      });
    });

    it("navigates to start-workout when Start Workout tab is pressed", async () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.HOME} />);

      const startWorkoutTab = getByText("workouts.start");
      fireEvent.press(startWorkoutTab);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.START_WORKOUT);
      });
    });

    it("navigates to settings when Settings tab is pressed", async () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.HOME} />);

      const settingsTab = getByText("navigation.settings");
      fireEvent.press(settingsTab);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.SETTINGS);
      });
    });

    it("does not navigate when pressing currently active tab", async () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.HOME} />);

      const homeTab = getByText("navigation.home");
      fireEvent.press(homeTab);

      await waitFor(() => {
        expect(mockReplace).not.toHaveBeenCalled();
      });
    });

    it("navigates when pressing active tab from a different route", async () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.SETTINGS} />);

      const homeTab = getByText("navigation.home");
      fireEvent.press(homeTab);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(ROUTES.HOME);
      });
    });
  });

  describe("theme integration", () => {
    it("applies theme colors correctly", () => {
      const { UNSAFE_getByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      // The main container View should have theme-aware background
      const containerView = UNSAFE_getByType(RNView);
      expect(containerView.props.style).toMatchObject({
        backgroundColor: "#FFFFFF",
      });
    });

    it("uses background color from theme", () => {
      const { UNSAFE_getByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      const containerView = UNSAFE_getByType(RNView);
      // Check that backgroundColor is from theme (colors.card)
      expect(containerView.props.style.backgroundColor).toBeDefined();
    });
  });

  describe("accessibility", () => {
    it("uses Pressable component for haptic feedback", () => {
      const { UNSAFE_getAllByType } = render(
        <TabBar currentRoute={ROUTES.HOME} />,
      );

      const pressables = UNSAFE_getAllByType(Pressable);

      // Should have 3 Pressable components (one for each tab)
      expect(pressables.length).toBe(3);
    });
  });

  describe("internationalization", () => {
    it("displays translated labels", () => {
      const { getByText } = render(<TabBar currentRoute={ROUTES.HOME} />);

      // Translation keys are mocked in jest.mocks.js to return the key as-is
      expect(getByText("navigation.home")).toBeTruthy();
      expect(getByText("workouts.start")).toBeTruthy();
      expect(getByText("navigation.settings")).toBeTruthy();
    });
  });
});
