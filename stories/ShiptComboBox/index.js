import React, { useState, useEffect } from "react";
import { KEY_CODE, COMBO_INPUT_KEYS } from "../../src/constants";
import { Listbox, Option, OptionsList } from "../../src";
import { isDescendantListbox } from "../../src/utils";

const usePartialEmphasis = (query, string) => {
  let emphasized = "";
  let rest = "";
  if (string.toLowerCase().startsWith(query.toLowerCase())) {
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      if (i < query.length) {
        emphasized += char;
      } else {
        rest += char;
      }
    }
  }
  return { emphasized, rest };
};

const PartialEmphasis = ({ query, children }) => {
  const { emphasized, rest } = usePartialEmphasis(query, children);

  return emphasized === "" && rest === "" ? (
    <span>{children}</span>
  ) : (
    <>
      <span style={{ fontWeight: "bold" }}>{emphasized}</span>
      <span>{rest}</span>
    </>
  );
};

const visuallyHiddenCSS = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  width: "1px",
  margin: "-1px",
  padding: 0,
  overflow: "hidden",
  position: "absolute"
};

const fetchSuggestedTerms = async query => {
  const response = await fetch(
    `https://staging-api.shipt.com/autocomplete/v1/suggestions/${query}?store_id=27`
  );
  const data = await response.json();
  return data.suggestions.map(s => s.term);
};

const fetchPopularTerms = () => {
  return fetch(
    `https://staging-api.shipt.com/autocomplete/v1/suggestions?store_id=27`
  );
};

const ShiptComboBox = () => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const onChange = async e => {
    const { value } = e.target;
    setSearchQuery(value);
    const suggestions = await fetchSuggestedTerms(value);
    setSuggestions(suggestions);
    setExpanded(true);
  };
  const collapse = () => {
    setExpanded(false);
    setActiveId(undefined);
    setActiveIndex(-1);
    setHighlightedIndex(-1);
    setSuggestions([]);
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
  useEffect(() => {
    const handleExpanded = e => {
      if (isDescendantListbox(e.target) === false) {
        collapse();
      }
    };
    document.body.addEventListener("click", handleExpanded);
    return () => document.body.removeEventListener("click", handleExpanded);
  }, []);

  const onFocus = async e => {
    if (!suggestions.length && !searchQuery) {
      fetchPopularTerms()
        .then(response => response.json())
        .then(data => data.suggestions)
        .then(suggestions => suggestions.map(s => s.term))
        .then(terms => {
          setSuggestions(terms);
          setExpanded(true);
        })
        .catch(error => console.log(error));
    } else {
      const suggestions = await fetchSuggestedTerms(e.target.value);
      setSuggestions(suggestions);
      setExpanded(true);
    }
  };
  const focused = expanded && suggestions.length;
  const shiptGreen = "#599900";
  const focusedBorder = `1px solid ${shiptGreen}`;
  const focusOutline = focused ? { border: focusedBorder } : {};
  const focusOutlineTop = focused ? { borderTop: focusedBorder } : {};
  return (
    <div
      className={`mw6 ba b--light-silver center black-70 br2`}
      style={focusOutline}
    >
      <label htmlFor="ex1-input" id="ex1-label" style={visuallyHiddenCSS}>
        Search for products at Shipt
      </label>
      <div
        role="combobox"
        id="ex1-combobox"
        aria-owns="ex1-listbox"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        className="flex"
      >
        <input
          placeholder="Search for..."
          type="text"
          id="ex1-input"
          className="pl2 w-100 outline-0 bn br2"
          autoComplete="off"
          value={searchQuery}
          aria-autocomplete="list"
          aria-controls="ex1-listbox"
          aria-activedescendant={activeId}
          onKeyDown={onKeyDown}
          onChange={onChange}
          onFocus={onFocus}
        />
        <button
          aria-label={
            searchQuery
              ? `Search for ${searchQuery}`
              : "Search for products on Shipt"
          }
          className={`bn br--right pointer ${focused ? "br0" : "br1"}`}
          style={{ background: shiptGreen, padding: "5px 5px 2px 8px" }}
          onClick={() => {
            collapse();
            alert(searchQuery);
          }}
        >
          🔍
        </button>
      </div>
      {focused ? (
        <Listbox
          highlight
          id="ex1-listbox"
          aria-labelledby="ex1-label"
          activeIndex={activeIndex}
          activeStyles={{
            background: "rgba(76, 210, 42, 0.25)"
          }}
          style={focusOutlineTop}
          className={`pointer outline-0 bt b--light-silver`}
          highlightedIndex={highlightedIndex}
          onAriaSelect={activeId => setActiveId(activeId)}
          updateValue={({ activeIndex, selectedItem }) => {
            setExpanded(false);
            setActiveIndex(activeIndex);
            setSearchQuery(selectedItem);
            setSuggestions([]);
          }}
        >
          <OptionsList>
            {suggestions.map(term => (
              <Option
                className="ph2 pv1"
                key={term}
                onMouseEnter={index => setHighlightedIndex(index)}
              >
                <PartialEmphasis query={searchQuery}>{term}</PartialEmphasis>
              </Option>
            ))}
          </OptionsList>
        </Listbox>
      ) : null}
    </div>
  );
};

export default () => (
  <div className="sans-serif pa4 f4">
    <ShiptComboBox />
  </div>
);
