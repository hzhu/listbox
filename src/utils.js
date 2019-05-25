import { KEY_CODE } from "./constants";

export const getDeepestChild = node => {
  if (typeof node.props.children === "string") {
    return node.props.children;
  } else {
    return getDeepestChild(node.props.children);
  }
};

export const isDescendantListbox = node => {
  const role = node.getAttribute("role");
  if (role === "listbox" || role === "combobox") {
    return true;
  }
  if (node.parentElement === null) {
    return false;
  }
  return isDescendantListbox(node.parentElement);
};

export const focusElement = (element, container) => {
  const scrollBottom = container.clientHeight + container.scrollTop;
  const elementBottom = element.offsetTop + element.offsetHeight;
  if (elementBottom > scrollBottom) {
    container.scrollTop = elementBottom - container.clientHeight;
  } else if (element.offsetTop < container.scrollTop) {
    container.scrollTop = element.offsetTop;
  }
};

// getNextDomItem is used to find the next active DOM node when a user presses
// on keys in the context of a listbox. Pressing arrow keys (up & down on a
// vertical listbox) should navigate the user to the previous and next DOM
// nodes respectively. When a user presses an alpha-numeric key, this function
// should return the (text) node that starts with the typed character(s).
export const getNextDomItem = ({ event, activeNode, findTypedInDomNodes }) => {
  let nextItem;
  switch (event.which) {
    // When a user presses ArrowUp or ArrowDown, we want to return the next element.
    // If the user is already on the first element and they press ArrowUp or on the
    // last element and they press ArrowDown, this function returns null.
    case KEY_CODE.up:
    case KEY_CODE.down:
      event.preventDefault();
      if (event.which === KEY_CODE.up) {
        nextItem = activeNode.previousElementSibling;
      } else {
        nextItem = activeNode.nextElementSibling;
      }
      break;
    default: {
      // When the user types in an alpha-numeric character(s), an list of domNodes
      // is filtered with the typed characters to find the next item. E.g. if we
      // had three text elements: ford, toyota, tesla, and the user types "te",
      // then next item will be "tesla". So the node that contains "tesla" is returned.
      const domNodes = [...event.target.children[0].children];
      nextItem = findTypedInDomNodes(event.which, domNodes);
    }
  }

  return nextItem;
};
