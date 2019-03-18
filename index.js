import React, { Component, createRef } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";

const standardTypeChars = e => e.which < 127 && e.which > 31;

const keyCode = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

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
    activeOptionId: "",
    activeIndex: undefined
  };

  listboxRef = createRef();
  selectedOptionRef = createRef();

  focusItem = (e, children) => {
    const { updateValue } = this.props;

    if (Object.values(keyCode).includes(e.which)) {
      e.preventDefault();
    }
    let nextOptionId;
    let nextChild;
    let nextIdx;

    const currOptionIdx = children.findIndex(
      child => child.props.index === this.state.activeIndex
    );

    if (e.which === keyCode.RIGHT || e.which === keyCode.DOWN) {
      if (currOptionIdx === children.length - 1) {
        nextOptionId = children[0].props.id;
        nextChild = children[0].props.children;
        nextIdx = 0;
        if (!this.props.cycle) {
          return;
        }
      } else {
        nextOptionId = children[currOptionIdx + 1].props.id;
        nextChild = children[currOptionIdx + 1].props.children;
        nextIdx = currOptionIdx + 1;
      }
      const updater = () => ({
        activeOptionId: nextOptionId,
        activeIndex: nextIdx
      });
      this.setState(updater, () => {
        updateValue(this.state);
        this.selectItem();
      });
    }

    if (e.which === keyCode.LEFT || e.which === keyCode.UP) {
      if (currOptionIdx === 0) {
        nextOptionId = children[children.length - 1].props.id;
        nextChild = children[children.length - 1].props.children;
        nextIdx = children.length - 1;
        if (!this.props.cycle) {
          return;
        }
      } else {
        nextOptionId = children[currOptionIdx - 1].props.id;
        nextChild = children[currOptionIdx - 1].props.children;
        nextIdx = currOptionIdx - 1;
      }
      const updater = () => ({
        activeOptionId: nextOptionId,
        activeIndex: nextIdx
      });
      this.setState(updater, () => {
        updateValue(this.state);
        this.selectItem();
      });
    }
  };

  // occurs on every render, potentially a perf issue
  makeChildren = () => {
    const { updateValue } = this.props;
    let children = React.Children.map(this.props.children, (child, index) => {
      let id = `listbox-option-${index}`;
      let isSelected = index === this.state.activeIndex;

      let isHighlighted = index === this.state.highlightedIndex;

      if (this.isControlled()) {
        if (index === this.props.activeIndex) {
          isSelected = true;
        }
      }

      const props = {
        id,
        index,
        isSelected,
        isHighlighted,
        onMouseEnter: this.isControlled()
          ? e => {
              this.props.onMouseEnter(index);
              this.setState({
                highlightedIndex: index
              });
            }
          : () => {},
        activeStyles: this.props.activeStyles,
        selectedOptionRef: isSelected ? this.selectedOptionRef : undefined,
        onSelect: () => {
          const updater = state => {
            return {
              activeIndex: index,
              activeOptionId: id,
              selectedItem: child.props.children
            };
          };
          this.setState(updater, () => {
            updateValue(this.state);
          });
        }
      };
      return React.cloneElement(child, props);
    });

    return children;
  };

  cacheTypedChars = "";
  cachedTimeoutId;

  isControlled = () => {
    const controlPropExists = this.props.activeIndex !== undefined;
    const controlPropIsNumber = typeof this.props.activeIndex === "number";
    return controlPropExists && controlPropIsNumber;
  };
  selectItem() {
    const listBoxNode = this.listboxRef.current;
    const element = this.selectedOptionRef.current;
    const { clientHeight, scrollTop } = listBoxNode;
    const { offsetTop, offsetHeight } = element;
    const scrollBottom = clientHeight + scrollTop;
    const elementBottom = offsetTop + offsetHeight;

    if (elementBottom > scrollBottom) {
      listBoxNode.scrollTop = elementBottom - clientHeight;
    } else if (offsetTop < scrollTop) {
      listBoxNode.scrollTop = offsetTop;
    }
  }
  componentDidMount() {
    if (this.props.focused) {
      this.listboxRef.current.focus();
      const activeOptionId = this.listboxRef.current.children[0].id;
      this.setState({ activeOptionId, activeIndex: 0 });
    }
  }
  render() {
    const { activeOptionId } = this.state;
    const { style, updateValue } = this.props;
    let children = this.makeChildren();

    return (
      <ul
        data-testid="Listbox-ul"
        tabIndex={this.isControlled() ? undefined : 0}
        role="listbox"
        className="Listbox"
        ref={this.listboxRef}
        aria-activedescendant={this.isControlled() ? undefined : activeOptionId}
        style={{
          // CSS Reset
          margin: 0,
          padding: 0,
          ...style
        }}
        onFocus={() => {
          if (this.state.activeIndex !== 0) {
            const updater = state => {
              if (state.activeOptionId === "") {
                return {
                  activeOptionId: children[0].props.id,
                  activeIndex: 0
                };
              }
            };
            if (!this.isControlled()) {
              this.setState(updater);
            }
            if (this.props.focused) {
              updateValue({ activeIndex: children[0].props.index });
            }
          }
        }}
        onKeyDown={e => {
          // Only prevent default behavior on listBox related keys
          this.focusItem(e, children);
          if (e.key === "Enter") return;
          if (!standardTypeChars(e)) return;
          this.cacheTypedChars += String.fromCharCode(e.which).toLowerCase();
          if (this.cachedTimeoutId) {
            clearTimeout(this.cachedTimeoutId);
          }
          this.cachedTimeoutId = setTimeout(() => {
            this.cacheTypedChars = "";
          }, 500);
          if (this.cacheTypedChars) {
            const filteredChildren = children.filter(child => {
              let value = getDeepestChild(child).toLowerCase();
              return value.startsWith(this.cacheTypedChars);
            });
            if (filteredChildren.length) {
              this.setState({
                activeIndex: filteredChildren[0].props.index,
                activeOptionId: `listbox-option-${
                  filteredChildren[0].props.index
                }`
              });
            }
          }
        }}
      >
        {children}
      </ul>
    );
  }
}

export class Option extends Component {
  render() {
    const {
      id,
      onSelect,
      isSelected,
      isHighlighted,
      activeStyles,
      selectedOptionRef,
      onMouseEnter
    } = this.props;
    const styles = isSelected || isHighlighted ? activeStyles : undefined;
    return (
      <li
        id={id}
        onMouseEnter={onMouseEnter}
        role="option"
        onClick={onSelect}
        ref={selectedOptionRef}
        className="Listbox-option"
        data-index={this.props.index}
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
