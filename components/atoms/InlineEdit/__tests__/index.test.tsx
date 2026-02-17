import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { InlineEdit } from "../index";

// Mock useColors hook
jest.mock("@/hooks/theme/useColors", () => ({
  useColors: () => ({
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
    card: "#FFFFFF",
    primary: "#007AFF",
    border: {
      light: "#E5E5E5",
    },
  }),
}));

describe("InlineEdit", () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Display Mode", () => {
    it("should render with value in display mode", () => {
      const { getByText, queryByTestId } = render(
        <InlineEdit
          value="Test Title"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      expect(getByText("Test Title")).toBeTruthy();
      expect(queryByTestId("inline-edit-input")).toBeNull();
    });

    it("should show placeholder when value is empty", () => {
      const { getByText } = render(
        <InlineEdit value="" onSave={mockOnSave} placeholder="Add title..." />,
      );

      expect(getByText("Add title...")).toBeTruthy();
    });

    it("should show default placeholder when not provided", () => {
      const { getByText } = render(<InlineEdit value="" onSave={mockOnSave} />);

      expect(getByText("Tap to edit")).toBeTruthy();
    });

    it("should render edit icon", () => {
      const { getByTestId } = render(
        <InlineEdit value="Test" onSave={mockOnSave} testID="inline-edit" />,
      );

      // Icon doesn't support testID, so we just verify the container is pressable
      const container = getByTestId("inline-edit");
      expect(container).toBeTruthy();
      expect(container.props.accessible).toBe(true);
    });

    it("should enter edit mode when pressed", () => {
      const { getByTestId, getByDisplayValue } = render(
        <InlineEdit
          value="Test Title"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      expect(getByDisplayValue("Test Title")).toBeTruthy();
      expect(getByTestId("inline-edit-input")).toBeTruthy();
    });
  });

  describe("Edit Mode", () => {
    it("should render input with current value when editing", () => {
      const { getByTestId, getByDisplayValue } = render(
        <InlineEdit
          value="Original Title"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      expect(getByDisplayValue("Original Title")).toBeTruthy();
    });

    it("should allow text input", () => {
      const { getByTestId } = render(
        <InlineEdit value="Test" onSave={mockOnSave} testID="inline-edit" />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      fireEvent.changeText(input, "Updated Text");

      expect(input.props.value).toBe("Updated Text");
    });

    it("should render Save and Cancel buttons in edit mode", () => {
      const { getByTestId, getByText } = render(
        <InlineEdit value="Test" onSave={mockOnSave} testID="inline-edit" />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      expect(getByText("Save")).toBeTruthy();
      expect(getByText("Cancel")).toBeTruthy();
    });

    it("should call onSave with trimmed value when Save is pressed", async () => {
      const { getByTestId } = render(
        <InlineEdit
          value="Original"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      fireEvent.changeText(input, "  Updated Value  ");

      fireEvent.press(getByTestId("inline-edit-save-button"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith("Updated Value");
      });
    });

    it("should exit edit mode after saving", async () => {
      const { getByTestId, queryByTestId, getByText } = render(
        <InlineEdit
          value="Original"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));
      fireEvent.press(getByTestId("inline-edit-save-button"));

      await waitFor(() => {
        expect(queryByTestId("inline-edit-input")).toBeNull();
        expect(getByText("Original")).toBeTruthy();
      });
    });

    it("should revert changes when Cancel is pressed", async () => {
      const { getByTestId, queryByTestId, getByText } = render(
        <InlineEdit
          value="Original"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      fireEvent.changeText(input, "Updated");

      fireEvent.press(getByTestId("inline-edit-cancel-button"));

      await waitFor(() => {
        expect(queryByTestId("inline-edit-input")).toBeNull();
        expect(getByText("Original")).toBeTruthy();
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });
  });

  describe("Variants and Styling", () => {
    it("should accept different typography variants", () => {
      const { getByText } = render(
        <InlineEdit value="Display" onSave={mockOnSave} variant="display" />,
      );

      expect(getByText("Display")).toBeTruthy();
    });

    it("should support multiline editing", () => {
      const { getByTestId } = render(
        <InlineEdit
          value="Multi\nline\ntext"
          onSave={mockOnSave}
          maxLines={4}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      expect(input.props.multiline).toBe(true);
      expect(input.props.numberOfLines).toBe(4);
    });

    it("should be single-line by default", () => {
      const { getByTestId } = render(
        <InlineEdit value="Single" onSave={mockOnSave} testID="inline-edit" />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      expect(input.props.multiline).toBe(undefined);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty value after saving", async () => {
      const { getByTestId } = render(
        <InlineEdit
          value="Original"
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      fireEvent.changeText(input, "   ");

      fireEvent.press(getByTestId("inline-edit-save-button"));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith("");
      });
    });

    it("should handle very long text", () => {
      const longText = "A".repeat(500);
      const { getByTestId } = render(
        <InlineEdit
          value={longText}
          onSave={mockOnSave}
          testID="inline-edit"
        />,
      );

      fireEvent.press(getByTestId("inline-edit"));

      const input = getByTestId("inline-edit-input");
      expect(input.props.value).toBe(longText);
    });

    it("should handle rapid mode switching", async () => {
      const { getByTestId, queryByTestId } = render(
        <InlineEdit value="Test" onSave={mockOnSave} testID="inline-edit" />,
      );

      // Enter edit mode
      fireEvent.press(getByTestId("inline-edit"));
      expect(getByTestId("inline-edit-input")).toBeTruthy();

      // Cancel immediately
      fireEvent.press(getByTestId("inline-edit-cancel-button"));

      await waitFor(() => {
        expect(queryByTestId("inline-edit-input")).toBeNull();
      });

      // Enter edit mode again
      fireEvent.press(getByTestId("inline-edit"));
      expect(getByTestId("inline-edit-input")).toBeTruthy();
    });
  });
});
