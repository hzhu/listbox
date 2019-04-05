import React, { Component, createRef, createContext } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";
import { KEY_CODE } from "../constants";
import { getDeepestChild } from "../utils";

const ListboxContext = createContext();

export class Listbox extends Component {
  static propTypes = {
    style: PropTypes.object,
    activeClass: PropTypes.string,
    updateValue: PropTypes.func,
    activeStyles: PropTypes.object,
    onKeyDown: PropTypes.func
  };

  static defaultProps = {
    style: {},
    activeClass: "",
    updateValue: () => {},
    activeStyles: { background: "#BDE4FF" },
    activeIndex: undefined,
    onKeyDown: () => {}
  };

  state = {
    activeIndex: undefined,
    activeId: undefined,
    highlightedIndex: undefined,
    selectOptionIndex: (activeIndex, activeId, selectedItem) => {
      this.props.updateValue({ activeIndex, activeId, selectedItem });
      if (!this.isControlled()) {
        this.setState({ activeIndex, activeId });
      }
    }
  };

  componentDidMount() {
    if (this.props.focused) {
      this.setState({
        activeIndex: 0,
        activeId: "listbox__option__0-0"
      });
      this.listboxRef.current.focus();
    }
  }

  listboxRef = createRef();
  selectedOptionRef = createRef();

  setItem(element) {
    const activeId = element.id;
    const { index } = element.dataset;
    const activeIndex = Number(index);
    this.state.selectOptionIndex(activeIndex, activeId, element.textContent);
  }

  focusItem(element) {
    const listboxNode = this.listboxRef.current;
    const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
    const elementBottom = element.offsetTop + element.offsetHeight;
    if (elementBottom > scrollBottom) {
      listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
    } else if (element.offsetTop < listboxNode.scrollTop) {
      listboxNode.scrollTop = element.offsetTop;
    }
  }

  checkKeyPress(e, children) {
    let currentItem;
    let nextItem;
    switch (e.which) {
      case KEY_CODE.up:
      case KEY_CODE.down:
        e.preventDefault();
        currentItem = this.isControlled()
          ? document.getElementById(this.props.activeId)
          : document.getElementById(this.state.activeId);
        if (e.which === KEY_CODE.up) {
          nextItem = currentItem.previousElementSibling;
        } else {
          nextItem = currentItem.nextElementSibling;
        }
        if (nextItem) {
          this.focusItem(nextItem);
          this.setItem(nextItem);
        }
        break;
      default:
        this.findItemToFocus(e.which, children);
    }
  }

  cacheTypedChars = "";
  cachedTimeoutId;

  findItemToFocus(key, children) {
    this.cacheTypedChars += String.fromCharCode(key).toLowerCase();
    if (this.cachedTimeoutId) {
      clearTimeout(this.cachedTimeoutId);
    }
    this.cachedTimeoutId = setTimeout(() => {
      this.cacheTypedChars = "";
    }, 500);
    if (this.cacheTypedChars) {
      const optionsList = children[0].props.children.filter(child => {
        let value = getDeepestChild(child).toLowerCase();
        return value.startsWith(this.cacheTypedChars);
      });
      if (optionsList.length) {
        const { id, index } = optionsList[0].props;
        const selectedItem = getDeepestChild(optionsList[0]);
        this.state.selectOptionIndex(index, id, selectedItem);
        document.getElementById(id).scrollIntoView(false);
      }
    }
  }

  /**
   * Handles setting the next active option in a grid based listbox.
   * @param {Object} e
   */
  checkKeyPressGrid(e) {
    const idPrefix = "listbox__option__";
    const activeNode = this.isControlled()
      ? document.getElementById(this.props.activeId)
      : document.getElementById(this.state.activeId);
    const currentCoords = activeNode.id.slice(idPrefix.length).split("-");
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
        var nextActiveId = idPrefix + nextCoords;
        nextItem = document.getElementById(nextActiveId);
        break;
      case KEY_CODE.down:
        e.preventDefault();
        currentCoords[0] = Number(currentCoords[0]) + 1;
        var nextCoords = currentCoords.join("-");
        var nextActiveId = idPrefix + nextCoords;
        nextItem = document.getElementById(nextActiveId);
        break;
      default:
        break;
    }

    if (nextItem) this.setItem(nextItem);
  }

  onKeyDown = (e, children) => {
    const { grid, onKeyDown } = this.props;
    onKeyDown(e);
    if (grid) {
      this.checkKeyPressGrid(e);
    } else {
      this.checkKeyPress(e, children);
    }
  };

  isControlled() {
    return this.props.activeIndex != null;
  }

  render() {
    const value = this.isControlled()
      ? {
          ...this.state,
          activeIndex: this.props.activeIndex,
          activeId: this.props.activeId
        }
      : this.state;
    const { style, highlight, ariaLabelledBy } = this.props;
    let index = 0;
    const children = React.Children.toArray(this.props.children)
      .filter(child => typeof child.type === "function")
      .map((OptionsList, row) =>
        React.cloneElement(OptionsList, {
          children: React.Children.map(
            OptionsList.props.children,
            (Option, col) => {
              const optionIndex = index;
              index++;
              const id = `listbox__option__${row}-${col}`;
              return React.cloneElement(Option, {
                id,
                index: optionIndex,
                activeStyles: this.props.activeStyles,
                isSelected: optionIndex === value.activeIndex,
                isHighlighted: optionIndex === value.highlightedIndex,
                onMouseEnter: () => {
                  if (highlight) {
                    this.setState({
                      highlightedIndex: optionIndex
                    });
                  }
                },
                onSelect: e => {
                  this.state.selectOptionIndex(
                    optionIndex,
                    id,
                    getDeepestChild(Option)
                  );
                }
              });
            }
          )
        })
      );

    return (
      <ListboxContext.Provider value={value}>
        <div
          tabIndex={0}
          style={style}
          role="listbox"
          ref={this.listboxRef}
          aria-labelledby={ariaLabelledBy}
          aria-activedescendant={value.activeId}
          onKeyDown={e => this.onKeyDown(e, children)}
          onFocus={e => {
            if (this.state.activeId === undefined) {
              this.setState({
                activeIndex: 0,
                activeId: "listbox__option__0-0"
              });
            }
          }}
        >
          {children}
        </div>
      </ListboxContext.Provider>
    );
  }
}

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

export const Option = ({
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
}) => {
  activeStyles = (isSelected || isHighlighted) && activeStyles;
  return (
    <div
      id={id}
      role="option"
      data-index={index}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      aria-selected={isSelected || undefined}
      style={{ listStyle: "none", ...activeStyles, ...style }}
      {...restProps}
    >
      {children}
    </div>
  );
};
