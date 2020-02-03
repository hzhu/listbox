import React from "react";
import { Listbox, OptionsList, Option } from "../../src";
import { CAR_COMPANIES } from "../constants";

export default () => (
  <Listbox focused>
    <strong>Group 1</strong>
    <OptionsList>
      {CAR_COMPANIES.map(element => (
        <Option key={element} style={{ padding: "0.25rem" }}>
          {element}
        </Option>
      ))}
    </OptionsList>
    <strong>Group 2</strong>
    <OptionsList>
      <Option key={"Fard"} style={{ padding: "0.25rem" }}>
        Fard
      </Option>
      <Option key={"Sziu"} style={{ padding: "0.25rem" }}>
        Sziu
      </Option>
    </OptionsList>
  </Listbox>
);
