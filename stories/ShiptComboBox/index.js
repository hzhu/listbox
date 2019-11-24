import React, { useReducer, useEffect } from "react";
import { KEY_CODE, COMBO_INPUT_KEYS } from "../../src/constants";
import { Listbox, Option, OptionsList } from "../../src";
import { isDescendantListbox } from "../../src/utils";
import { TextEmphasis, VisuallyHidden } from "../utils";
import { fetchSuggestedTerms } from "./api";
import comboBoxReducer, { initialState } from "./reducer";
import * as types from "./actionTypes";

const ShiptComboBox = () => {
  const [state, dispatch] = useReducer(comboBoxReducer, initialState);
  const {
    query,
    activeId,
    expanded,
    suggestions,
    activeIndex,
    highlightIndex
  } = state;

  const onChange = async e => {
    const { value: query } = e.target;
    dispatch({ type: types.UPDATE_QUERY, query });
    const suggestions = await fetchSuggestedTerms(query);
    dispatch({ type: types.UPDATE_SUGGESTIONS, suggestions });
  };

  const onKeyDown = e => {
    const key = e.keyCode || e.which;
    if (!COMBO_INPUT_KEYS.includes(key)) return;
    if (!expanded) return;
    e.preventDefault();
    switch (key) {
      case KEY_CODE.up:
        dispatch({ type: types.FOCUS_PREVIOUS_OPTION });
        break;
      case KEY_CODE.down:
        dispatch({ type: types.FOCUS_NEXT_OPTION });
        break;
      case KEY_CODE.left:
      case KEY_CODE.right:
        dispatch({ type: types.CLEAR_OPTION });
        break;
      case KEY_CODE.esc:
      case KEY_CODE.tab:
        dispatch({ type: types.COLLAPSE_LIST });
        break;
      case KEY_CODE.return:
        dispatch({ type: types.SELECT_LIST_ITEM });
        break;
      default:
        throw new Error("unsupported combobox key");
    }
  };

  useEffect(() => {
    const handleExpanded = e => {
      if (isDescendantListbox(e.target) === false) {
        dispatch({ type: types.COLLAPSE_LIST });
      }
    };
    document.body.addEventListener("click", handleExpanded);
    return () => document.body.removeEventListener("click", handleExpanded);
  }, []);

  const onFocus = async e => {
    const suggestions = await fetchSuggestedTerms(e.target.value);
    dispatch({ type: types.UPDATE_SUGGESTIONS, suggestions });
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
      <VisuallyHidden>
        <label htmlFor="ex1-input" id="ex1-label">
          Search for products at Shipt
        </label>
      </VisuallyHidden>
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
          value={query}
          aria-autocomplete="list"
          aria-controls="ex1-listbox"
          aria-activedescendant={activeId}
          onKeyDown={onKeyDown}
          onChange={onChange}
          onFocus={onFocus}
        />
        <button
          aria-label={
            query ? `Search for ${query}` : "Search for products on Shipt"
          }
          className={`bn br--right pointer ${focused ? "br0" : "br1"}`}
          style={{ background: shiptGreen, padding: "5px 5px 2px 8px" }}
          onClick={() => {
            dispatch({ type: types.COLLAPSE_LIST });
            alert(query);
          }}
        >
          <span role="img" aria-label="magnifying glass">
            🔍
          </span>
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
          className="pointer outline-0 bt b--light-silver"
          highlightIndex={highlightIndex}
          onAriaSelect={activeId =>
            dispatch({ type: types.SET_ACTIVE_ID, activeId })
          }
          updateValue={() => dispatch({ type: types.SELECT_LIST_ITEM })}
        >
          <OptionsList>
            {suggestions.map(term => (
              <Option
                key={term}
                aria-label={term}
                className="ph2 pv1"
                onMouseEnter={index =>
                  dispatch({ type: types.HIGHLIGHT, highlightIndex: index })
                }
              >
                <TextEmphasis query={query} style={{ fontWeight: "bold" }}>
                  {term}
                </TextEmphasis>
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
