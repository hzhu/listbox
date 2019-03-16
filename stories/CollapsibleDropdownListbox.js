import React, { Component, createRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Listbox, Option } from "../index";
import { transuraniumElements } from "./constants";

class Portal extends React.Component {
  state = {
    mounted: false
  };

  componentDidMount() {
    this.node = document.createElement("div");
    document.body.appendChild(this.node);
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
  }

  render() {
    return this.state.mounted
      ? createPortal(this.props.children, this.node)
      : null;
  }
}

class CollapsibleDropdownListbox extends Component {
  state = {
    currentOption: "Neptunium",
    showDropdown: false
  };
  updateValue = value => {
    const updater = state => {
      if (state.showDropdown === false) {
        return {
          currentOption: transuraniumElements[value.activeIndex],
          showDropdown: true
        };
      } else {
        return { currentOption: transuraniumElements[value.activeIndex] };
      }
    };
    this.setState(updater);
  };
  hideListbox = () => {
    this.btnRef.current.focus();
    this.setState({ showDropdown: false });
  };
  btnRef = createRef();
  render() {
    let rect;
    if (this.btnRef.current !== null) {
      rect = this.btnRef.current.getBoundingClientRect();
    }
    return (
      <div>
        <div
          style={{
            maxWidth: "50em",
            margin: "0 auto",
            padding: "20px",
            background: "#eee",
            border: "1px solid #aaa"
          }}
        >
          <p>{this.state.currentOption}</p>
          <p>Choose an element</p>
          <button
            ref={this.btnRef}
            tabIndex={0}
            style={{
              borderRadius: "0",
              fontSize: "16px",
              textAlign: "left",
              padding: "5px 10px",
              width: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fff"
            }}
            onClick={() => {
              const updater = state => ({ showDropdown: !state.showDropdown });
              this.setState(updater);
            }}
          >
            <div>{this.state.currentOption}</div>
            {this.state.showDropdown ? (
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid #aaa",
                  content: ""
                }}
              />
            ) : (
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "8px solid #aaa",
                  content: ""
                }}
              />
            )}
          </button>
          {/* 
            what if this prop isn't passed? 
            position the listbox right under the button
          */}

          {this.state.showDropdown ? (
            <Portal>
              <div
                tabIndex={0}
                onBlur={this.hideListbox}
                onKeyDown={e => {
                  e.preventDefault();
                  if (e.key === "Escape" || e.key === "Enter") {
                    this.hideListbox();
                  }
                }}
              >
                <Listbox
                  focused
                  firstFocused
                  activeStyles={{ background: "#bde4ff" }}
                  updateValue={this.updateValue}
                  onSelect={() => {
                    const updater = state => ({ showDropdown: false });
                    console.log(this);
                    this.setState(updater);
                  }}
                  style={{
                    width: "148px",
                    maxHeight: "18em",
                    overflowY: "auto",
                    background: "#fff",
                    position: "relative",
                    borderTop: 0,
                    border: "1px solid #aaa",
                    position: "absolute",
                    left: rect.x,
                    zIndex: 9999,
                    top: rect.y + rect.height
                  }}
                >
                  {transuraniumElements.map(element => {
                    return (
                      <Option key={element}>
                        <div style={{ padding: "5px" }}>{element}</div>
                      </Option>
                    );
                  })}
                </Listbox>
              </div>
            </Portal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CollapsibleDropdownListbox;
