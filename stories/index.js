import React from "react";

import { storiesOf } from "@storybook/react";
import Listbox from "./Listbox";
import CollapsibleDropdownListbox from "./CollapsibleDropdownListbox";
import Combobox from "./Combobox";
import ScrollableListbox from "./ScrollableListbox";

storiesOf("Listbox Widgets", module)
  .add("Listbox (base)", () => <Listbox />)
  .add("Combobox", () => <Combobox />)
  .add("Collapsible Dropdown Listbox", () => <CollapsibleDropdownListbox />)
  .add("Scrollable Listbox", () => <ScrollableListbox />);
