import path from 'path';

export const getSettings = () => {
  const settings = require(path.join(process.cwd(), 'settings.json'));
  return settings;
};
