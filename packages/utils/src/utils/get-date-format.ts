import moment, { isMoment } from 'moment';
import { formatType } from '../constants/swap';

/**
 * 时间戳默认为美国时区，会出现时间误差，
 * 所以判断对象里面所有的时间属性： key.indexOf('Date') > -1
 * 并将时间戳转为 YYYY-MM-DD 格式 */
const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null;
};
const deepFormatDate = (source: any) => {
  if (!isObject(source)) {
    return source;
  }
  const target = Array.isArray(source) ? [] : {};
  const sourceKeys = Object.keys(source);
  sourceKeys.forEach((key: string) => {
    if (source.hasOwnProperty(key)) {
      /** 自定义字段可能为 moment 类型 */
      if (source[key] && (isMoment(source[key]) || key.indexOf('Date') > -1)) {
        target[key] = moment(source[key]).format(formatType);
        return;
      }
      if (typeof source[key] === 'object') {
        target[key] = deepFormatDate(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  });
  return target;
};

export { deepFormatDate };
