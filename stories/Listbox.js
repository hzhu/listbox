import React from "react";
import { Listbox, OptionsList, Option } from "../";
import { CAR_COMPANIES } from "./constants";

export default () => (
  <Listbox focused>
    <OptionsList>
      {CAR_COMPANIES.map(element => (
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
);
