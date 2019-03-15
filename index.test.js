import React from "react";
import {
  render,
  prettyDOM,
  fireEvent,
  cleanup,
  wait
} from "react-testing-library";
import "jest-dom/extend-expect";
import { Listbox, Option } from "./index";

afterEach(cleanup);

test("should render <Listbox> that has the first <Option> selected", () => {
  // Given
  const { getByLabelText, getByText, getByTestId, container } = render(
    <Listbox>
      {["Apple", "Bananna", "Carrot"].map(element => (
        <Option key={element}>
          <div
            style={{
              color: "black",
              padding: "0 1em"
            }}
          >
            {element}
          </div>
        </Option>
      ))}
    </Listbox>
  );
  const node = getByTestId("Listbox-ul");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: 40,
    which: 40
  };

  // When
  fireEvent.keyDown(node, eventProperties);

  // Then
  expect(node).toMatchSnapshot();
});

test("is focused and selects first <Option> on mount when passed the focus prop", () => {
  const { getByTestId } = render(
    <Listbox focused>
      {["Apple", "Bananna", "Carrot"].map(element => (
        <Option key={element}>{element}</Option>
      ))}
    </Listbox>
  );
  const testId = "Listbox-ul";
  const node = getByTestId(testId);
  expect(node).toHaveAttribute("aria-activedescendant", "listbox-option-0");
  expect(document.activeElement.dataset.testid).toBe(testId);
});

test("should select the second option using arrow key navigation", () => {
  // Given
  const CARROT = "Carrot";
  const fruits = ["Apple", "Bananna", CARROT];
  const { getByText, getByTestId } = render(
    <Listbox>
      {fruits.map(element => (
        <Option key={element}>{element}</Option>
      ))}
    </Listbox>
  );
  const node = getByTestId("Listbox-ul");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: 40,
    which: 40
  };

  // When
  fireEvent.keyDown(node, eventProperties);
  fireEvent.keyDown(node, eventProperties);
  fireEvent.keyDown(node, eventProperties);

  // Then
  expect(node).toHaveAttribute("aria-activedescendant", "listbox-option-2");
  expect(getByText(CARROT)).toHaveAttribute("aria-selected", "true");
});

test("Type a character: selects and focuses the next option that starts with the typed character", () => {
  // Given
  const BANANNA = "Bananna";
  const fruits = ["Apple", BANANNA, "Carrot"];
  const { getByTestId } = render(
    <Listbox>
      {fruits.map(fruit => (
        <Option key={fruit}>{fruit}</Option>
      ))}
    </Listbox>
  );
  const node = getByTestId("Listbox-ul");
  const eventProperties = {
    key: "b",
    which: 66,
    keyCode: 66
  };

  // When
  fireEvent.keyDown(node, eventProperties);

  // Then
  const activeIdx = fruits.indexOf(BANANNA);
  expect(getByTestId("Listbox-ul").getAttribute("aria-activedescendant")).toBe(
    `listbox-option-${activeIdx}`
  );
});

test("Type multiple characters in rapid succession: focus moves to next item with a name that starts with the string of characters typed.", () => {
  // Given
  const transuraniumElements = [
    "Plutonium",
    "Americium",
    "Curium",
    "Berkelium",
    "Californium",
    "Moscovium",
    "Tennessine"
  ];
  const { getByTestId } = render(
    <Listbox>
      {transuraniumElements.map(element => (
        <Option key={element}>{element}</Option>
      ))}
    </Listbox>
  );
  const node = getByTestId("Listbox-ul");

  // When
  fireEvent.keyDown(node, { key: "c", which: 67, keyCode: 67 });
  fireEvent.keyDown(node, { key: "a", which: 65, keyCode: 65 });

  // Then
  const activeIdx = transuraniumElements.indexOf("Californium");
  expect(getByTestId("Listbox-ul").getAttribute("aria-activedescendant")).toBe(
    `listbox-option-${activeIdx}`
  );
});
