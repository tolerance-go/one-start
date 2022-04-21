import type { Rule } from '@ty/antd/lib/form';
import type { Moment, unitOfTime } from 'moment';
import moment from 'moment';

const getDateCheckRule = (options: {
  dataIndex?: string;
  date?: Moment;
  dateLabel: string;
  type: 'isAfter' | 'isBefore';
  granularity: unitOfTime.Base;
}): Rule => {
  const { dataIndex, type, dateLabel, granularity } = options;
  const text = type === 'isBefore' ? '晚' : '早';
  return (form) => ({
    validator: (rule, curVal?: Moment | string) => {
      const date = dataIndex ? form.getFieldValue(dataIndex) : options.date;
      if (curVal && date && moment(date)[type](moment(curVal), granularity)) {
        return Promise.reject(new Error(`不可${text}于${dateLabel}`));
      }
      return Promise.resolve();
    },
  });
};

export { getDateCheckRule };
