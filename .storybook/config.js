import { addParameters, configure } from "@storybook/react";

const options = {
  showPanel: false,
  enableShortcuts: false
};

addParameters({ options });

function loadStories() {
  require("../stories");
}

configure(loadStories, module);
