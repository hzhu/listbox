import { useRef } from "react";

// Only works with domNodes. Could this be further generalized?
// This hook returns a function that accepts a typed character code
// and domNodes with text content. It will return the node that
// matches the typed character(s) within the delay. The function uses
// refs to hold values between renders.
export const useFindTypedItem = (delay = 500) => {
  const cacheTypedChars = useRef("");
  const timeoutId = useRef(null);
  return (charCode, domNodes) => {
    cacheTypedChars.current += String.fromCharCode(charCode).toLowerCase();
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => (cacheTypedChars.current = ""), delay);
    if (cacheTypedChars.current) {
      return domNodes.findIndex(node =>
        node.textContent.toLowerCase().startsWith(cacheTypedChars.current)
      )
    }
  };
};
