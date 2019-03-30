import React from "react";
import {
  wait,
  render,
  cleanup,
  fireEvent,
  prettyDOM
} from "react-testing-library";
import "jest-dom/extend-expect";
import CollapsibleDropdown from "./index";

afterEach(cleanup);

test("closing the collapsible dropdown returns focus to the button", async () => {
  // Given
  const { getByLabelText, getByText, getByRole } = render(
    <CollapsibleDropdown />
  );
  const dropdownButton = getByLabelText("Choose an element");
  expect(dropdownButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(getByText("Neptunium"));
  expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
  const listboxNode = getByRole("listbox");
  fireEvent.keyDown(listboxNode, {
    key: "ArrowDown",
    keyCode: 40,
    which: 40
  });
  expect(listboxNode).toHaveFocus();
  expect(dropdownButton.textContent).toBe("Plutonium");
  expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
  expect(dropdownButton).not.toHaveFocus();

  // When
  fireEvent.keyDown(listboxNode, {
    key: "Enter",
    keyCode: 13,
    which: 13
  });

  // Then
  expect(dropdownButton).toHaveAttribute("aria-expanded", "false");
  await wait(() => {
    expect(dropdownButton).toHaveFocus();
  });
});

test("pressing letter selects corresponding option and sets the button's text accordingly", () => {
  // Given
  const { getByLabelText, getByRole } = render(<CollapsibleDropdown />);
  const dropdownButton = getByLabelText("Choose an element");
  expect(dropdownButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(dropdownButton);
  expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
  const listboxNode = getByRole("listbox");
  expect(dropdownButton.textContent).toBe("Neptunium");

  // When
  fireEvent.keyDown(listboxNode, { key: "c", which: 67, keyCode: 67 });
  fireEvent.keyDown(listboxNode, { key: "a", which: 65, keyCode: 65 });

  // Then
  expect(dropdownButton.textContent).toBe("Californium");
});

test("tabbing out of the collapsible dropdown (open state) puts the focus on the next focusable element", () => {
  // Given
  const { getByLabelText, getByRole, getByText } = render(
    <div>
      <CollapsibleDropdown />
      <button>Submit</button>
    </div>
  );
  const dropdownButton = getByLabelText("Choose an element");
  expect(dropdownButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(dropdownButton);
  expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
  expect(dropdownButton.textContent).toBe("Neptunium");
  const listboxNode = getByRole("listbox");
  const submitButton = getByText("Submit");

  // When
  fireEvent.keyDown(listboxNode, { key: "c", which: 67, keyCode: 67 });
  expect(listboxNode).toHaveFocus();
  fireEvent.keyDown(listboxNode, { key: "Tab", which: 9, keyCode: 9 });

  // Then
  expect(submitButton).toHaveFocus();
});

test("tabbing out of the collapsible dropdown (open state) puts the focus on the body element", () => {
  // Given
  const { getByLabelText, getByRole } = render(<CollapsibleDropdown />);
  const dropdownButton = getByLabelText("Choose an element");
  expect(dropdownButton).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(dropdownButton);
  expect(dropdownButton).toHaveAttribute("aria-expanded", "true");
  expect(dropdownButton.textContent).toBe("Neptunium");
  const listboxNode = getByRole("listbox");

  // When
  fireEvent.keyDown(listboxNode, { key: "c", which: 67, keyCode: 67 });
  expect(listboxNode).toHaveFocus();
  fireEvent.keyDown(listboxNode, { key: "Tab", which: 9, keyCode: 9 });

  // Then
  expect(document.body).toHaveFocus();
});
