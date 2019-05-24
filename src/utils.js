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
