// 数字精度校验（包括整数位和小数位）
const generateNumberDigitsRule =
  (options: { integersMaxLen?: number; floatsMaxLen?: number; percent?: boolean }) => () => ({
    validator(_: any, value?: number | string) {
      const withStr = (callback: (item: string | number) => string, item?: string | number) => {
        return item ? callback(item) : '';
      };

      const { integersMaxLen, floatsMaxLen, percent } = options;
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
            `${percent ? '绝对值' : ''}输入数字小数位最长为 ${floatsMaxLen} 位${withStr(
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
            `${percent ? '绝对值' : ''}输入整数位最长为 ${integersMaxLen} 位${withStr(
              (item) => `，当前输入为 ${item} 位`,
              integersResult.current,
            )}`,
          ),
        );
      }

      return Promise.resolve();
    },
  });

export { generateNumberDigitsRule };
