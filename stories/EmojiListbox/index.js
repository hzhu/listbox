import React from "react";
import { Listbox, OptionsList, Option } from "../../src/index.js";
import { EMOJI_GRID } from "../constants.js";

export default () => (
  <Listbox style={{ maxWidth: "530px" }} focused grid>
    {EMOJI_GRID.map((row, i) => (
      <OptionsList key={i} style={{ display: "flex", fontSize: "18px" }}>
        {row.map(cell => (
          <Option
            key={cell.name}
            style={{
              width: "30px",
              textAlign: "center",
              paddingLeft: "3px"
            }}
          >
            {cell.emoji}
          </Option>
        ))}
      </OptionsList>
    ))}
  </Listbox>
);
