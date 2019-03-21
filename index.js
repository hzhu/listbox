import React, { Component, createRef, createContext } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";

const standardTypeChars = e => e.which < 127 && e.which > 31;

const keyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
};

let ListboxContext = createContext();

export class Listbox extends Component {
  static propTypes = {
    style: PropTypes.object,
    activeClass: PropTypes.string,
    updateValue: PropTypes.func,
    activeStyles: PropTypes.object
  };

  static defaultProps = {
    style: {},
    activeClass: "",
    updateValue: () => {},
    activeStyles: { background: "#BDE4FF" },
    activeIndex: undefined
  };

  state = {
    activeIndex: this.props.activeIndex || -1, // this.props.defaultActiveIndex?
    activeId: undefined,
    selectOptionIndex: (activeIndex, activeId, selectedItem) => {
      this.isControlled()
        ? this.props.updateValue({ activeIndex, activeId, selectedItem })
        : this.setState({ activeIndex, activeId });
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

  // activeDescendant = this.listboxRef.current;

  setItem(element) {
    const activeId = element.id;
    const { index } = element.dataset;
    const activeIndex = Number(index);
    this.setState({ activeId, activeIndex });
  }

  focusItem(element) {
    const listboxNode = this.listboxRef.current;
    var scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
    var elementBottom = element.offsetTop + element.offsetHeight;
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
      case keyCode.UP:
      case keyCode.DOWN:
        e.preventDefault();
        currentItem = this.isControlled()
          ? document.getElementById(this.props.activeId)
          : document.getElementById(this.state.activeId);
        if (e.which === keyCode.UP) {
          nextItem = currentItem.previousElementSibling;
        } else {
          nextItem = currentItem.nextElementSibling;
        }
        if (nextItem) {
          this.focusItem(nextItem);
          this.setItem(nextItem);
        }
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
      // ouch
      const filteredChildren = children[0].props.children.filter(child => {
        let value = getDeepestChild(child).toLowerCase();
        return value.startsWith(this.cacheTypedChars);
      });
      if (filteredChildren.length) {
        this.setState({
          activeIndex: filteredChildren[0].props.optionIndex,
          activeId: filteredChildren[0].props.id
        });
      }
    }
  }

  checkKeyPressGrid(e) {
    let currentItem;
    let nextItem;
    switch (e.which) {
      case keyCode.UP:
        e.preventDefault();
        currentItem = document.getElementById(
          `listbox__option__0-${this.state.activeIndex}`
        );
        nextItem = currentItem.previousElementSibling;
        this.focusItem(nextItem);
        this.setItem(nextItem);
    }
  }

  onKeyDown = (e, children) => {
    if (this.props.grid) {
      this.checkKeyPressGrid(e);
    } else {
      this.checkKeyPress(e, children);
    }
  };

  isControlled() {
    return this.props.activeIndex != null;
  }

  render() {
    const { style } = this.props;
    let index = 0;
    let children = React.Children.map(this.props.children, (OptionsList, row) =>
      React.cloneElement(OptionsList, {
        children: React.Children.map(
          OptionsList.props.children,
          (Option, col) => {
            const optionIndex = index;
            index++;
            const id = `listbox__option__${row}-${col}`;
            return React.cloneElement(Option, {
              row,
              col,
              id,
              optionIndex,
              foo: "BARRRRR"
            });
          }
        )
      })
    );
    const value = this.isControlled()
      ? {
          ...this.state,
          activeIndex: this.props.activeIndex,
          activeId: this.props.activeId
        }
      : this.state;

    return (
      <ListboxContext.Provider value={value}>
        <div
          tabIndex={0}
          onKeyDown={e => this.onKeyDown(e, children)}
          onFocus={e => {
            if (this.state.activeId === undefined) {
              this.setState({
                activeIndex: 0,
                activeId: "listbox__option__0-0"
              });
            }
          }}
          role="listbox"
          data-testid="Listbox"
          ref={this.listboxRef}
          style={style}
          aria-activedescendant={value.activeId}
        >
          {children}
        </div>
      </ListboxContext.Provider>
    );
  }
}

export class OptionsList extends Component {
  render() {
    return (
      <ListboxContext.Consumer>
        {context => {
          let children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              foo: "BAAAARRR",
              index: child.props.optionIndex,
              isSelected: context.activeIndex === child.props.optionIndex,
              onSelect: e => {
                const { row, col } = child.props;
                const activeId = `listbox__option__${row}-${col}`;
                context.selectOptionIndex(
                  child.props.optionIndex,
                  activeId,
                  child.props.children
                );
              }
            });
          });
          return (
            <ul
              style={{
                padding: 0,
                ...this.props.style
              }}
            >
              {children}
            </ul>
          );
        }}
      </ListboxContext.Consumer>
    );
  }
}

export class Option extends Component {
  render() {
    const { index, onSelect, isSelected, onMouseEnter, row, col } = this.props;
    const styles = isSelected ? { background: "#BDE4FF" } : undefined;
    return (
      <li
        id={`listbox__option__${row}-${col}`}
        data-index={index}
        role="option"
        onClick={onSelect}
        aria-selected={isSelected || undefined}
        style={{ ...styles, listStyle: "none" }}
      >
        {this.props.children}
      </li>
    );
  }
}

function getDeepestChild(node) {
  if (typeof node.props.children === "string") {
    return node.props.children;
  } else {
    return getDeepestChild(node.props.children);
  }
}
