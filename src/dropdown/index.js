import React, { Component, createRef, createContext } from "react";
import "@babel/polyfill";
import { KEY_CODE } from "../constants";
import { isDescendantListbox } from "../utils";

const DropdownContext = createContext();

export class CollapsibleDropdown extends Component {
  state = { expanded: false };
  toggleDropdown = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
  isControlled() {
    return this.props.expanded != null;
  }
  btnRef = createRef();
  render() {
    const contextValue = {
      ...this.state,
      btnRef: this.btnRef,
      toggleDropdown: this.toggleDropdown
    };
    return (
      <DropdownContext.Provider value={contextValue}>
        <div
          style={this.props.style}
          onClick={e => {
            if (!this.isControlled() && isDescendantListbox(e.target)) {
              this.toggleDropdown();
            }
          }}
          onBlur={e => {
            if (isDescendantListbox(e.target)) {
              this.toggleDropdown();
            }
          }}
          onKeyDown={e => {
            if (!isDescendantListbox(e.target)) return;
            if (e.keyCode === KEY_CODE.space) e.preventDefault();
            if (e.keyCode === KEY_CODE.return || e.keyCode === KEY_CODE.esc) {
              this.setState({ expanded: false }, () => {
                setTimeout(() => {
                  this.btnRef.current && this.btnRef.current.focus();
                }, 0);
              });
            }
          }}
        >
          {this.props.children(this.state.expanded)}
        </div>
      </DropdownContext.Provider>
    );
  }
}

export const DropdownButton = ({
  style,
  ariaLabelledBy,
  children,
  ...restProps
}) => (
  <DropdownContext.Consumer>
    {context => (
      <button
        tabIndex={0}
        style={style}
        id="exp_button"
        ref={context.btnRef}
        aria-haspopup="listbox"
        aria-expanded={context.expanded}
        aria-labelledby={`${ariaLabelledBy} exp_button`}
        onClick={context.toggleDropdown}
        {...restProps}
      >
        {children}
      </button>
    )}
  </DropdownContext.Consumer>
);
