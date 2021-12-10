import { Rule } from '@ty/antd/lib/form';

const getGreaterRule = (number: number, label: string): Rule => {
  return {
    validator(rule, val: number) {
      if (val < number) {
        return Promise.reject(new Error(`${label}不能小于${number}`));
      }
      return Promise.resolve();
    },
  };
};

export { getGreaterRule };
