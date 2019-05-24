import React, { useState } from "react";
import { getEmojiList } from "../utils";
import { GITHUB_EMOJIS } from "../constants";
import "./index.css";
import {
  Listbox,
  OptionsList,
  Option,
  DropdownButton,
  CollapsibleDropdown
} from "../../src/index.js";

const visuallyHiddenCSS = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  width: "1px",
  margin: "-1px",
  padding: 0,
  overflow: "hidden",
  position: "absolute"
};

const EmojiDropdownButton = ({ value }) => (
  <>
    <span id="exp_elem" style={visuallyHiddenCSS}>
      Pick your emoji reaction
    </span>
    <DropdownButton
      ariaLabelledBy="exp_elem"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0
      }}
    >
      <svg
        className="o-50"
        style={{ marginRight: "2px" }}
        viewBox="0 0 7 16"
        version="1.1"
        width="7"
        height="16"
        aria-hidden="true"
      >
        <path fillRule="evenodd" d="M4 4H3v3H0v1h3v3h1V8h3V7H4V4z" />
      </svg>
      <svg
        className="o-50"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 0 1-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 0 1-1.45-2.17A6.59 6.59 0 0 1 1.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 0 1 8 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z"
        />
      </svg>
      <span style={visuallyHiddenCSS}>{value}</span>
    </DropdownButton>
  </>
);

const Caret = () => (
  <>
    <div
      style={{
        background: "#FFF",
        position: "absolute"
      }}
    />
    <div
      style={{
        bottom: "100%",
        left: "84%",
        border: "solid transparent",
        content: "",
        height: "0",
        width: "0",
        position: "absolute",
        borderColor: "hsla(233, 66%, 48%, 0)",
        borderBottomColor: "rgba(27, 31, 35, 0.15)",
        borderWidth: "7px",
        marginLeft: "-7px"
      }}
    />
    <div
      style={{
        bottom: "100%",
        left: "84%",
        border: "solid transparent",
        content: "",
        height: "0",
        width: "0",
        position: "absolute",
        borderColor: "hsla(0, 0%, 100%, 0)",
        borderBottomColor: "#FFF",
        borderWidth: "6px",
        marginLeft: "-6px"
      }}
    />
  </>
);

const GitHubEmojiPicker = () => {
  const [textContent, settextContent] = useState("");
  const [highlightIndex, setHighlightIndex] = useState();
  return (
    <div style={{ width: "145px", margin: "24px auto" }}>
      <CollapsibleDropdown>
        {expanded => (
          <>
            <div
              style={{
                display: "flex",
                padding: "5px 13px",
                justifyContent: "flex-end"
              }}
            >
              <EmojiDropdownButton value={textContent} />
            </div>
            {expanded ? (
              <div
                style={{
                  position: "absolute",
                  width: "145px",
                  border: "1px solid rgba(27,31,35,.15)",
                  borderRadius: "4px",
                  boxShadow: "0 3px 12px rgba(27,31,35,.15)"
                }}
              >
                <Caret />
                <div style={{ color: "#586069", padding: "10px 8px" }}>
                  {highlightIndex !== undefined
                    ? GITHUB_EMOJIS[highlightIndex].name
                    : "Pick your reaction"}
                </div>
                <div
                  style={{
                    marginBottom: "10px",
                    borderBottom: "1px solid rgb(225, 228, 232)"
                  }}
                />
                <Listbox
                  grid
                  focused
                  updateValue={({ textContent, activeIndex }) => {
                    settextContent(textContent);
                    setHighlightIndex(activeIndex);
                  }}
                  activeStyles={{
                    transform: "scale(1.2)",
                    outline: "rgba(0, 103, 244, 0.247) auto 5px"
                  }}
                  style={{
                    outline: "none",
                    fontSize: "20px"
                  }}
                >
                  {getEmojiList(GITHUB_EMOJIS).map((row, m) => (
                    <OptionsList
                      key={m}
                      style={{
                        display: "flex",
                        padding: "0 10px 8px 10px",
                        justifyContent: "space-between"
                      }}
                    >
                      {row.map((emoji, n) => (
                        <Option
                          key={n}
                          className="grow-large"
                          style={{
                            cursor: "pointer"
                          }}
                          onMouseEnter={index => setHighlightIndex(index)}
                        >
                          <span
                            role="img"
                            aria-label={`React with ${emoji.label} emoji`}
                          >
                            {emoji.emoji}
                          </span>
                        </Option>
                      ))}
                    </OptionsList>
                  ))}
                </Listbox>
              </div>
            ) : null}
          </>
        )}
      </CollapsibleDropdown>
    </div>
  );
};

export default () => (
  <div
    style={{
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
      Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`,
      fontSize: "14px"
    }}
  >
    <GitHubEmojiPicker />
  </div>
);
