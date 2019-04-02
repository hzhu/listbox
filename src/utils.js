export const getDeepestChild = node => {
  if (typeof node.props.children === "string") {
    return node.props.children;
  } else {
    return getDeepestChild(node.props.children);
  }
};

export const isDescendantListbox = node => {
  if (node.getAttribute("role") === "listbox") {
    return true;
  }
  if (node.parentElement === null) {
    return false;
  }
  return isDescendantListbox(node.parentElement);
};
