import React from "react";
import {
  wait,
  render,
  cleanup,
  fireEvent,
  prettyDOM
} from "react-testing-library";
import "jest-dom/extend-expect";
import { Listbox, Option, OptionsList } from "./index";
import { KEY_CODE } from "../constants.js";

afterEach(cleanup);

test("render listbox with the first option selected (snapshot)", () => {
  // Given
  const titleId = "lb-title";
  const { getByRole } = render(
    <div>
      <span id={titleId}>Delicious Fruits</span>
      <Listbox ariaLabelledBy={titleId}>
        <OptionsList>
          {["Apple", "Bananna", "Carrot"].map(fruit => (
            <Option key={fruit}>
              <div style={{ color: "black" }}>{fruit}</div>
            </Option>
          ))}
        </OptionsList>
      </Listbox>
    </div>
  );
  const listboxNode = getByRole("listbox");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: KEY_CODE.down,
    which: KEY_CODE.down
  };

  // When
  listboxNode.focus();
  fireEvent.keyDown(listboxNode, eventProperties);

  // Then
  expect(listboxNode).toMatchSnapshot();
});

test("renders listbox with a label", () => {
  const titleId = "lb-title";
  const { getByRole } = render(
    <div>
      <span id={titleId}>Delicious Fruits</span>
      <Listbox ariaLabelledBy={titleId}>
        <OptionsList>
          {["Apple", "Bananna", "Carrot"].map(fruit => (
            <Option key={fruit}>{fruit}</Option>
          ))}
        </OptionsList>
      </Listbox>
    </div>
  );
  const listboxNode = getByRole("listbox");
  expect(listboxNode).toHaveAttribute("aria-labelledby", titleId);
});

test("listbox is focused and selects first option on mount when passed the focus prop", () => {
  const { getByRole } = render(
    <Listbox focused>
      <OptionsList>
        {["Apple", "Bananna", "Carrot"].map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");
  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    "listbox__option__0-0"
  );
  expect(listboxNode).toHaveFocus();
});

test("should select the second option using arrow key navigation", () => {
  // Given
  const APPLE = "Apple";
  const BANANNA = "Bananna";
  const CARROT = "Carrot";
  const fruits = [APPLE, BANANNA, CARROT];
  const { getByText, getByRole } = render(
    <Listbox>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: KEY_CODE.down,
    which: KEY_CODE.down
  };

  // When
  listboxNode.focus();
  expect(getByText(APPLE)).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(listboxNode, eventProperties);
  expect(getByText(APPLE)).not.toHaveAttribute("aria-selected");
  expect(getByText(BANANNA)).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(listboxNode, eventProperties);
  expect(getByText(APPLE)).not.toHaveAttribute("aria-selected");
  expect(getByText(BANANNA)).not.toHaveAttribute("aria-selected");
  expect(getByText(CARROT)).toHaveAttribute("aria-selected", "true");

  // Then
  const activeIdx = fruits.indexOf(CARROT);
  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    `listbox__option__0-${activeIdx}`
  );
});

