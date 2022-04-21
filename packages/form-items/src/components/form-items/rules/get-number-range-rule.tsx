import type { Rule } from '@ty/antd/lib/form';
import { BigNumber as BN } from 'bignumber.js';
import type { NumberDigitsRuleDefaults } from '../@ty-one-start/typings';
import { DEFAULT_DECIMAL_DATA } from '../../constants/digit';

export const numberDigitsRuleDefaults: Pick<
  Required<NumberDigitsRuleDefaults>,
  'minType' | 'maxType'
> = {
  minType: 'isGreaterThanOrEqualTo',
  maxType: 'isLessThanOrEqualTo',
};

export const getNumberRangeRule = (options: NumberDigitsRuleDefaults): Rule => {
  const {
    min,
    max,
    minType = numberDigitsRuleDefaults.minType,
    maxType = numberDigitsRuleDefaults.maxType,
    minDataIndex,
    maxDataIndex,
    minDataLabel,
    maxDataLabel,
    percent,
    decimalData = DEFAULT_DECIMAL_DATA,
  } = options;
  const isPercent = percent && decimalData;

  return (form) => ({
    validator(_, value?: number | string) {
      if (value == null) {
        return Promise.resolve();
      }

      const throwMinError = (minVal: number | string) => {
        if (!new BN(value)[minType](minVal)) {
          const minValStr = isPercent ? `${new BN(minVal).multipliedBy(100).toNumber()}%` : minVal;

          return Promise.reject(
            new Error(
              `数值最小${minType === 'isGreaterThanOrEqualTo' ? '(包括)' : '(不包括)'}为 ${
                minDataLabel ? `${minDataLabel}${minValStr}` : `${minValStr}`
              }，当前输入为 ${
                isPercent ? `${new BN(value).multipliedBy(100).toNumber()}%` : value
              }`,
            ),
          );
        }
        return null;
      };

      if (min != null) {
        const error = throwMinError(min);
        if (error) {
          return error;
        }
      }

      if (minDataIndex && form.getFieldValue(minDataIndex) != null) {
        const error = throwMinError(form.getFieldValue(minDataIndex));
        if (error) {
          return error;
        }
      }

      const throwMaxError = (maxVal: number | string) => {
        if (!new BN(value)[maxType](maxVal)) {
          const maxValStr = isPercent ? `${new BN(maxVal).multipliedBy(100).toNumber()}%` : maxVal;
          return Promise.reject(
            new Error(
              `数值最大${maxType === 'isLessThanOrEqualTo' ? '(包括)' : '(不包括)'}为 ${
                maxDataLabel ? `${maxDataLabel}${maxValStr}` : `${maxValStr}`
              }，当前输入为 ${
                isPercent ? `${new BN(value).multipliedBy(100).toNumber()}%` : value
              }`,
            ),
          );
        }
        return null;
      };

      if (max != null) {
        const error = throwMaxError(max);
        if (error) {
          return error;
        }
      }

      if (maxDataIndex && form.getFieldValue(maxDataIndex) != null) {
        const error = throwMaxError(form.getFieldValue(maxDataIndex));
        if (error) {
          return error;
        }
      }

      return Promise.resolve();
    },
  });
};
