import React, { Component, createRef } from "react";
import { Listbox, Option, OptionsList } from "../../src";
import { transuraniumElements } from "../constants";
import { KEY_CODE } from "../../src/constants";

class CollapsibleDropdownListbox extends Component {
  state = {
    showDropdown: false,
    currentOption: "Neptunium"
  };
  updateValue = ({ activeIndex, activeId }) => {
    const updater = state => {
      return {
        currentOption: transuraniumElements[activeIndex],
        activeIndex,
        activeId
      };
    };
    this.setState(updater);
  };
  hideDropdown = (event = {}) => {
    event.preventDefault();
    event.persist();
    if (event.keyCode === KEY_CODE.esc || event.keyCode === KEY_CODE.return) {
      this.setState({ showDropdown: false }, () => {
        setTimeout(() => this.btnRef.current.focus(), 0);
      });
    }
    if (event.keyCode === KEY_CODE.tab) {
      this.setState({ showDropdown: false }, () => {
        const dropdown = this.collapsibleDropdownRef.current;
        dropdown && dropdown.nextSibling && dropdown.nextSibling.focus();
      });
    }
    if (event.type === "blur") {
      this.setState({ showDropdown: false });
    }
  };
  btnRef = createRef();
  collapsibleDropdownRef = createRef();
  render() {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "50em",
          margin: "0 auto",
          background: "#EEE",
          border: "1px solid #AAA"
        }}
        ref={this.collapsibleDropdownRef}
      >
        <div style={{ marginBottom: "10px" }}>
          <span id="exp_elem">Choose an element</span>
        </div>
        <button
          tabIndex={0}
          id="exp_button"
          ref={this.btnRef}
          aria-haspopup="listbox"
          aria-labelledby="exp_elem exp_button"
          aria-expanded={this.state.showDropdown}
          style={{
            width: "150px",
            display: "flex",
            fontSize: "16px",
            textAlign: "left",
            borderRadius: "0",
            background: "#fff",
            padding: "5px 10px",
            position: "relative",
            alignItems: "center",
            justifyContent: "space-between"
          }}
          onClick={() =>
            this.setState(state => ({
              showDropdown: !state.showDropdown
            }))
          }
        >
          {this.state.currentOption}
          {this.state.showDropdown ? (
            <div
              style={{
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid #AAA",
                content: ""
              }}
            />
          ) : (
            <div
              style={{
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #AAA",
                content: ""
              }}
            />
          )}
        </button>
        {this.state.showDropdown ? (
          <div tabIndex={0} onBlur={this.hideDropdown}>
            <Listbox
              focused
              ariaLabelledBy="exp_elem"
              activeId={this.state.activeId}
              activeIndex={this.state.activeIndex}
              updateValue={this.updateValue}
              onKeyDown={e => this.hideDropdown(e)}
              activeStyles={{ background: "#BDE4FF" }}
              style={{
                borderTop: 0,
                width: "148px",
                maxHeight: "18em",
                overflowY: "auto",
                background: "#FFF",
                position: "absolute",
                border: "1px solid #AAA"
              }}
            >
              <OptionsList>
                {transuraniumElements.map(element => (
                  <Option key={element}>
                    <div style={{ padding: "5px" }}>{element}</div>
                  </Option>
                ))}
              </OptionsList>
            </Listbox>
          </div>
        ) : null}
      </div>
    );
  }
}

export default CollapsibleDropdownListbox;
