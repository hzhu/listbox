import React from "react";
import { Listbox, OptionsList, Option } from "../../src/index.js";
import { EMOJISII } from "../constants.js";

export default () => (
  <Listbox focused grid>
    {EMOJISII.map((row, m) => (
      <OptionsList key={m} style={{ display: "flex" }}>
        {row.map((r, i) => {
          return <Option key={i}>{r.emoji}</Option>;
        })}
      </OptionsList>
    ))}
  </Listbox>
);
