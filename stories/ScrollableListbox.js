import React, { Component, createRef } from "react";
import { Listbox, Option } from "../";
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
          <p>Transuranium Elements</p>
          <Listbox
            // focused
            // cycle
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
          </Listbox>
        </div>
      </div>
    );
  }
}

export default ScrollableListbox;
