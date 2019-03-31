import React, { Component } from "react";
import {
  Listbox,
  OptionsList,
  Option,
  CollapsibleDropdown,
  DropdownButton
} from "../../src/index.js";

import { transuraniumElements } from "../constants";

class App extends Component {
  state = {
    value: transuraniumElements[0]
  };
  updateValue = ({ activeId, activeIndex, selectedItem }) => {
    this.setState({ activeId, activeIndex, value: selectedItem });
  };
  render() {
    return (
      <React.Fragment>
        <CollapsibleDropdown
          style={{
            padding: "20px",
            background: "#EEE"
          }}
        >
          {({ expanded }) => (
            <React.Fragment>
              <div style={{ marginBottom: "10px" }}>
                <span id="exp_elem">Choose an element</span>
              </div>
              <DropdownButton
                ariaLabelledBy="exp_elem"
                style={{
                  width: "150px",
                  fontSize: "16px",
                  textAlign: "left",
                  background: "#FFF",
                  padding: "5px 10px"
                }}
              >
                {this.state.value}
              </DropdownButton>
              {expanded ? (
                <Listbox
                  focused
                  ariaLabelledBy="exp_elem"
                  updateValue={this.updateValue}
                  activeId={this.state.activeId}
                  activeIndex={this.state.activeIndex}
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
                      <Option key={element} style={{ padding: "5px" }}>
                        {element}
                      </Option>
                    ))}
                  </OptionsList>
                </Listbox>
              ) : null}
            </React.Fragment>
          )}
        </CollapsibleDropdown>
        <button onClick={() => alert(`Submitting: ${this.state.value}`)}>
          Submit
        </button>
      </React.Fragment>
    );
  }
}

export default () => {
  return <App />;
};
