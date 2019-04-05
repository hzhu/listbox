import React from "react";

import { storiesOf } from "@storybook/react";
import Listbox from "./Listbox";
import CollapsibleDropdown from "./CollapsibleDropdown";
import Combobox from "./Combobox";
import ScrollableListbox from "./ScrollableListbox";
import EmojiDropdown from "./EmojiDropdown";
import EmojiListbox from "./EmojiListbox/";

storiesOf("Listbox Widgets", module)
  .add("Listbox (Base)", () => <Listbox />)
  .add("Listbox (Emoji)", () => <EmojiListbox />)
  .add("Scrollable Listbox", () => <ScrollableListbox />)
  .add("Collapsible Dropdown", () => <CollapsibleDropdown />)
  .add("Collapsible Dropdown (Emoji)", () => <EmojiDropdown />)
  .add("Combobox", () => <Combobox />);
