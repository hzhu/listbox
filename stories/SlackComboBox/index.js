import React, { useRef, useState, useEffect } from "react";
import { KEY_CODE, COMBO_INPUT_KEYS } from "../../src/constants";
import { SLACK_PROFILES } from "../constants";
import { Listbox, Option, OptionsList } from "../../src";
import { focusElement } from "../../src/utils";
import "./index.css";

const SlackComboBox = () => {
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const activeOptionRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState();
  const suggestions =
    query.charAt(0) === "@"
      ? SLACK_PROFILES.filter(profile => {
          const name = profile.name.toLowerCase();
          const handle = profile.handle.toLowerCase();
          const searchQuery = query.slice(1).toLowerCase();
          return (
            name.indexOf(searchQuery) === 0 || handle.indexOf(searchQuery) === 0
          );
        })
      : [];
  const collapse = () => {
    setExpanded(false);
    setActiveId(undefined);
    setActiveIndex(0);
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
          setHighlightIndex(suggestions.length - 1);
        } else {
          setActiveIndex(activeIndex - 1);
          setHighlightIndex(activeIndex - 1);
        }
        if (activeOptionRef.current !== null && listboxRef.current !== null) {
          if (activeOptionRef.current.previousElementSibling === null) {
            listboxRef.current.scrollTop = listboxRef.current.scrollHeight;
            return;
          }
          focusElement(
            activeOptionRef.current.previousElementSibling,
            listboxRef.current
          );
        }
        break;
      case KEY_CODE.down:
        e.preventDefault();
        if (noActiveIndex || isLastActiveIndex) {
          setActiveIndex(0);
          setHighlightIndex(0);
        } else {
          setActiveIndex(activeIndex + 1);
          setHighlightIndex(activeIndex + 1);
        }
        if (activeOptionRef.current !== null && listboxRef.current !== null) {
          if (activeOptionRef.current.nextElementSibling === null) {
            listboxRef.current.scrollTop = 0;
            return;
          }
          focusElement(
            activeOptionRef.current.nextElementSibling,
            listboxRef.current
          );
        }
        break;
      case KEY_CODE.left:
      case KEY_CODE.right:
        setActiveIndex(-1);
        break;
      case KEY_CODE.esc:
        setQuery("");
        collapse();
        break;
      case KEY_CODE.tab:
        collapse();
        break;
      case KEY_CODE.return:
        if (activeIndex >= 0) {
          setQuery("@" + suggestions[activeIndex].handle);
          collapse();
        }
        break;
      default:
        console.log("default");
    }
  };

  useEffect(() => {
    const handleExpanded = e => {
      if (!document.getElementById("slack-combo-box").contains(e.target)) {
        setExpanded(false);
      }
    };
    document.body.addEventListener("click", handleExpanded);
    return () => document.body.removeEventListener("click", handleExpanded);
  }, []);
  const [isScrolling, setIsScrolling] = useState(false);
  let timeout = undefined;

  useEffect(() => {
    const onScroll = () => {
      if (timeout) window.clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 100);
      setIsScrolling(true);
    };
    if (listboxRef.current) {
      listboxRef.current.addEventListener("scroll", onScroll);
    }
    return () => {
      if (listboxRef.current) {
        listboxRef.current.removeEventListener("scroll", onScroll);
      }
    };
  }, [expanded, timeout, listboxRef]);

  return (
    <>
      {expanded && suggestions.length && query.length ? (
        <div className="flex-none">
          <div
            className="f7 pa2 lh-copy flex justify-between"
            style={{
              background: "#FAF8F6",
              color: "#7f7f83",
              border: "1px solid rgba(0,0,0,.15)",
              borderBottom: "none",
              borderRadius: "6px 6px 0 0"
            }}
          >
            <div>People matching “@”</div>
            <div className="flex">
              <div>
                <span className="fw6">↑</span> <span className="fw6">↓</span> to
                navigate
              </div>
              <div className="mh3">
                <span className="fw6">↵</span> to select
              </div>
              <div>
                <span className="fw6">esc</span> to dismiss
              </div>
            </div>
          </div>
          <Listbox
            highlight
            ref={listboxRef}
            id="ex1-listbox"
            aria-labelledby="ex1-label"
            activeIndex={activeIndex}
            highlightIndex={highlightIndex}
            onAriaSelect={activeId => setActiveId(activeId)}
            activeStyles={{ background: "#1D9BD1", color: "#FFF" }}
            updateValue={({ activeIndex, selectedItem }) => {
              setExpanded(false);
              setActiveIndex(activeIndex);
              setQuery("@" + selectedItem);
            }}
            className="overflow-y-scroll relative"
            style={{
              width: "800px",
              maxHeight: "390px",
              border: "1px solid #CCC",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px"
            }}
          >
            <OptionsList>
              {suggestions.map((profile, index) => {
                const isSelected = index === activeIndex;
                const isHighlighted = index === highlightIndex;
                const isActive = isSelected || isHighlighted;
                return (
                  <Option
                    key={profile.id}
                    ref={activeOptionRef}
                    value={profile.handle}
                    onMouseEnter={index => {
                      if (!isScrolling) {
                        setActiveIndex(index);
                        setHighlightIndex(index);
                      }
                    }}
                    style={{
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      cursor: "pointer"
                    }}
                  >
                    <>
                      <div
                        className="ml2 br-100"
                        style={{
                          width: "0.65rem",
                          height: "0.65rem",
                          background: `${profile.online ? "green" : "white"}`,
                          border: "1px solid #CCC"
                        }}
                      />
                      <img
                        src={profile.image}
                        className="br2 mh2"
                        style={{
                          width: "1.25rem",
                          height: "1.25rem"
                        }}
                      />
                      <span
                        className={`fw6 ${isActive ? "white" : "black-90"}`}
                      >
                        {profile.handle}
                      </span>
                      <span>&nbsp;</span>
                      <span
                        className={`ml1 ${isActive ? "white" : "mid-gray"}`}
                      >
                        {profile.name}
                      </span>
                      {profile.status ? (
                        <span
                          aria-label="current status"
                          className="mh2 black-50"
                        >
                          |
                        </span>
                      ) : null}
                      <span className={`${isActive ? "white" : "mid-gray"}`}>
                        {profile.status}
                      </span>
                    </>
                  </Option>
                );
              })}
            </OptionsList>
          </Listbox>
        </div>
      ) : null}
      <div
        tabIndex={-1}
        role="combobox"
        id="ex1-combobox"
        aria-owns="ex1-listbox"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        className="br3 outline-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          border: `2px solid rgba(0,0,0, ${isFocused ? "0.6" : ".3"})`
        }}
      >
        <input
          type="text"
          value={query}
          ref={inputRef}
          id="ex1-input"
          spellCheck="false"
          autoComplete="off"
          style={{ width: "95%" }}
          placeholder="Message #general"
          aria-autocomplete="list"
          aria-controls="ex1-listbox"
          aria-activedescendant={activeId}
          aria-label="Send A Slack message"
          className="pa2 br3 bn outline-0 bg-white"
          onKeyDown={onKeyDown}
          onChange={e => {
            const { value } = e.target;
            setQuery(value);
            if (value.length === 0) collapse();
            if (value) setExpanded(true);
          }}
        />
        <button
          aria-label="Insert mention"
          className="pointer grow-large"
          onClick={() => {
            setQuery("@");
            setExpanded(true);
            inputRef.current && inputRef.current.focus();
          }}
        >
          @
        </button>
      </div>
    </>
  );
};

export default () => (
  <div
    id="slack-combo-box"
    className="example-wrapper absolute bottom-1"
    style={{
      width: "800px",
      left: 0,
      right: 0,
      marginLeft: "auto",
      marginRight: "auto"
    }}
  >
    <SlackComboBox />
  </div>
);
