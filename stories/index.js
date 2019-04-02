import React from "react";

import { storiesOf } from "@storybook/react";
import Listbox from "./Listbox";
import CollapsibleDropdown from "./CollapsibleDropdown";
import Combobox from "./Combobox";
import ScrollableListbox from "./ScrollableListbox";
import EmojiPicker from "./EmojiPicker";

storiesOf("Listbox Widgets", module)
  .add("Listbox (BASE)", () => <Listbox />)
  .add("Scrollable Listbox", () => <ScrollableListbox />)
  .add("Combobox", () => <Combobox />)
  .add("Collapsible Dropdown", () => <CollapsibleDropdown />)
  .add("Collapsible Dropdown (Emoji)", () => <EmojiPicker />);
