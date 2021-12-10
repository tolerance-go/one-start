import { Rule } from '@ty/antd/lib/form';

const getRequiredRule = (label?: string): Rule => {
  return { required: true, message: `${label}必填` };
};

export { getRequiredRule };
