import { useRef } from "react";

// Only works with domNodes. Could this be further generalized?
// This hook returns a function that accepts a typed character code
// and domNodes with text content. It will return the node that
// matches the typed character(s) within the delay. The function uses
// refs to hold values between renders.
export const useFindTypedItem = (delay = 500) => {
  const cacheTypedChars = useRef("");
  const cacheOfLastIndex = useRef();
  const timeoutId = useRef(null);
  const inner = (charCode, domNodes) => {
    cacheTypedChars.current += String.fromCharCode(charCode).toLowerCase();
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => (cacheTypedChars.current = ""), delay);
    if (cacheTypedChars.current) {
      const index = domNodes.findIndex(node =>
        node.textContent.toLowerCase().startsWith(cacheTypedChars.current)
      )
      // console.log('---')
      // console.log(index, cacheTypedChars.current)
      // console.log('---')

      if (index === -1) {
        return cacheOfLastIndex.current
      }

      cacheOfLastIndex.current = index

      return index
    }
  };

  return inner
};
