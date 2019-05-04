import React from "react";
import { Listbox, OptionsList, Option } from "../../src";
import { CAR_COMPANIES } from "../constants";

export default () => (
  <Listbox focused>
    <OptionsList>
      {CAR_COMPANIES.map(element => (
        <Option key={element} style={{ padding: "0.25rem" }}>
          {element}
        </Option>
      ))}
    </OptionsList>
  </Listbox>
);
