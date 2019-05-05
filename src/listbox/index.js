import React, { useRef, useState, useEffect, createRef } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";
import { KEY_CODE, ID_PREFIX } from "../constants";
import { focusElement, getDeepestChild } from "../utils";

export const Listbox = React.forwardRef((props, ref) => {
  const {
    id,
    grid,
    style,
    focused,
    children,
    onKeyDown,
    highlight,
    className,
    activeClass,
    updateValue,
    onHighlight,
    onAriaSelect,
    activeStyles,
    ariaLabelledBy,
    activeId: controlledActiveId,
    activeIndex: controlledActiveIndex
  } = props;
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [highlightedIndex, setHighlightedIndex] = useState();
  const isControlled = controlledActiveIndex != null;
  const selectOptionIndex = (activeIndex, activeId, selectedItem) => {
    updateValue({ activeIndex, activeId, selectedItem });
    if (!isControlled) {
      setActiveId(activeId);
      setActiveIndex(activeIndex);
    }
  };
  const listboxRef = useRef();
  const selectedOptionRef = createRef();
  const setItem = element => {
    const activeId = element.id;
    const { index } = element.dataset;
    const activeIndex = Number(index);
    selectOptionIndex(activeIndex, activeId, element.textContent);
  };
  const checkKeyPress = (e, children) => {
    let currentItem;
    let nextItem;
    switch (e.which) {
      case KEY_CODE.up:
      case KEY_CODE.down:
        e.preventDefault();
        currentItem = isControlled
          ? document.getElementById(controlledActiveId)
          : document.getElementById(activeId);
        if (e.which === KEY_CODE.up) {
          nextItem = currentItem.previousElementSibling;
        } else {
          nextItem = currentItem.nextElementSibling;
        }
        if (nextItem) {
          focusElement(nextItem, listboxRef.current);
          setItem(nextItem);
        }
        break;
      default:
        findItemToFocus(e.which, children);
    }
  };
  const cacheTypedChars = useRef("");
  const cachedTimeoutId = useRef(null);
  const findItemToFocus = (key, children) => {
    cacheTypedChars.current += String.fromCharCode(key).toLowerCase();
    if (cachedTimeoutId.current) {
      clearTimeout(cachedTimeoutId.current);
    }
    cachedTimeoutId.current = setTimeout(() => {
      cacheTypedChars.current = "";
    }, 500);
    if (cacheTypedChars.current) {
      const optionsList = children[0].props.children.filter(child => {
        let value = getDeepestChild(child).toLowerCase();
        return value.startsWith(cacheTypedChars.current);
      });
      if (optionsList.length) {
        const { id, index } = optionsList[0].props;
        const selectedItem = getDeepestChild(optionsList[0]);
        selectOptionIndex(index, id, selectedItem);
        document.getElementById(id).scrollIntoView(false);
      }
    }
  };
  /**
   * Handles setting the next active option in a grid based listbox.
   * @param {Object} e
   */
  const checkKeyPressGrid = e => {
    const activeNode = isControlled
      ? document.getElementById(controlledActiveId)
      : document.getElementById(activeId);
    const currentCoords = activeNode.id.slice(ID_PREFIX.length).split("-");
    let nextItem;
    switch (e.which || e.keyCode) {
      case KEY_CODE.left:
        e.preventDefault();
        nextItem = activeNode.previousElementSibling;
        break;
      case KEY_CODE.right:
        e.preventDefault();
        nextItem = activeNode.nextElementSibling;
        break;
      case KEY_CODE.up:
        e.preventDefault();
        currentCoords[0] = Number(currentCoords[0]) - 1;
        var nextCoords = currentCoords.join("-");
        var nextActiveId = ID_PREFIX + nextCoords;
        nextItem = document.getElementById(nextActiveId);
        break;
      case KEY_CODE.down:
        e.preventDefault();
        currentCoords[0] = Number(currentCoords[0]) + 1;
        var nextCoords = currentCoords.join("-");
        var nextActiveId = ID_PREFIX + nextCoords;
        nextItem = document.getElementById(nextActiveId);
        break;
      default:
        break;
    }

    if (nextItem) setItem(nextItem);
  };
  const handleKeyDown = (e, children) => {
    onKeyDown(e);
    if (grid) {
      checkKeyPressGrid(e);
    } else {
      checkKeyPress(e, children);
    }
  };
  useEffect(() => {
    if (focused) listboxRef.current.focus();
  });
  useEffect(() => {
    if (isControlled) {
      onAriaSelect(`${ID_PREFIX}0-${controlledActiveIndex}`);
    }
  }, [controlledActiveIndex]);
  let index = 0;
  const clonedChildren = React.Children.toArray(children)
    .filter(child => typeof child.type === "function")
    .map((OptionsList, row) =>
      React.cloneElement(OptionsList, {
        children: React.Children.map(
          OptionsList.props.children,
          (Option, col) => {
            const optionIndex = index;
            index++;
            const id = `${ID_PREFIX}${row}-${col}`;
            return React.cloneElement(Option, {
              id,
              index: optionIndex,
              activeStyles,
              isSelected:
                optionIndex ===
                (isControlled ? controlledActiveIndex : activeIndex),
              isHighlighted:
                optionIndex ===
                (isControlled ? highlightedIndex : highlightedIndex),
              onMouseEnter: () => {
                const highlightedIndex = optionIndex;
                if (highlight) {
                  setHighlightedIndex(highlightedIndex);
                }
                onHighlight(highlightedIndex);
              },
              onSelect: e => {
                selectOptionIndex(optionIndex, id, getDeepestChild(Option));
              }
            });
          }
        )
      })
    );
  return (
    <div
      id={id}
      tabIndex={0}
      style={style}
      role="listbox"
      className={className}
      ref={ref === null ? listboxRef : ref}
      aria-labelledby={ariaLabelledBy}
      aria-activedescendant={isControlled ? controlledActiveId : activeId}
      onKeyDown={e => handleKeyDown(e, clonedChildren)}
      onFocus={e => {
        if (activeId === undefined) {
          setActiveId(`${ID_PREFIX}0-0`);
          setActiveIndex(0);
        }
      }}
    >
      {clonedChildren}
    </div>
  );
});
Listbox.propTypes = {
  activeClass: PropTypes.string,
  activeIndex: PropTypes.number,
  activeId: PropTypes.string,
  activeStyles: PropTypes.object,
  ariaLabelledBy: PropTypes.string,
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool,
  grid: PropTypes.bool,
  highlight: PropTypes.bool,
  id: PropTypes.string,
  onAriaSelect: PropTypes.func,
  onHighlight: PropTypes.func,
  onKeyDown: PropTypes.func,
  style: PropTypes.object,
  updateValue: PropTypes.func
};

Listbox.defaultProps = {
  activeClass: "",
  activeIndex: undefined,
  activeId: undefined,
  activeStyles: { background: "#BDE4FF" },
  ariaLabelledBy: "",
  children: null,
  focused: false,
  grid: false,
  highlight: false,
  id: "",
  onAriaSelect: () => {},
  onHighlight: () => {},
  onKeyDown: () => {},
  style: {},
  updateValue: () => {}
};

export const OptionsList = ({ style, children }) => (
  <div
    style={{
      padding: 0,
      margin: 0,
      ...style
    }}
  >
    {children}
  </div>
);

export const Option = React.forwardRef((props, ref) => {
  let {
    id,
    index,
    style,
    onSelect,
    isSelected,
    onMouseEnter,
    activeStyles,
    isHighlighted,
    children,
    ...restProps
  } = props;
  activeStyles = (isSelected || isHighlighted) && activeStyles;
  return (
    <div
      id={id}
      role="option"
      data-index={index}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      ref={isSelected ? ref : null}
      aria-selected={isSelected || undefined}
      style={{ listStyle: "none", ...activeStyles, ...style }}
      {...restProps}
    >
      {children}
    </div>
  );
});
