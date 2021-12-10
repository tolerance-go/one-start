const getMock = (bl: boolean) => {
  if (process.env.NODE_ENV === 'development') {
    return bl;
  }
  return false;
};

export { getMock };
