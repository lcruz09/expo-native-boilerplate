import { renderHook } from "@testing-library/react-native";
import { useNotification } from "../useNotification";

// Mock the notification store
const mockAddNotification = jest.fn();
const mockRemoveNotification = jest.fn();
const mockClearAll = jest.fn();

jest.mock("@/stores/notifications/notificationStore", () => ({
  useNotificationStore: jest.fn(() => ({
    addNotification: mockAddNotification,
    removeNotification: mockRemoveNotification,
    clearAll: mockClearAll,
  })),
}));

describe("useNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("showNotification", () => {
    it("should call addNotification with correct input", () => {
      mockAddNotification.mockReturnValue("test-id-123");

      const { result } = renderHook(() => useNotification());

      const id = result.current.showNotification({
        type: "success",
        title: "Test notification",
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "success",
        title: "Test notification",
      });
      expect(id).toBe("test-id-123");
    });

    it("should pass through all notification properties", () => {
      mockAddNotification.mockReturnValue("test-id");

      const { result } = renderHook(() => useNotification());
      const mockAction = jest.fn();
      const renderContent = () => null;

      result.current.showNotification({
        type: "error",
        title: "Error title",
        description: "Error description",
        persistent: true,
        actions: [
          {
            label: "Retry",
            onPress: mockAction,
            variant: "primary",
          },
        ],
        renderContent,
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "error",
        title: "Error title",
        description: "Error description",
        persistent: true,
        actions: [
          {
            label: "Retry",
            onPress: mockAction,
            variant: "primary",
          },
        ],
        renderContent,
      });
    });

    it("should return notification ID for manual dismissal", () => {
      mockAddNotification.mockReturnValue("notification-uuid");

      const { result } = renderHook(() => useNotification());

      const id = result.current.showNotification({
        type: "info",
        title: "Info",
      });

      expect(id).toBe("notification-uuid");
    });

    it("should handle success type", () => {
      const { result } = renderHook(() => useNotification());

      result.current.showNotification({
        type: "success",
        title: "Success!",
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "success",
        title: "Success!",
      });
    });

    it("should handle warning type", () => {
      const { result } = renderHook(() => useNotification());

      result.current.showNotification({
        type: "warning",
        title: "Warning!",
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "warning",
        title: "Warning!",
      });
    });

    it("should handle error type", () => {
      const { result } = renderHook(() => useNotification());

      result.current.showNotification({
        type: "error",
        title: "Error!",
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "error",
        title: "Error!",
      });
    });

    it("should handle info type", () => {
      const { result } = renderHook(() => useNotification());

      result.current.showNotification({
        type: "info",
        title: "Info!",
      });

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: "info",
        title: "Info!",
      });
    });
  });

  describe("dismissNotification", () => {
    it("should call removeNotification with correct ID", () => {
      const { result } = renderHook(() => useNotification());

      result.current.dismissNotification("test-id");

      expect(mockRemoveNotification).toHaveBeenCalledWith("test-id");
    });

    it("should handle multiple dismiss calls", () => {
      const { result } = renderHook(() => useNotification());

      result.current.dismissNotification("id-1");
      result.current.dismissNotification("id-2");
      result.current.dismissNotification("id-3");

      expect(mockRemoveNotification).toHaveBeenCalledTimes(3);
      expect(mockRemoveNotification).toHaveBeenNthCalledWith(1, "id-1");
      expect(mockRemoveNotification).toHaveBeenNthCalledWith(2, "id-2");
      expect(mockRemoveNotification).toHaveBeenNthCalledWith(3, "id-3");
    });
  });

  describe("clearAllNotifications", () => {
    it("should call clearAll", () => {
      const { result } = renderHook(() => useNotification());

      result.current.clearAllNotifications();

      expect(mockClearAll).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple clear calls", () => {
      const { result } = renderHook(() => useNotification());

      result.current.clearAllNotifications();
      result.current.clearAllNotifications();

      expect(mockClearAll).toHaveBeenCalledTimes(2);
    });
  });

  describe("hook stability", () => {
    it("should return stable function references", () => {
      const { result, rerender } = renderHook(() => useNotification());

      const firstRender = {
        showNotification: result.current.showNotification,
        dismissNotification: result.current.dismissNotification,
        clearAllNotifications: result.current.clearAllNotifications,
      };

      rerender({});

      const secondRender = {
        showNotification: result.current.showNotification,
        dismissNotification: result.current.dismissNotification,
        clearAllNotifications: result.current.clearAllNotifications,
      };

      // Functions should be the same reference (memoized)
      expect(firstRender.showNotification).toBe(secondRender.showNotification);
      expect(firstRender.dismissNotification).toBe(
        secondRender.dismissNotification,
      );
      expect(firstRender.clearAllNotifications).toBe(
        secondRender.clearAllNotifications,
      );
    });
  });

  describe("integration workflow", () => {
    it("should support show and dismiss workflow", () => {
      mockAddNotification.mockReturnValue("test-id");

      const { result } = renderHook(() => useNotification());

      // Show notification
      const id = result.current.showNotification({
        type: "success",
        title: "Test",
      });

      expect(mockAddNotification).toHaveBeenCalled();
      expect(id).toBe("test-id");

      // Dismiss notification
      result.current.dismissNotification(id);

      expect(mockRemoveNotification).toHaveBeenCalledWith("test-id");
    });

    it("should support show multiple and clear all workflow", () => {
      mockAddNotification
        .mockReturnValueOnce("id-1")
        .mockReturnValueOnce("id-2")
        .mockReturnValueOnce("id-3");

      const { result } = renderHook(() => useNotification());

      // Show multiple notifications
      result.current.showNotification({ type: "success", title: "1" });
      result.current.showNotification({ type: "warning", title: "2" });
      result.current.showNotification({ type: "error", title: "3" });

      expect(mockAddNotification).toHaveBeenCalledTimes(3);

      // Clear all
      result.current.clearAllNotifications();

      expect(mockClearAll).toHaveBeenCalled();
    });
  });
});
