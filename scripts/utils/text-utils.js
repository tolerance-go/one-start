export const setTextKey = (text, key, value) => {
  return text.replace(new RegExp(`${key}: (.*?),?(\r\n|\n)`), (searchValue, replaceValue) => {
    return searchValue.replace(replaceValue, value);
  });
};

export const getTextKey = (text, key) => {
  const matches = text.match(new RegExp(`${key}: (.*?),?(\r\n|\n)`));
  if (matches) {
    return matches[1];
  }
};
