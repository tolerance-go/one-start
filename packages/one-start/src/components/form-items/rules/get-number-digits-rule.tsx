import type { RuleObject } from '@ty/antd/lib/form';

export const getNumberDigitsRule = (options: {
  integersMaxLen?: number;
  floatsMaxLen?: number;
}): RuleObject => {
  const { integersMaxLen, floatsMaxLen } = options;

  return {
    validator(_, value?: number | string) {
      const withStr = (callback: (item: string | number) => string, item?: string | number) => {
        return item ? callback(item) : '';
      };

      const checkIntegersLen = (num: string) => {
        if (integersMaxLen == null) return { error: false };
        // eslint-disable-next-line no-bitwise
        const [integers] = num.split('.');
        /** 判断负号 */
        const positiveIntegers = integers[0] === '-' ? integers.slice(1) : integers;
        return {
          error: positiveIntegers.length > integersMaxLen,
          current: positiveIntegers.length,
        };
      };

      const checkFloatsLen = (num: string) => {
        if (floatsMaxLen == null) return { error: false };
        const [, floats] = num.split('.');
        if (floats == null) return { error: false };
        return {
          error: floats.length > floatsMaxLen,
          current: floats.length,
        };
      };

      if (value == null) {
        return Promise.resolve();
      }

      const floatResult = checkFloatsLen(value.toString());

      if (floatResult.error) {
        return Promise.reject(
          new Error(
            `绝对数值小数位最长为 ${floatsMaxLen} 位${withStr(
              (item) => `，当前输入为 ${item} 位`,
              floatResult.current,
            )}`,
          ),
        );
      }
      const integersResult = checkIntegersLen(value.toString());

      if (integersResult.error) {
        return Promise.reject(
          new Error(
            `绝对数值整数位最长为 ${integersMaxLen} 位${withStr(
              (item) => `，当前输入为 ${item} 位`,
              integersResult.current,
            )}`,
          ),
        );
      }

      return Promise.resolve();
    },
  };
};
