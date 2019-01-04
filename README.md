# Overview

An ARIA compliant [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) component that composes into other Listbox based UI Widgets such as [Scrollable Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-scrollable.html), [Collapsible Dropdown](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html), [Combobox](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html), etc.

## Problem

Open source libraries like [Downshift](https://github.com/downshift-js/downshift) tend to have a large API surface area and covers a lot of use cases that a product team might not need.

Bringing in a large library may result in:

1. Added complexity due to a large surface API which was created to accommodate many use cases.
2. May not cover _all_ of your team's needs. Your team may need to contribute or fork the library to accommodate your needs.

## Solution

A product team can hand roll a ARIA compliant Listbox component and use it to compose other Listbox based widgets in a reasonable amount of time. This gives the team more control over the API and complexity.
