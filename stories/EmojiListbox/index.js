import React from "react";
import { Listbox, OptionsList, Option } from "../../src/index.js";
import { EMOJI_GRID } from "../constants.js";

export default () => (
  <Listbox focused grid>
    {EMOJI_GRID.map((row, i) => (
      <OptionsList key={i} style={{ display: "flex" }}>
        {row.map(cell => (
          <Option key={cell.name}>{cell.emoji}</Option>
        ))}
      </OptionsList>
    ))}
  </Listbox>
);