test("type a character: selects and focuses the next option that starts with the typed character", () => {
  // Given
  const BANANNA = "Bananna";
  const fruits = ["Apple", BANANNA, "Carrot"];
  const { getByRole } = render(
    <Listbox>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");
  const eventProperties = {
    key: "b",
    which: 66,
    keyCode: 66
  };

  // When
  fireEvent.keyDown(listboxNode, eventProperties);

  // Then
  const activeIdx = fruits.indexOf(BANANNA);
  expect(getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
    `listbox__option__0-${activeIdx}`
  );
});

test("type multiple characters in rapid succession: focus moves to next item with a name that starts with the string of characters typed.", () => {
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
  const { getByRole } = render(
    <Listbox>
      <OptionsList>
        {transuraniumElements.map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");

  // When
  fireEvent.keyDown(listboxNode, { key: "c", which: 67, keyCode: 67 });
  fireEvent.keyDown(listboxNode, { key: "a", which: 65, keyCode: 65 });

  // Then
  const activeIdx = transuraniumElements.indexOf("Californium");
  expect(listboxNode.getAttribute("aria-activedescendant")).toBe(
    `listbox__option__0-${activeIdx}`
  );
});

test("calls updateValue prop with the new listbox state when user types multiple characters in rapid succession", () => {
  // Given
  const CALIFORNIUM = "Californium";
  const transuraniumElements = [
    "Plutonium",
    "Americium",
    "Curium",
    "Berkelium",
    CALIFORNIUM,
    "Moscovium",
    "Tennessine"
  ];
  const SELECTED_IDX = transuraniumElements.indexOf(CALIFORNIUM);
  const updateValue = jest.fn();
  const { getByRole } = render(
    <Listbox updateValue={updateValue}>
      <OptionsList>
        {transuraniumElements.map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");

  // When
  const keyEvents = [
    { key: "c", which: 67, keyCode: 67 },
    { key: "a", which: 65, keyCode: 65 }
  ];
  keyEvents.forEach(event => fireEvent.keyDown(listboxNode, event));

  // Then
  expect(updateValue).toBeCalledTimes(keyEvents.length);
  expect(updateValue).toHaveBeenLastCalledWith({
    activeId: `listbox__option__0-${SELECTED_IDX}`,
    activeIndex: SELECTED_IDX,
    selectedItem: CALIFORNIUM
  });
});

test("should expose a highlighted index when user 'enters' an option for controlled listbox component", () => {
  // Given
  const CALIFORNIUM = "Californium";
  const transuraniumElements = [
    "Americium",
    "Curium",
    "Berkelium",
    CALIFORNIUM,
    "Moscovium",
    "Tennessine"
  ];
  const { getByText } = render(
    <Listbox activeIndex={-1} onMouseEnter={onMouseEnter}>
      <OptionsList>
        {transuraniumElements.map(element => (
          <Option key={element}>{element}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const californiumOption = getByText(CALIFORNIUM);

  // When
  fireEvent.mouseEnter(californiumOption);

  // Then (async)
  function onMouseEnter(event, index) {
    expect(event.type).toBe("mouseenter");
    expect(index).toBe(transuraniumElements.indexOf(CALIFORNIUM));
  }
});

test("calls updateValue prop when listbox option selection changes", () => {
  // Given
  const APPLE = "Apple";
  const BANANNA = "Bananna";
  const CARROT = "Carrot";
  const fruits = [APPLE, BANANNA, CARROT];
  const updateValue = jest.fn();
  const { getByText, getByRole } = render(
    <Listbox updateValue={updateValue}>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");
  const eventProperties = {
    key: "ArrowDown",
    keyCode: KEY_CODE.down,
    which: KEY_CODE.down
  };
  listboxNode.focus();
  expect(getByText(APPLE)).toHaveAttribute("aria-selected", "true");
  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    `listbox__option__0-0`
  );

  // When
  fireEvent.keyDown(listboxNode, eventProperties);

  // TODO: assert that updateValue was called with activeItem, activeOptionId, selectedItem.
  // And then
  expect(updateValue).toBeCalledTimes(1);

  // And when
  fireEvent.click(getByText(APPLE));

  // And then
  expect(updateValue).toBeCalledTimes(2);
});

test("should be able to navigate a grid based listbox", () => {
  // Given
  const updateValue = jest.fn();
  const { getByRole } = render(
    <Listbox grid updateValue={updateValue}>
      <OptionsList>
        <Option>One</Option>
        <Option>Two</Option>
        <Option>Three</Option>
      </OptionsList>
      <OptionsList>
        <Option>Four</Option>
        <Option>Five</Option>
        <Option>Six</Option>
      </OptionsList>
    </Listbox>
  );
  const listboxNode = getByRole("listbox");

  listboxNode.focus();

  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    "listbox__option__0-0"
  );

  // Navigate down one row
  fireEvent.keyDown(listboxNode, {
    keyCode: KEY_CODE.down
  });

  // Navigate right one column
  fireEvent.keyDown(listboxNode, {
    keyCode: KEY_CODE.right
  });

  // Navigate right another column
  fireEvent.keyDown(listboxNode, {
    keyCode: KEY_CODE.right
  });

  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    "listbox__option__1-2"
  );
  expect(updateValue).toBeCalledTimes(3);
  expect(updateValue).toHaveBeenLastCalledWith({
    activeId: "listbox__option__1-2",
    activeIndex: 5,
    selectedItem: "Six"
  });
});
