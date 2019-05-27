import React, { useRef, useState, useEffect } from "react";
import { KEY_CODE, COMBO_INPUT_KEYS } from "../../src/constants";
import { FRUITS_AND_VEGGIES } from "../constants";
import { Listbox, Option, OptionsList } from "../../src";
import { TextEmphasis } from "../utils";

const listboxStyles = {
  width: "200px",
  background: "#FFF",
  position: "absolute",
  border: "1px solid #CCC"
};

export default () => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState();
  const suggestions = FRUITS_AND_VEGGIES.filter(
    fruit => fruit.toLowerCase().indexOf(searchQuery.toLowerCase()) === 0
  );
  const collapse = () => {
    setExpanded(false);
    setActiveId(undefined);
    setActiveIndex(undefined);
    setHighlightIndex(undefined);
  };
  const onKeyDown = e => {
    if (!COMBO_INPUT_KEYS.includes(e.keyCode)) return;
    if (!expanded) return;
    const isFirstIndex = activeIndex === 0;
    const noActiveIndex = activeIndex === undefined;
    const isLastActiveIndex = activeIndex >= suggestions.length - 1;
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
        setActiveId(undefined);
        setActiveIndex(undefined);
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
  const inputRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    const handleExpanded = e => {
      const targetIsNotInput = inputRef.current !== e.target;
      const targetNotInContainer = !containerRef.current.contains(e.target);
      if (targetNotInContainer && targetIsNotInput) {
        setExpanded(false);
      }
    };
    document.body.addEventListener("click", handleExpanded);
    return () => document.body.removeEventListener("click", handleExpanded);
  }, []);
  return (
    <>
      <label htmlFor="ex1-input" id="ex1-label">
        Choice 1 Fruit or Vegetable
      </label>
      <div ref={containerRef}>
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
            ref={inputRef}
            autoComplete="off"
            value={searchQuery}
            aria-autocomplete="list"
            aria-controls="ex1-listbox"
            aria-activedescendant={activeId}
            onKeyDown={onKeyDown}
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
            style={listboxStyles}
            aria-labelledby="ex1-label"
            activeIndex={activeIndex}
            highlightIndex={highlightIndex}
            onAriaSelect={activeId => setActiveId(activeId)}
            updateValue={({ activeIndex, textContent }) => {
              setExpanded(false);
              setActiveIndex(activeIndex);
              setSearchQuery(textContent);
            }}
          >
            <OptionsList>
              {suggestions.map(fruit => (
                <Option
                  key={fruit}
                  onMouseEnter={index => setHighlightIndex(index)}
                >
                  <TextEmphasis
                    query={searchQuery}
                    style={{ fontWeight: "bold" }}
                  >
                    {fruit}
                  </TextEmphasis>
                </Option>
              ))}
            </OptionsList>
          </Listbox>
        ) : null}
      </div>
      <button
        disabled={searchQuery.length === 0}
        onClick={() => alert(searchQuery)}
      >
        Submit
      </button>
    </>
  );
};
