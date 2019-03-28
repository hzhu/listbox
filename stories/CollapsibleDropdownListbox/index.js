import React, { Component, createRef } from "react";
import { Listbox, Option, OptionsList } from "../../src";
import { transuraniumElements } from "../constants";

class CollapsibleDropdownListbox extends Component {
  state = {
    showDropdown: false,
    currentOption: "Neptunium"
  };
  updateValue = ({ activeIndex }) => {
    const updater = state => {
      if (state.showDropdown === false) {
        return {
          currentOption: transuraniumElements[activeIndex],
          showDropdown: true
        };
      } else {
        return { currentOption: transuraniumElements[activeIndex] };
      }
    };
    this.setState(updater);
  };
  hideDropdown = () => {
    this.setState({ showDropdown: false }, () =>
      setTimeout(() => this.btnRef.current.focus(), 0)
    );
  };
  btnRef = createRef();
  render() {
    return (
      <div>
        <div
          style={{
            padding: "20px",
            maxWidth: "50em",
            margin: "0 auto",
            background: "#EEE",
            border: "1px solid #AAA"
          }}
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
                firstFocused
                onKeyDown={e => {
                  e.preventDefault();
                  if (e.key === "Escape" || e.key === "Enter") {
                    this.hideDropdown();
                  }
                }}
                ariaLabelledBy="exp_elem"
                updateValue={this.updateValue}
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
      </div>
    );
  }
}

export default CollapsibleDropdownListbox;
