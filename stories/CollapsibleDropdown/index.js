import React, { useState } from "react";
import {
  Listbox,
  OptionsList,
  Option,
  CollapsibleDropdown,
  DropdownButton
} from "../../src/index.js";
import { transuraniumElements } from "../constants";

const Example = () => {
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(transuraniumElements[0]);
  const updateValue = ({ activeId, activeIndex, selectedItem }) => {
    setActiveId(activeId);
    setActiveIndex(activeIndex);
    setExpanded(true);
    setValue(selectedItem);
  };
  return (
    <>
      <CollapsibleDropdown
        expanded={expanded}
        style={{
          padding: "20px",
          background: "#EEE"
        }}
      >
        {expanded => (
          <>
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
              {value}
            </DropdownButton>
            {expanded ? (
              <Listbox
                focused
                aria-labelledby="exp_elem"
                updateValue={updateValue}
                activeId={activeId}
                activeIndex={activeIndex}
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
          </>
        )}
      </CollapsibleDropdown>
      <button onClick={() => alert(`Submitting: ${value}`)}>Submit</button>
    </>
  );
};

export default Example;
