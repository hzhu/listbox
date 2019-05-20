import React from "react";

import { storiesOf } from "@storybook/react";
import Listbox from "./Listbox";
import CollapsibleDropdown from "./CollapsibleDropdown";
import ComboBox from "./ComboBox";
import ScrollableListbox from "./ScrollableListbox";
import EmojiDropdown from "./EmojiDropdown";
import EmojiListbox from "./EmojiListbox/";
import GitHubEmojiPicker from "./GitHubEmojiPicker/";
import ShiptComboBox from "./ShiptComboBox";
import SlackComboBox from "./SlackComboBox";

storiesOf("Listbox Widgets", module)
  .add("Listbox (Base)", () => <Listbox />)
  .add("Listbox (Grid)", () => <EmojiListbox />)
  .add("Scrollable Listbox", () => <ScrollableListbox />)
  .add("Collapsible Dropdown", () => <CollapsibleDropdown />)
  .add("Collapsible Dropdown (Grid)", () => <EmojiDropdown />)
  .add("Combo Box", () => <ComboBox />);

storiesOf("Custom Widgets", module)
  .addDecorator(getStory => (
    <>
      <link
        type="text/css"
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tachyons/4.11.1/tachyons.css"
      />
      {getStory()}
    </>
  ))
  .add("GitHub Reaction Popover", () => <GitHubEmojiPicker />)
  .add("Shipt Search Combo Box", () => <ShiptComboBox />)
  .add("Slack Mention Combo Box", () => <SlackComboBox />);
