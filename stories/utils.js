import React from "react";
import PropTypes from "prop-types";

export const getEmojiList = list =>
  list.reduce((emojiList, currEmojiKey) => {
    if (emojiList.length === 0) {
      emojiList.push([currEmojiKey]);
      return emojiList;
    }
    const lastRow = emojiList[emojiList.length - 1];
    if (lastRow.length !== 4) {
      lastRow.push(currEmojiKey);
    } else {
      emojiList.push([currEmojiKey]);
    }
    return emojiList;
  }, []);

export const VisuallyHidden = props => (
  <span
    style={{
      top: 0,
      left: 0,
      border: 0,
      zIndex: -1,
      opacity: 0,
      padding: 0,
      width: "1px",
      height: "1px",
      overflow: "hidden",
      position: "absolute"
    }}
    {...props}
  />
);

export const emphasize = (query, string) => {
  const startIdx = string.toLowerCase().indexOf(query.toLowerCase());
  if (startIdx === -1) {
    return { startText: string };
  }
  const startText = string.slice(0, startIdx);
  const emphasized = string.slice(startIdx, startIdx + query.length);
  const endText = string.slice(startIdx + query.length);
  return { startText, emphasized, endText };
};

export const emphasizeEnd = (query, originalText) => {
  let startText = "";
  let endText = "";
  if (originalText.toLowerCase().startsWith(query.toLowerCase())) {
    for (let i = 0; i < originalText.length; i++) {
      const char = originalText[i];
      if (i < query.length) {
        startText += char;
      } else {
        endText += char;
      }
    }
  }
  return { startText, endText, originalText };
};

export const TextEmphasis = ({ query, children, end, ...restProps }) => {
  if (end) {
    const { startText, endText, originalText } = emphasizeEnd(query, children);
    if (startText === "" || endText === "") {
      return <span>{originalText}</span>;
    }
    return (
      <span aria-label={children}>
        {startText}
        <span data-testid="emphasized-text" {...restProps}>
          {endText}
        </span>
      </span>
    );
  }
  const { startText, emphasized, endText } = emphasize(query, children);
  return (
    <>
      {startText}
      <span data-testid="emphasized-text" {...restProps}>
        {emphasized}
      </span>
      {endText}
    </>
  );
};

TextEmphasis.propTypes = {
  end: PropTypes.bool,
  query: PropTypes.string,
  children: PropTypes.node.isRequired
};

TextEmphasis.defaultProps = {
  end: false,
  query: ""
};
