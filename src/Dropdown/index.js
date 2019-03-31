import React, { Component, createRef, createContext } from "react";
import * as PropTypes from "prop-types";
import "@babel/polyfill";
import { KEY_CODE } from "../constants";
import { prettyDOM } from "react-testing-library";

const DropdownContext = createContext();

export class CollapsibleDropdown extends Component {
  state = { expanded: false };

  toggleDropdown = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

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
          onBlur={e => {
            if (e.target.getAttribute("role") === "listbox") {
              this.setState({ expanded: false });
            }
          }}
          onKeyDown={e => {
            if (e.keyCode === KEY_CODE.space) e.preventDefault();
            if (e.target.getAttribute("role") !== "listbox") return;
            if (e.keyCode === KEY_CODE.return || e.keyCode === KEY_CODE.esc) {
              this.setState({ expanded: false }, () => {
                setTimeout(() => {
                  this.btnRef.current && this.btnRef.current.focus();
                }, 0);
              });
            }
          }}
        >
          {this.props.children(this.state)}
        </div>
      </DropdownContext.Provider>
    );
  }
}

export const DropdownButton = ({ style, ariaLabelledBy, children }) => (
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
      >
        {children}
      </button>
    )}
  </DropdownContext.Consumer>
);
