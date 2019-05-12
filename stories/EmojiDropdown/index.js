import React, { useState } from "react";
import {
  Listbox,
  Option,
  OptionsList,
  DropdownButton,
  CollapsibleDropdown
} from "../../src";
import { EMOJIS } from "../constants";

const Example = () => {
  const [value, setValue] = useState("😀");
  const [activeId, setActiveId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  return (
    <>
      <CollapsibleDropdown>
        {expanded => (
          <>
            <div style={{ marginBottom: "10px" }}>
              <span id="exp_elem">Choose an emoji</span>
            </div>
            <DropdownButton
              ariaLabelledBy="exp_elem"
              style={{
                fontSize: "26px",
                cursor: "pointer",
                background: "#FFF",
                verticalAlign: "middle",
                padding: "5px 5px 0 5px"
              }}
            >
              {value}
            </DropdownButton>
            {expanded ? (
              <Listbox
                grid
                focused
                highlight
                updateValue={({ activeId, activeIndex, selectedItem }) => {
                  setValue(selectedItem);
                  setActiveId(activeId);
                  setActiveIndex(activeIndex);
                  setHighlightedIndex(activeIndex);
                }}
                activeId={activeId}
                activeIndex={activeIndex}
                highlightedIndex={activeIndex}
                style={{
                  fontSize: "26px",
                  background: "#FFF",
                  position: "absolute"
                }}
              >
                {EMOJIS.map((row, m) => (
                  <OptionsList key={m} style={{ display: "flex" }}>
                    {row.map((emoji, n) => (
                      <Option
                        key={n}
                        onMouseEnter={(index, id) => {
                          setActiveId(id);
                          setActiveIndex(index);
                        }}
                        style={{
                          cursor: "pointer",
                          padding: "5px 5px 0px 5px"
                        }}
                      >
                        <span role="img" aria-label={emoji.name}>
                          {emoji.emoji}
                        </span>
                      </Option>
                    ))}
                  </OptionsList>
                ))}
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
