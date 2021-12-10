import { Rule } from '@ty/antd/lib/form';
import moment, { Moment } from 'moment';

const getNotEarlierThanRule =
  (dateKey: string | string[], label: string, type = 'isBefore'): Rule =>
  ({ getFieldValue }) => {
    const date = getFieldValue(dateKey);
    const text = type === 'isBefore' ? '早' : '晚';
    return {
      validator: (rule, curVal: Moment | string) => {
        if (date && moment(curVal)[type](moment(date), 'd')) {
          return Promise.reject(new Error(`不可${text}于${label}`));
        }
        return Promise.resolve();
      },
    };
  };

export { getNotEarlierThanRule };
