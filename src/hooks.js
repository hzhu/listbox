import { useRef } from "react";

// Only works with domElements. Could this be further generalized?
// This hook returns a function that accepts a typed character code
// and domElements with text content. It will return the node that
// matches the typed character(s) within the delay. The function uses
// refs to hold values between renders.
export const useFindTypedItem = (delay = 500) => {
  const cacheTypedChars = useRef("");
  const timeoutId = useRef(null);
  return (charCode, domElements) => {
    cacheTypedChars.current += String.fromCharCode(charCode).toLowerCase();
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => (cacheTypedChars.current = ""), delay);
    if (cacheTypedChars.current) {
      const foundItem = domElements.filter(node =>
        node.textContent.toLowerCase().startsWith(cacheTypedChars.current)
      )[0];
      return foundItem;
    }
  };
};
