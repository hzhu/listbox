import * as types from "./actionTypes.js";

export const initialState = {
  query: "",
  activeId: "",
  expanded: false,
  suggestions: [],
  activeIndex: -1,
  highlightIndex: -1
};

const comboBoxReducer = (state, action) => {
  const { activeIndex, suggestions } = state;
  let nextIdx;
  switch (action.type) {
    case types.COLLAPSE_LIST:
      return { ...state, expanded: false };
    case types.FOCUS_PREVIOUS_OPTION:
      nextIdx = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
      return {
        ...state,
        activeIndex: nextIdx,
        highlightIndex: nextIdx
      };
    case types.FOCUS_NEXT_OPTION:
      nextIdx = activeIndex === suggestions.length - 1 ? 0 : activeIndex + 1;
      return {
        ...state,
        activeIndex: nextIdx,
        highlightIndex: nextIdx
      };
    case types.UPDATE_SUGGESTIONS:
      return {
        ...state,
        expanded: true,
        activeIndex: -1,
        highlightIndex: -1,
        suggestions: action.suggestions
      };
    case types.HIGHLIGHT:
      return {
        ...state,
        activeIndex: action.highlightIndex,
        highlightIndex: action.highlightIndex
      };
    case types.UPDATE_QUERY:
      return {
        ...state,
        query: action.query
      };
    case types.CLEAR_OPTION:
      return {
        ...state,
        activeIndex: -1,
        highlightIndex: -1
      };
    case types.SELECT_LIST_ITEM:
      return {
        ...state,
        expanded: false,
        query: suggestions[activeIndex] || ""
      };
    case types.SET_ACTIVE_ID:
      return { ...state, activeId: action.activeId };
    default:
      throw new Error("This action type is not supported");
  }
};

export default comboBoxReducer;
