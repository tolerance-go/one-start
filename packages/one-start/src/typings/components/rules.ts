import type { Moment, unitOfTime } from 'moment';
import type { RequestIO } from './core';
import type { FormInstance } from 'rc-field-form/lib/interface';

export type NumberDigitsRuleDefaults = {
  min?: number;
  max?: number;
  /** 比较的最小的字段名，优先级小于 min */
  minDataIndex?: string;
  maxDataIndex?: string;
  minType?: 'isGreaterThan' | 'isGreaterThanOrEqualTo';
  maxType?: 'isLessThan' | 'isLessThanOrEqualTo';
  valueType?: 'digit' | 'percent';
  minDataLabel?: string;
  maxDataLabel?: string;
};

export type OSRule =
  | {
      /** 数字精度验证规则 */
      ruleType?: 'digital-accuracy';
      settings?: {
        /** 整数位最大 */
        integersMaxLen?: number;
        /** 小数位最大 */
        floatsMaxLen?: number;
      };
    }
  | {
      /** 时间早晚校验规则 */
      ruleType?: 'date-check';
      settings: {
        /** 比较日期为常量 */
        date?: Moment;
        /** 比较日期 key */
        dataIndex?: string;
        /** 比较日期 label */
        dateLabel: string;
        /**
         * 比较类型
         * isBefor 早
         * isAfter 晚
         */
        type: 'isBefore' | 'isAfter';
        /**
         * 比较精度
         */
        granularity: unitOfTime.Base;
      };
    }
  | {
      ruleType?: 'digital-scope';
      settings: NumberDigitsRuleDefaults;
    }
  | {
      /** 校验是否为交易日 */
      ruleType?: 'trading-day-check';
      requests?: {
        requestValidate?: RequestIO<
          {
            date: Moment;
            form: FormInstance;
          },
          {
            /** 返回 error 时，将用于提示信息 */
            message?: string;
          }
        >;
      };
    };
