import React, { Component, createRef } from "react";
import { Listbox, Option, OptionsList } from "../src";
import { transuraniumElements } from "./constants";

class ScrollableListbox extends Component {
  state = {
    value: undefined
  };
  portalRef = createRef();
  updateValue = value => {
    this.setState({ value });
  };
  render() {
    return (
      <div style={{ maxWidth: "50em", margin: "0 auto" }}>
        <p>
          Choose your favorite transuranic element (actinide or transactinide).
        </p>
        <div
          style={{
            padding: "20px",
            background: "#eee",
            border: "1px solid #aaa"
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <span id="lb-title">Transuranium Elements</span>
          </div>
          <Listbox
            // focused
            // cycle
            ariaLabelledBy="lb-title"
            updateValue={this.updateValue}
            activeClass=""
            activeStyles={{ background: "#bde4ff" }}
            style={{
              width: "350px",
              maxHeight: "18em",
              overflowY: "auto",
              background: "#fff",
              position: "relative",
              border: "1px solid #aaa"
            }}
          >
            <OptionsList>
              {transuraniumElements.map(element => (
                <Option key={element}>
                  <div
                    style={{
                      color: "black",
                      padding: "0 1em",
                      lineHeight: "1.8em",
                      position: "relative"
                    }}
                  >
                    {element}
                  </div>
                </Option>
              ))}
            </OptionsList>
          </Listbox>
        </div>
      </div>
    );
  }
}

export default ScrollableListbox;
