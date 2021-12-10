import moment from 'moment';
import _ from 'lodash';
import type { FieldData } from 'rc-field-form/lib/interface';
import BigNumber from 'bignumber.js';

const formatPercen = (val: number | string | undefined) => {
  // if (!val) {
  //   return '';
  // }
  // if (val.toString().includes('%')) {
  //   return `${val.toString().split('%').join('')}%`;
  // }
  return `${val}%`;
};
const formatString = (val: string | undefined) => {
  if (val === undefined) {
    return '';
  }
  if (val.includes('%')) {
    return val.replace('%', '');
  }
  if (val.includes('￥')) {
    return val.replace(/\$\s?|(,*)/g, '');
  }
  return val;
};

const formatMoney = (val: number | string | undefined) => {
  if (!val) {
    return '';
  }
  return `￥${val}`.replace(/(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g, ',');
};

/** 跨境货币格式处理 */
const formatMomentIntl = (val: number | string | undefined, moneySymbol: string = '') => {
  if (!val && val !== 0) {
    return '-';
  }
  /** 去除小数后的 0 */
  const paseFloatVal = new BigNumber(val).toFixed();
  /** 位数进行限制后，后端传多少，前端便展示多少位 */
  return `${moneySymbol ?? ''} ${paseFloatVal.replace(/(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const formatMoment = (object: object, type: string = 'YYYY-MM-DD'): object => {
  if (object) {
    const data = _.cloneDeep(object);
    Object.entries(data).forEach(([key, value]) => {
      if (moment.isMoment(value)) {
        data[key] = value.format(type);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        data[key] = formatMoment(value);
      }
    });

    return data;
  }
  return object;
};

const getFieldsValue = (fieldData: FieldData[]) => {
  return fieldData.map((field) => ({
    [field.name[0]]: field.value,
  }));
};

/** 1233.548=>1,233.548 */
const renderMoneyNumber = (num: string | number, moneySymbol: string, n = 2) => {
  const number = new BigNumber(num);
  if (number.isNaN()) {
    return `${moneySymbol}`;
  }
  return `${moneySymbol} ${number.toFormat(n)}`;
};

export {
  formatPercen,
  formatString,
  formatMoney,
  formatMomentIntl,
  formatMoment,
  getFieldsValue,
  renderMoneyNumber,
};
