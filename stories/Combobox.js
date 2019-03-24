import React, { Component, createRef } from "react";
import { Listbox, Option, OptionsList } from "../src";
import { FRUITS_AND_VEGGIES } from "./constants";

class Combobox extends Component {
  state = {
    query: "",
    value: undefined,
    activeIndex: -1,
    activeOptionId: "",
    showListbox: false,
    suggestions: []
  };
  portalRef = createRef();
  comboboxRef = createRef();
  listboxRef = createRef();
  componentDidMount() {
    document.body.addEventListener("click", e => {
      const { current: listbox } = this.listboxRef;
      const listboxClicked = listbox && listbox.contains(e.target);
      const { current: combobox } = this.comboboxRef;
      const comboboxClicked = combobox && combobox.contains(e.target);

      if (comboboxClicked || listboxClicked) return;

      this.setState({ showListbox: false, activeOptionId: undefined });
    });
  }
  updateValue = value => {
    this.setState({ value });
  };
  render() {
    return (
      <div>
        <label htmlFor="ex1-input" id="ex1-label">
          Choice 1 Fruit or Vegetable
        </label>
        <div>
          <div
            role="combobox"
            id="ex1-combobox"
            ref={this.comboboxRef}
            aria-owns="ex1-listbox"
            aria-haspopup="listbox"
            aria-expanded={this.state.suggestions.length > 0}
          >
            <input
              type="text"
              id="ex1-input"
              autoComplete="off"
              value={this.state.query}
              aria-autocomplete="list"
              aria-controls="ex1-listbox"
              onFocus={e => this.setState({ showListbox: true })}
              aria-activedescendant={this.state.activeOptionId || undefined}
              onChange={e => {
                const query = e.target.value.toLowerCase();
                const suggestions = FRUITS_AND_VEGGIES.filter(item => {
                  return item.toLowerCase().indexOf(query) === 0;
                });

                this.setState({ query, suggestions, showListbox: true });
              }}
              onKeyDown={e => {
                if (
                  this.state.query === "" ||
                  this.state.suggestions.length === 0
                )
                  return;
                if (e.key === "Enter") {
                  const updater = state => {
                    return {
                      query: state.suggestions[state.activeIndex],
                      value: state.suggestions[state.activeIndex],
                      showListbox: false
                    };
                  };
                  this.setState(updater);
                }
                let updater;
                let activeOptionId;
                const { current: listboxNode } = this.listboxRef;
                if (e.key === "ArrowDown") {
                  e.preventDefault();

                  updater = state => {
                    const { activeIndex, suggestions } = state;
                    let nextActiveIndex;

                    if (activeIndex === suggestions.length - 1) {
                      nextActiveIndex = 0;
                    } else {
                      nextActiveIndex = activeIndex + 1;
                    }

                    if (listboxNode !== null) {
                      // Ouch
                      activeOptionId =
                        listboxNode.children[0].children[0].children[
                          nextActiveIndex
                        ].id;
                    }

                    return { activeIndex: nextActiveIndex, activeOptionId };
                  };
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  updater = state => {
                    let nextActiveIndex;

                    if (state.activeIndex < 1) {
                      nextActiveIndex = state.suggestions.length - 1;
                    } else {
                      nextActiveIndex = state.activeIndex - 1;
                    }

                    if (listboxNode !== null) {
                      activeOptionId =
                        listboxNode.children[0].children[0].children[
                          nextActiveIndex
                        ].id;
                    }

                    return { activeIndex: nextActiveIndex, activeOptionId };
                  };
                }
                this.setState(updater);
              }}
            />
          </div>
          {this.state.showListbox && this.state.query ? (
            <div ref={this.listboxRef}>
              <Listbox
                activeIndex={this.state.activeIndex}
                activeOptionId={this.state.activeOptionId}
                updateValue={({ selectedItem }) => {
                  this.setState({
                    value: selectedItem,
                    query: selectedItem,
                    showListbox: false
                  });
                }}
                onMouseEnter={(event, index) =>
                  this.setState({ highlightedIndex: index })
                }
              >
                <OptionsList>
                  {this.state.suggestions.map(item => {
                    return <Option key={item}>{item}</Option>;
                  })}
                </OptionsList>
              </Listbox>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Combobox;
