import React, { useState } from "react";
import { KEY_CODE } from "../../src/constants";
import { FRUITS_AND_VEGGIES } from "../constants";
import { Listbox, Option, OptionsList } from "../../src";

const COMBO_INPUT_KEYS = [
  KEY_CODE.up,
  KEY_CODE.down,
  KEY_CODE.left,
  KEY_CODE.right,
  KEY_CODE.return,
  KEY_CODE.esc,
  KEY_CODE.tab
];

export default () => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const suggestions = FRUITS_AND_VEGGIES.filter(
    fruit => fruit.toLowerCase().indexOf(searchQuery.toLowerCase()) === 0
  );
  const collapse = () => {
    setExpanded(false);
    setActiveId(undefined);
    setActiveIndex(-1);
  };
  const onKeyDown = e => {
    if (!COMBO_INPUT_KEYS.includes(e.keyCode)) return;
    if (!expanded) return;
    const isFirstIndex = activeIndex === 0;
    const noActiveIndex = activeIndex === undefined;
    const isLastActiveIndex = activeIndex === suggestions.length - 1;
    switch (e.keyCode) {
      case KEY_CODE.up:
        e.preventDefault();
        if (noActiveIndex || isFirstIndex) {
          setActiveIndex(suggestions.length - 1);
        } else {
          setActiveIndex(activeIndex - 1);
        }
        break;
      case KEY_CODE.down:
        e.preventDefault();
        if (noActiveIndex || isLastActiveIndex) {
          setActiveIndex(0);
        } else {
          setActiveIndex(activeIndex + 1);
        }
        break;
      case KEY_CODE.left:
      case KEY_CODE.right:
        setActiveIndex(-1);
        break;
      case KEY_CODE.esc:
        setSearchQuery("");
        collapse();
        break;
      case KEY_CODE.tab:
        collapse();
        break;
      case KEY_CODE.return:
        if (activeIndex >= 0) {
          setSearchQuery(suggestions[activeIndex]);
          collapse();
        }
        break;
      default:
        console.log("default");
    }
  };
  return (
    <>
      <label htmlFor="ex1-input" id="ex1-label">
        Choice 1 Fruit or Vegetable
      </label>
      <div
        role="combobox"
        id="ex1-combobox"
        aria-owns="ex1-listbox"
        aria-haspopup="listbox"
        aria-expanded={expanded}
      >
        <input
          type="text"
          id="ex1-input"
          autoComplete="off"
          value={searchQuery}
          aria-autocomplete="list"
          aria-controls="ex1-listbox"
          aria-activedescendant={activeId}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (activeIndex >= 0) {
              setSearchQuery(suggestions[activeIndex]);
            }
            setExpanded(false);
          }}
          onChange={e => {
            const { value } = e.target;
            setSearchQuery(value);
            if (value.length === 0) collapse();
            if (value) setExpanded(true);
          }}
        />
      </div>
      {expanded && suggestions.length && searchQuery.length ? (
        <Listbox
          highlight
          id="ex1-listbox"
          ariaLabelledBy="ex1-label"
          activeIndex={activeIndex}
          onHighlight={index => setActiveIndex(index)}
          onAriaSelect={activeId => setActiveId(activeId)}
          updateValue={({ activeIndex, selectedItem }) => {
            setExpanded(false);
            setActiveIndex(activeIndex);
            setSearchQuery(selectedItem);
          }}
          style={{
            width: "200px",
            border: "1px solid #CCC"
          }}
        >
          <OptionsList>
            {suggestions.map(fruit => (
              <Option key={fruit}>{fruit}</Option>
            ))}
          </OptionsList>
        </Listbox>
      ) : null}
      <button
        disabled={searchQuery.length === 0}
        onClick={() => alert(searchQuery)}
      >
        Submit
      </button>
    </>
  );
};
