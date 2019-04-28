import React, { Component, createRef } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";
import { KEY_CODE, ID_PREFIX } from "../constants";
import { getDeepestChild } from "../utils";

export class Listbox extends Component {
  static propTypes = {
    activeClass: PropTypes.string,
    activeIndex: PropTypes.number,
    activeStyles: PropTypes.object,
    ariaLabelledBy: PropTypes.string,
    children: PropTypes.node.isRequired,
    highlight: PropTypes.bool,
    id: PropTypes.string,
    onAriaSelect: PropTypes.func,
    onHighlight: PropTypes.func,
    onKeyDown: PropTypes.func,
    style: PropTypes.object,
    updateValue: PropTypes.func
  };

  static defaultProps = {
    activeClass: "",
    activeIndex: undefined,
    activeStyles: { background: "#BDE4FF" },
    ariaLabelledBy: "",
    children: "",
    highlight: false,
    id: "",
    onAriaSelect: () => {},
    onHighlight: () => {},
    onKeyDown: () => {},
    style: {},
    updateValue: () => {}
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
        activeId: `${ID_PREFIX}0-0`
      });
      this.listboxRef.current.focus();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.isControlled()) {
      const { activeIndex, onAriaSelect } = this.props;
      if (activeIndex !== prevProps.activeIndex) {
        onAriaSelect(`${ID_PREFIX}0-${activeIndex}`);
      }
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
    const activeNode = this.isControlled()
      ? document.getElementById(this.props.activeId)
      : document.getElementById(this.state.activeId);
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
    const { style, highlight, onHighlight, ariaLabelledBy } = this.props;
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
              const id = `${ID_PREFIX}${row}-${col}`;
              return React.cloneElement(Option, {
                id,
                index: optionIndex,
                activeStyles: this.props.activeStyles,
                isSelected:
                  optionIndex ===
                  (this.isControlled()
                    ? this.props.activeIndex
                    : this.state.activeIndex),
                isHighlighted:
                  optionIndex ===
                  (this.isControlled()
                    ? this.props.highlightedIndex
                    : this.state.highlightedIndex),
                onMouseEnter: () => {
                  const highlightedIndex = optionIndex;
                  if (highlight) {
                    this.setState({ highlightedIndex });
                  }
                  onHighlight(highlightedIndex);
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
      <div
        tabIndex={0}
        style={style}
        role="listbox"
        id={this.props.id}
        ref={this.listboxRef}
        aria-labelledby={ariaLabelledBy}
        aria-activedescendant={
          this.isControlled() ? this.props.activeId : this.state.activeId
        }
        onKeyDown={e => this.onKeyDown(e, children)}
        onFocus={e => {
          if (this.state.activeId === undefined) {
            this.setState({
              activeIndex: 0,
              activeId: `${ID_PREFIX}0-0`
            });
          }
        }}
      >
        {children}
      </div>
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
