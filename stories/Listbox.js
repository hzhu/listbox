import React from "react";
import { Listbox, Option } from "../";
import { CAR_COMPANIES } from "./constants";

export default () => (
  <Listbox>
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
  </Listbox>
);
