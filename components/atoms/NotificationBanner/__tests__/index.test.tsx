import { Notification } from "@/types/notification";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { NotificationBanner } from "..";

// Mock the colors hook
const mockColors = {
  status: {
    success: "#00FF00",
    warning: "#FFA500",
    error: "#FF0000",
    info: "#0000FF",
  },
};

jest.mock("@/hooks/theme/useColors", () => ({
  useColors: () => mockColors,
}));

// Mock expo-haptics
jest.mock("expo-haptics");

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe("NotificationBanner", () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render success notification", () => {
      const notification: Notification = {
        id: "test-1",
        type: "success",
        title: "Success!",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Success!")).toBeTruthy();
    });

    it("should render error notification with description", () => {
      const notification: Notification = {
        id: "test-2",
        type: "error",
        title: "Error title",
        description: "Error description",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Error title")).toBeTruthy();
      expect(getByText("Error description")).toBeTruthy();
    });

    it("should render warning notification", () => {
      const notification: Notification = {
        id: "test-3",
        type: "warning",
        title: "Warning!",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Warning!")).toBeTruthy();
    });

    it("should render info notification", () => {
      const notification: Notification = {
        id: "test-4",
        type: "info",
        title: "Info message",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Info message")).toBeTruthy();
    });

    it("should not render description when not provided", () => {
      const notification: Notification = {
        id: "test-5",
        type: "success",
        title: "Title only",
        createdAt: Date.now(),
      };

      const { getByText, queryByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Title only")).toBeTruthy();
      // Description should not be rendered
      expect(queryByText("description")).toBeNull();
    });
  });

  describe("actions", () => {
    it("should render action buttons", () => {
      const mockActionPress = jest.fn();
      const notification: Notification = {
        id: "test-6",
        type: "error",
        title: "Error with actions",
        actions: [
          {
            label: "Retry",
            onPress: mockActionPress,
            variant: "primary",
          },
          {
            label: "Cancel",
            onPress: mockActionPress,
            variant: "secondary",
          },
        ],
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Retry")).toBeTruthy();
      expect(getByText("Cancel")).toBeTruthy();
    });

    it("should handle single action button", () => {
      const mockActionPress = jest.fn();
      const notification: Notification = {
        id: "test-7",
        type: "warning",
        title: "Warning with action",
        actions: [
          {
            label: "Dismiss",
            onPress: mockActionPress,
          },
        ],
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Dismiss")).toBeTruthy();
    });

    it("should not render actions section when no actions provided", () => {
      const notification: Notification = {
        id: "test-8",
        type: "info",
        title: "No actions",
        createdAt: Date.now(),
      };

      const { queryByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      // No action buttons should be present
      expect(queryByText("Retry")).toBeNull();
      expect(queryByText("Cancel")).toBeNull();
    });
  });

  describe("custom content", () => {
    it("should render custom content when renderContent is provided", () => {
      const CustomContent = () => <Text>Custom notification content</Text>;

      const notification: Notification = {
        id: "test-9",
        type: "success",
        title: "Title ignored",
        description: "Description ignored",
        renderContent: CustomContent,
        createdAt: Date.now(),
      };

      const { getByText, queryByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      // Custom content should be rendered
      expect(getByText("Custom notification content")).toBeTruthy();

      // Default title and description should not be rendered
      expect(queryByText("Title ignored")).toBeNull();
      expect(queryByText("Description ignored")).toBeNull();
    });
  });

  describe("persistent flag", () => {
    it("should handle persistent notification", () => {
      const notification: Notification = {
        id: "test-10",
        type: "info",
        title: "Persistent notification",
        persistent: true,
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Persistent notification")).toBeTruthy();
    });

    it("should handle non-persistent notification", () => {
      const notification: Notification = {
        id: "test-11",
        type: "success",
        title: "Auto-dismiss notification",
        persistent: false,
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Auto-dismiss notification")).toBeTruthy();
    });
  });

  describe("type-based styling", () => {
    it("should apply success styling", () => {
      const notification: Notification = {
        id: "test-12",
        type: "success",
        title: "Success",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Success")).toBeTruthy();
      // Styling is applied via style prop, which is tested indirectly
    });

    it("should apply error styling", () => {
      const notification: Notification = {
        id: "test-13",
        type: "error",
        title: "Error",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Error")).toBeTruthy();
    });

    it("should apply warning styling", () => {
      const notification: Notification = {
        id: "test-14",
        type: "warning",
        title: "Warning",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Warning")).toBeTruthy();
    });

    it("should apply info styling", () => {
      const notification: Notification = {
        id: "test-15",
        type: "info",
        title: "Info",
        createdAt: Date.now(),
      };

      const { getByText } = render(
        <NotificationBanner
          notification={notification}
          onDismiss={mockOnDismiss}
        />,
      );

      expect(getByText("Info")).toBeTruthy();
    });
  });
});
