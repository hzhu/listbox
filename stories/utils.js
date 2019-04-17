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
