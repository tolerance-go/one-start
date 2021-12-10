export const setCustomize = (customize: Record<string, any> = {}) => {
  return Object.keys(customize).reduce(
    (total, pro) => ({
      ...total,
      [`${pro}Customer`]: customize?.[pro],
    }),
    {},
  );
};
