<h2 align="center">Listbox ♿📝📦</h2>
<p align="center">
  <strong>Build & compose WAI-ARIA compliant listbox based UI widgets.</strong>
</p>

## Usage

Install it with `yarn add listbox` or `npm install listbox` and try out this piece of JSX:

```js
import { Listbox, Option, OptionsList } from "listbox"

<Listbox>
  <OptionsList>
    <Option>Ford Motor Co.</Option>
    <Option>Mazda Motor Corp.</Option>
    <Option>Tesla Inc.</Option>
  </OptionsList>
</Listbox>
```

This is a primitive [listbox](https://www.w3.org/TR/wai-aria-practices/#Listbox) component. It abstracts away core listbox behavior and accessibility. It has no opinion on layout or styling and can be composed into other listbox based UI widgets with little code. See what kinds of widgets can composed using a primitive listbox under "Live Playground".

## Live Playground

Check out the live, editable code examples on CodeSandbox here:

**Listbox** (base): [CodeSandBox](https://codesandbox.io/s/oo12o0yry) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--listbox-base)

**Listbox** (grid): [CodeSandBox](https://codesandbox.io/s/mjloyy8r39) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--listbox-grid)

**Scrollable Listbox**: [CodeSandBox](https://codesandbox.io/s/14knzyl2vq) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--scrollable-listbox)

**Collapsible Dropdown**: [CodeSandBox](https://codesandbox.io/s/l2l7xvvp5l) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--collapsible-dropdown)

**Collapsible Dropdown** (Grid): [CodeSandBox](https://codesandbox.io/s/p5412lzn2m) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--collapsible-dropdown-grid)

**ComboBox**: [CodeSandBox](https://codesandbox.io/s/mq5z2rmxnx) | [Storybook](https://listbox.surge.sh/?path=/story/listbox-widgets--combo-box)

<img src="https://github.githubassets.com/favicon.ico" alt="GitHub Icon" width="15" height="15"> **GitHub Reaction Popup**: [CodeSandBox](https://codesandbox.io/s/kkw2w3lkz5) | [Storybook](https://listbox.surge.sh/?path=/story/custom-widgets--github-reaction-popover)

<img src="https://druven30vo903.cloudfront.net/shipt/web/assets/favicon.ico" alt="Shipt Icon" width="15" height="15"> **Shipt Search Autocomplete**: [CodeSandBox](https://codesandbox.io/s/shipt-combo-box-yqqw4) | [Storybook](https://listbox.surge.sh/iframe.html?id=custom-widgets--shipt-search-combo-box)

<img src="https://a.slack-edge.com/4a5c4/marketing/img/meta/favicon-32.png" alt="Slack Icon" width="15" height="15"> **Slack Mention Autocomplete**: [CodeSandBox](https://codesandbox.io/s/slack-mention-combo-box-2u2hu) | [Storybook](https://listbox.surge.sh/iframe.html?id=custom-widgets--slack-mention-combo-box)

## Local Development

[Storybook](https://storybook.js.org/) is used to interactively develop the UI components with hot reloading. This Storybook is [published here](http://listbox.surge.sh).

To run Storybook:

Clone this repository

```
git clone git@github.com:hzhu/listbox.git
```

Install dependencies

```
yarn install
```

Run Storybook

```
yarn run storybook
```

Navigate to http://localhost:9009 to see live code changes during local development.

## Testing

This project uses [Jest](https://github.com/facebook/jest) and [react-testing-library](https://github.com/kentcdodds/react-testing-library) 🐐 for testing.

To run the tests

```
yarn test
```

or to continuously watch

```
yarn test --watch
```
