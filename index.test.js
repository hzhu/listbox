import React from "react";
import { render, prettyDOM, fireEvent, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { Listbox, Option } from "./index";

afterEach(cleanup);

test("should render <Listbox> that has the first <Option> selected", () => {
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

  fireEvent.keyDown(node, eventProperties);
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

test("should select the second option", () => {
  const CARROT = "Carrot";
  const fruits = ["Apple", "Bananna", CARROT];
  const { getByLabelText, getByText, getByTestId, container } = render(
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

  fireEvent.keyDown(node, eventProperties);
  fireEvent.keyDown(node, eventProperties);
  fireEvent.keyDown(node, eventProperties);

  expect(node).toHaveAttribute("aria-activedescendant", "listbox-option-2");
  expect(getByText(CARROT)).toHaveAttribute("aria-selected", "true");
});
