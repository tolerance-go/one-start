import type { OSPlaceholderInputFieldType } from '@ty-one-start/one-start';
import type { Rule } from '@ty/antd/lib/form';

/** 增加符号 */
export const increasingSymbol = (
  placeholders?: Required<OSPlaceholderInputFieldType>['settings']['placeholders'],
) => {
  if (placeholders) {
    return [
      {
        label: '+',
        value: '+',
        raw: true,
      },
      {
        label: '-',
        value: '-',
        raw: true,
      },
      ...(placeholders ?? []),
    ];
  }

  return [];
};

/** 特殊字符，中英文正则 */
const specialCharacterChineseAndEnglishRegular =
  /^{[a-zA-Z0-9\u4e00-\u9fa5`~!@#$%^&*()-_=+|[\]:;"'<>,.?]+}$/;

/** 一对一映射规则 */
export const oneOnOneMappingRule: Rule = {
  pattern: specialCharacterChineseAndEnglishRegular,
  message: '不符合模板规则 eg: {xxx}',
};

/** 一对一值转换 */
export const oneToOneValueConversion: Required<OSPlaceholderInputFieldType>['settings']['valueTransform'] =
  (value) => {
    const items = value.match(/{[a-zA-Z0-9\u4e00-\u9fa5`~!@#$%^&*()-_=+|[\]:;"'<>,.?]+}/g) ?? [
      value,
    ];
    return items[items.length - 1];
  };

/** 计算公式验证规则 */
export const calculateFormulaVerificationRules: Rule = {
  validator: async (_, value) => {
    if (
      value === '' ||
      value == null ||
      (value as string)
        .split(/\+|-/)
        .every((item) => specialCharacterChineseAndEnglishRegular.test(item))
    ) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`不符合模板规则 eg: {xxx}+{xxx}-{xxx}`));
  },
};
