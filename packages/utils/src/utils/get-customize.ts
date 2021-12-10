export const getCustomize = (values: Record<string, any>) => {
  const keys = Object.keys(values);
  return keys.reduce((total: Record<string, any>, pro) => {
    const index = pro.lastIndexOf('Customer');
    if (index === -1) {
      return total;
    }
    return {
      ...total,
      [pro.slice(0, index)]: values[pro],
    };
  }, {});
};
