import dotenv from 'dotenv';

export const getEnvConfig = () => {
  const configs = dotenv.config().parsed ?? {};

  return configs;
};
