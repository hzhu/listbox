export const focusElement = (item, listboxNode) => {
  const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
  const itemBottom = item.offsetTop + item.offsetHeight;
  if (itemBottom > scrollBottom) {
    listboxNode.scrollTop = itemBottom - listboxNode.clientHeight;
  } else if (item.offsetTop < listboxNode.scrollTop) {
    listboxNode.scrollTop = item.offsetTop;
  }
};

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
