import React from "react";
import {
  render,
  prettyDOM,
  fireEvent,
  cleanup,
  wait
} from "react-testing-library";
import "jest-dom/extend-expect";
import { Listbox, Option, OptionsList } from "./index";

afterEach(cleanup);

test("Snapshot: render <Listbox> with first <Option> selected", () => {
  // Given
  const { getByLabelText, getByText, getByTestId, container } = render(
    <Listbox>
      <OptionsList>
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
      </OptionsList>
    </Listbox>
  );
  const node = getByTestId("Listbox");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: 40,
    which: 40
  };

  // When
  node.focus();
  fireEvent.keyDown(node, eventProperties);

  // Then
  expect(node).toMatchSnapshot();
});

test("is focused and selects first <Option> on mount when passed the focus prop", () => {
  const { getByTestId } = render(
    <Listbox focused>
      <OptionsList>
        {["Apple", "Bananna", "Carrot"].map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const testId = "Listbox";
  const node = getByTestId(testId);
  expect(node).toHaveAttribute("aria-activedescendant", "listbox__option__0-0");
  expect(document.activeElement.dataset.testid).toBe(testId);
});

test("should select the second option using arrow key navigation", () => {
  // Given
  const APPLE = "Apple";
  const BANANNA = "Bananna";
  const CARROT = "Carrot";
  const fruits = [APPLE, BANANNA, CARROT];
  const { getByText, getByTestId } = render(
    <Listbox>
      <OptionsList>
        {fruits.map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const node = getByTestId("Listbox");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: 40,
    which: 40
  };

  // When
  node.focus();
  expect(getByText(APPLE)).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(node, eventProperties);
  expect(getByText(APPLE)).not.toHaveAttribute("aria-selected");
  expect(getByText(BANANNA)).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(node, eventProperties);
  expect(getByText(APPLE)).not.toHaveAttribute("aria-selected");
  expect(getByText(BANANNA)).not.toHaveAttribute("aria-selected");
  expect(getByText(CARROT)).toHaveAttribute("aria-selected", "true");

  // // Then
  const activeIdx = fruits.indexOf(CARROT);
  expect(node).toHaveAttribute(
    "aria-activedescendant",
    `listbox__option__0-${activeIdx}`
  );
});

test("Type a character: selects and focuses the next option that starts with the typed character", () => {
  // Given
  const BANANNA = "Bananna";
  const fruits = ["Apple", BANANNA, "Carrot"];
  const { getByTestId } = render(
    <Listbox>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const node = getByTestId("Listbox");
  const eventProperties = {
    key: "b",
    which: 66,
    keyCode: 66
  };

  // When
  fireEvent.keyDown(node, eventProperties);

  // Then
  const activeIdx = fruits.indexOf(BANANNA);
  expect(getByTestId("Listbox").getAttribute("aria-activedescendant")).toBe(
    `listbox__option__0-${activeIdx}`
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
      <OptionsList>
        {transuraniumElements.map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const node = getByTestId("Listbox");

  // When
  fireEvent.keyDown(node, { key: "c", which: 67, keyCode: 67 });
  fireEvent.keyDown(node, { key: "a", which: 65, keyCode: 65 });

  // Then
  const activeIdx = transuraniumElements.indexOf("Californium");
  expect(getByTestId("Listbox").getAttribute("aria-activedescendant")).toBe(
    `listbox__option__0-${activeIdx}`
  );
});
