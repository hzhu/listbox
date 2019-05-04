import React from "react";
import { Listbox, Option, OptionsList } from "../../src";
import { transuraniumElements } from "../constants";

const ScrollableListbox = () => (
  <div style={{ maxWidth: "50em", margin: "0 auto" }}>
    <p>Choose your favorite transuranic element (actinide or transactinide).</p>
    <div
      style={{
        padding: "20px",
        background: "#EEE",
        border: "1px solid #AAA"
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <span id="lb-title">Transuranium Elements</span>
      </div>
      <Listbox
        focused
        ariaLabelledBy="lb-title"
        activeStyles={{ background: "#BDE4FF" }}
        style={{
          width: "350px",
          maxHeight: "18em",
          overflowY: "auto",
          background: "#FFF",
          position: "relative",
          border: "1px solid #AAA"
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

export default ScrollableListbox;
