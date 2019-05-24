import React, { useState } from "react";
import {
  wait,
  render,
  cleanup,
  fireEvent,
  prettyDOM
} from "react-testing-library";
import "jest-dom/extend-expect";
import { Listbox, Option, OptionsList } from "./index";
import { KEY_CODE, ID_PREFIX } from "../constants.js";

afterEach(cleanup);

beforeAll(() => {
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = () => {};
  }
});

test("render listbox with the first option selected (snapshot)", () => {
  // Given
  const titleId = "lb-title";
  const { getByRole } = render(
    <div>
      <span id={titleId}>Delicious Fruits</span>
      <Listbox aria-labelledby={titleId}>
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

test("renders the listbox when user adds native elements as children of listbox (snapshot)", () => {
  const { container } = render(
    <Listbox aria-labelledby="lb-title" focused>
      <h1>Fruits</h1> {/* This element is removed from the tree */}
      <OptionsList>
        <Option>Apple</Option>
        <Option>Bananna</Option>
        <Option>Carrot</Option>
      </OptionsList>
    </Listbox>
  );
  expect(container).toMatchSnapshot();
});

test("renders listbox with a label", () => {
  const titleId = "lb-title";
  const { getByRole } = render(
    <div>
      <span id={titleId}>Delicious Fruits</span>
      <Listbox aria-labelledby={titleId}>
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
    `${ID_PREFIX}0-0`
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
    `${ID_PREFIX}0-${activeIdx}`
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
    `${ID_PREFIX}0-${activeIdx}`
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
    `${ID_PREFIX}0-${activeIdx}`
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
    activeId: `${ID_PREFIX}0-${SELECTED_IDX}`,
    activeIndex: SELECTED_IDX,
    textContent: CALIFORNIUM
  });
});

test("should expose the index and id of the option when user mouseEnters the option", () => {
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
  const CALIFORNIUM_IDX = transuraniumElements.indexOf(CALIFORNIUM);
  const onMouseEnter = jest.fn();
  const { getByText } = render(
    <Listbox activeIndex={-1} highlight>
      <OptionsList>
        {transuraniumElements.map(element => (
          <Option onMouseEnter={onMouseEnter} key={element}>
            {element}
          </Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const californiumOption = getByText(CALIFORNIUM);

  // When
  fireEvent.mouseEnter(californiumOption);

  // Then
  expect(onMouseEnter).toBeCalledTimes(1);
  expect(onMouseEnter).toHaveBeenLastCalledWith(
    transuraniumElements.indexOf(CALIFORNIUM),
    `${ID_PREFIX}0-${CALIFORNIUM_IDX}`
  );
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
    `${ID_PREFIX}0-0`
  );

  // When
  fireEvent.keyDown(listboxNode, eventProperties);

  // TODO: assert that updateValue was called with activeItem, activeOptionId, textContent.
  // And then
  expect(updateValue).toBeCalledTimes(1);

  // And when
  fireEvent.click(getByText(APPLE));

  // And then
  expect(updateValue).toBeCalledTimes(2);
});

test("able to navigate a grid based listbox with keyboard navigation", () => {
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
    `${ID_PREFIX}0-0`
  );

  // When
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

  // Then
  expect(listboxNode).toHaveAttribute(
    "aria-activedescendant",
    `${ID_PREFIX}1-2`
  );
  expect(updateValue).toBeCalledTimes(3);
  expect(updateValue).toHaveBeenLastCalledWith({
    activeId: `${ID_PREFIX}1-2`,
    activeIndex: 5,
    textContent: "Six"
  });
});

test("clicking an option should focus and highlight that option", () => {
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
  const listbox = getByRole("listbox");
  const carrotNode = getByText(CARROT);
  expect(listbox).not.toHaveAttribute("aria-activedescendant");
  expect(carrotNode).not.toHaveAttribute("aria-selected", "true");

  // When
  const idx = fruits.indexOf(CARROT);
  fireEvent.click(carrotNode);

  // Then
  expect(listbox).toHaveAttribute(
    "aria-activedescendant",
    `${ID_PREFIX}0-${idx}`
  );
  expect(carrotNode).toHaveAttribute("aria-selected", "true");
});

test("highlights the option on mouse enter when listbox is provided the highlight prop", () => {
  // Given
  const BANANNA = "Bananna";
  const fruits = ["Apple", "Bananna", "Carrot"];
  const activeStyle = "background: rgb(189, 228, 255);";
  const { getByText } = render(
    <Listbox highlight>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const OPTION_TO_HIGHLIGHT = getByText(BANANNA);
  fruits.forEach(fruit => {
    expect(getByText(fruit)).not.toHaveStyle(activeStyle);
  });

  // When
  fireEvent.mouseEnter(OPTION_TO_HIGHLIGHT);

  // Then
  fruits.forEach(fruit => {
    const node = getByText(fruit);
    if (fruit === BANANNA) {
      expect(node).toHaveStyle(activeStyle);
    } else {
      expect(node).not.toHaveStyle(activeStyle);
    }
  });
});

test("calls the onMouseEnter event for an option with activeIndex & activeId", () => {
  // Given
  const BANANNA = "Bananna";
  const fruits = ["Apple", "Bananna", "Carrot"];
  const onMouseEnter = jest.fn();
  const { getByText } = render(
    <Listbox>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit} onMouseEnter={onMouseEnter}>
            {fruit}
          </Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const BANANNA_ELEMENT = getByText(BANANNA);

  // When
  fireEvent.mouseEnter(BANANNA_ELEMENT);

  // Then
  expect(onMouseEnter).toBeCalledTimes(1);
  expect(onMouseEnter).toHaveBeenLastCalledWith(
    fruits.indexOf(BANANNA),
    `${ID_PREFIX}0-${fruits.indexOf(BANANNA)}`
  );
});

test("highlights the correct option for a controlled listbox", () => {
  // Given
  const ACTIVE_STYLE = "background: rgb(189, 228, 255);";
  const APPLE = "Apple";
  const BANANNA = "Bananna";
  const CARROT = "Carrot";
  const fruits = [APPLE, BANANNA, CARROT];
  const { getByText } = render(
    <Listbox activeIndex={0} highlightIndex={2}>
      <OptionsList>
        {fruits.map(fruit => (
          <Option key={fruit}>{fruit}</Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const appleNode = getByText(APPLE);
  const banannaNode = getByText(BANANNA);
  const carrotNode = getByText(CARROT);

  // THEN
  expect(appleNode).toHaveAttribute("style", ACTIVE_STYLE);
  expect(banannaNode).not.toHaveAttribute("style");
  expect(carrotNode).toHaveAttribute("style", ACTIVE_STYLE);
});

test("selects the correct option when a user keys down on an controlled listbox component", () => {
  // Given
  const CARROT = "Carrot";
  const fruits = ["Apple", "Bananna", CARROT];
  const carrotIdx = fruits.indexOf(CARROT);
  const Comp = () => {
    const [activeIndex, setActiveIndex] = useState();
    const [activeId, setActiveId] = useState();
    const selectCarrot = () => {
      setActiveId(`${ID_PREFIX}0-${carrotIdx}`);
      setActiveIndex(carrotIdx);
    };
    return (
      <>
        <button onClick={selectCarrot}>Select Carrot</button>
        <Listbox activeIndex={activeIndex} activeId={activeId}>
          <OptionsList>
            {fruits.map(fruit => (
              <Option key={fruit}>{fruit}</Option>
            ))}
          </OptionsList>
        </Listbox>
      </>
    );
  };
  const { getByText, getByRole } = render(<Comp />);
  const button = getByText("Select Carrot");
  const listbox = getByRole("listbox");
  const carrotNode = getByText(CARROT);
  expect(listbox).not.toHaveAttribute("aria-activedescendant");
  expect(carrotNode).not.toHaveAttribute("aria-selected");

  // When
  fireEvent.click(button);

  // Then
  expect(listbox).toHaveAttribute(
    "aria-activedescendant",
    `${ID_PREFIX}0-${carrotIdx}`
  );
  expect(carrotNode).toHaveAttribute("aria-selected");
});

test("calls onAriaSelect for a controlled listbox component when aria focus changes", () => {
  const CARROT = "Carrot";
  const fruits = ["Apple", "Bananna", CARROT];
  const carrotIdx = fruits.indexOf(CARROT);
  const onAriaSelect = jest.fn();
  const Comp = () => {
    const [activeIndex, setActiveIndex] = useState();
    const selectCarrot = () => setActiveIndex(carrotIdx);
    return (
      <>
        <button onClick={selectCarrot}>Select Carrot</button>
        <Listbox activeIndex={activeIndex} onAriaSelect={onAriaSelect}>
          <OptionsList>
            {fruits.map(fruit => (
              <Option key={fruit}>{fruit}</Option>
            ))}
          </OptionsList>
        </Listbox>
      </>
    );
  };
  const { getByText, getByRole } = render(<Comp />);
  const button = getByText("Select Carrot");
  const listbox = getByRole("listbox");
  const carrotNode = getByText(CARROT);
  expect(listbox).not.toHaveAttribute("aria-activedescendant");
  expect(carrotNode).not.toHaveAttribute("aria-selected");

  // When
  fireEvent.click(button);

  // Then
  expect(onAriaSelect).toBeCalledTimes(1);
  expect(onAriaSelect).toHaveBeenLastCalledWith(`${ID_PREFIX}0-${carrotIdx}`);
});

test("should select the value prop for Option if it contains a complex markup", () => {
  // Given
  const CARROT = "Carrot";
  const fruits = ["Apple", "Bananna", CARROT];
  const CARROT_IDX = fruits.indexOf(CARROT);
  const updateValue = jest.fn();
  const { getByText } = render(
    <Listbox updateValue={updateValue}>
      <OptionsList>
        {fruits.map(fruit => (
          // When a user selects an option, Listbox should expose the fruit value
          // "Carrot" as the value being selected and not include other text values,
          // for example "|" and "On Sale!"
          <Option key={fruit} value={fruit}>
            <div>{fruit}</div>
            <span>|</span>
            <div>On Sale!</div>
          </Option>
        ))}
      </OptionsList>
    </Listbox>
  );
  const carrotNode = getByText(CARROT);

  // When
  fireEvent.click(carrotNode);

  // Then
  expect(updateValue).toBeCalledTimes(1);
  expect(updateValue).toHaveBeenLastCalledWith({
    activeId: `${ID_PREFIX}0-${CARROT_IDX}`,
    activeIndex: CARROT_IDX,
    textContent: CARROT
  });
});
