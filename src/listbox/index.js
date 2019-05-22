import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext
} from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";
import { KEY_CODE, ID_PREFIX } from "../constants";
import { focusElement, getDeepestChild } from "../utils";
import { useFindTypedItem } from "../hooks";

const ListboxContext = createContext();

export const Listbox = React.forwardRef((props, ref) => {
  const {
    grid,
    focused,
    children,
    onKeyDown,
    highlight,
    updateValue,
    onAriaSelect,
    activeStyles,
    activeId: controlledActiveId,
    activeIndex: controlledActiveIndex,
    highlightedIndex: controlledHighlightedIndex,
    ...restProps
  } = props;
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [highlightedIndex, setHighlightedIndex] = useState();
  const isControlled = controlledActiveIndex != null;
  const selectFromElement = element => {
    const { id, dataset, textContent } = element;
    const index = Number(dataset.index);
    selectOption(index, id, textContent);
  };
  const selectOption = (index, id, textContent) => {
    updateValue({
      activeId: id,
      activeIndex: index,
      selectedItem: textContent
    });
    if (!isControlled) {
      setActiveId(id);
      setActiveIndex(index);
    }
  };
  const listboxRef = useRef();
  const findItem = useFindTypedItem();
  const checkKeyPress = e => {
    let nextItem;
    let currentItem;
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
          selectFromElement(nextItem);
        }
        break;
      default: {
        const domNodes = [...listboxRef.current.children[0].children];
        const foundItem = findItem(e.which, domNodes);
        if (foundItem) {
          foundItem.scrollIntoView(false);
          selectFromElement(foundItem);
        }
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

    if (nextItem) selectFromElement(nextItem);
  };
  const handleKeyDown = e => {
    onKeyDown(e);
    grid ? checkKeyPressGrid(e) : checkKeyPress(e);
  };
  useEffect(() => {
    if (focused) listboxRef.current.focus();
  }, [focused]);
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
            const { value } = Option.props;
            const optionIndex = index;
            index++;
            const id = `${ID_PREFIX}${row}-${col}`;
            return React.cloneElement(Option, {
              id,
              index: optionIndex,
              textContent: value ? value : getDeepestChild(Option)
            });
          }
        )
      })
    );
  const context = {
    highlightedIndex: isControlled
      ? controlledHighlightedIndex
      : highlightedIndex,
    activeIndex: isControlled ? controlledActiveIndex : activeIndex,
    highlight,
    activeStyles,
    selectOption,
    setHighlightedIndex
  };
  return (
    <ListboxContext.Provider value={context}>
      <div
        tabIndex={0}
        role="listbox"
        ref={ref === null ? listboxRef : ref}
        aria-activedescendant={isControlled ? controlledActiveId : activeId}
        onKeyDown={handleKeyDown}
        onFocus={e => {
          if (activeId === undefined) {
            setActiveId(`${ID_PREFIX}0-0`);
            setActiveIndex(0);
          }
        }}
        {...restProps}
      >
        {clonedChildren}
      </div>
    </ListboxContext.Provider>
  );
});
Listbox.propTypes = {
  activeIndex: PropTypes.number,
  activeId: PropTypes.string,
  activeStyles: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool,
  grid: PropTypes.bool,
  highlight: PropTypes.bool,
  id: PropTypes.string,
  onAriaSelect: PropTypes.func,
  onKeyDown: PropTypes.func,
  style: PropTypes.object,
  updateValue: PropTypes.func
};

Listbox.defaultProps = {
  activeIndex: undefined,
  activeId: undefined,
  activeStyles: { background: "#BDE4FF" },
  className: "",
  children: null,
  focused: false,
  grid: false,
  highlight: false,
  id: "",
  onAriaSelect: () => {},
  onKeyDown: () => {},
  style: {},
  updateValue: () => {}
};

export const OptionsList = ({ children, ...restProps }) => (
  <div {...restProps}>{children}</div>
);

export const Option = React.forwardRef((props, ref) => {
  let {
    id,
    index,
    value,
    style,
    textContent,
    onMouseEnter,
    children,
    ...restProps
  } = props;

  let {
    highlight,
    activeIndex,
    activeStyles,
    selectOption,
    highlightedIndex,
    setHighlightedIndex
  } = useContext(ListboxContext);

  const isSelected = index === activeIndex;
  const isHighlighted = index === highlightedIndex;
  activeStyles = (isSelected || isHighlighted) && activeStyles;

  return (
    <div
      id={id}
      role="option"
      data-index={index}
      onClick={() => selectOption(index, id, textContent)}
      onMouseEnter={() => {
        if (highlight) setHighlightedIndex(index);
        onMouseEnter(index, id);
      }}
      ref={isSelected ? ref : null}
      aria-selected={isSelected || undefined}
      style={{ ...style, ...activeStyles }}
      {...restProps}
    >
      {children}
    </div>
  );
});

Option.propTypes = {
  className: PropTypes.string,
  onMouseEnter: PropTypes.func
};

Option.defaultProps = {
  className: "",
  onMouseEnter: () => {}
};
