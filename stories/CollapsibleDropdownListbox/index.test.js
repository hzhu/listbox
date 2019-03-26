import React from "react";
import {
  render,
  prettyDOM,
  fireEvent,
  cleanup,
  wait
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
