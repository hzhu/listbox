import React, { Component, createRef } from "react";
import { Listbox, Option, OptionsList } from "../index";
import { transuraniumElements } from "./constants";

class CollapsibleDropdownListbox extends Component {
  state = {
    currentOption: "Neptunium",
    showDropdown: false
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
  hideListbox = () => {
    this.btnRef.current.focus();
    this.setState({ showDropdown: false });
  };
  btnRef = createRef();
  render() {
    return (
      <div>
        <div
          style={{
            maxWidth: "50em",
            margin: "0 auto",
            padding: "20px",
            background: "#eee",
            border: "1px solid #aaa"
          }}
        >
          <p>{this.state.currentOption}</p>
          <p>Choose an element</p>
          <button
            ref={this.btnRef}
            tabIndex={0}
            style={{
              borderRadius: "0",
              fontSize: "16px",
              textAlign: "left",
              padding: "5px 10px",
              width: "150px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fff"
            }}
            onClick={() => {
              this.setState(state => ({
                showDropdown: !state.showDropdown
              }));
            }}
          >
            <div>{this.state.currentOption}</div>
            {this.state.showDropdown ? (
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid #aaa",
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
                  borderTop: "8px solid #aaa",
                  content: ""
                }}
              />
            )}
          </button>
          {/* 
              what if this prop isn't passed? 
              position the listbox right under the button
            */}

          {this.state.showDropdown ? (
            <div
              tabIndex={0}
              onBlur={this.hideListbox}
              onKeyDown={e => {
                e.preventDefault();
                if (e.key === "Escape" || e.key === "Enter") {
                  this.hideListbox();
                }
              }}
            >
              <Listbox
                focused
                firstFocused
                updateValue={this.updateValue}
                activeStyles={{ background: "#bde4ff" }}
                style={{
                  width: "148px",
                  maxHeight: "18em",
                  overflowY: "auto",
                  background: "#fff",
                  borderTop: 0,
                  border: "1px solid #aaa",
                  position: "absolute",
                  zIndex: 9999
                }}
              >
                <OptionsList>
                  {transuraniumElements.map(element => {
                    return (
                      <Option key={element}>
                        <div style={{ padding: "5px" }}>{element}</div>
                      </Option>
                    );
                  })}
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
