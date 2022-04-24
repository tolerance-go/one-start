import type { OSRule } from '@ty-one-start/typings';

export const getRuleTooltip = (rule: OSRule) => {
  if (rule.ruleType === 'digital-accuracy') {
    return `绝对数值精度范围为 [${rule.settings?.integersMaxLen ?? 'Infinity'}, ${
      rule.settings?.floatsMaxLen ?? 'Infinity'
    }]`;
  }
  if (rule.ruleType === 'date-check') {
    return `日期范围为单位${(() => {
      const strategy = [
        { names: ['year', 'years', 'y'], label: '天数' },
        { names: ['month', 'months', 'M'], label: '月数' },
        { names: ['week', 'weeks', 'w'], label: '周数' },
        { names: ['day', 'days', 'd'], label: '天数' },
        { names: ['hour', 'hours', 'h'], label: '天时数' },
        { names: ['minute', 'minutes', 'm'], label: '天/时分数' },
        { names: ['second', 'seconds', 's'], label: '天/时/分秒数' },
        { names: ['millisecond', 'milliseconds', 'ms'], label: '天/时/分/秒/毫秒数' },
      ];
      return strategy.find((item) => item.names.includes(rule.settings.granularity))?.label ?? '';
    })()}${(() => {
      if (rule.settings.type === 'isAfter') {
        return '晚于';
      }
      if (rule.settings.type === 'isBefore') {
        return '早于';
      }
      return '?';
    })()}${rule.settings.dateLabel}`;
  }
  if (rule.ruleType === 'digital-scope') {
    return `绝对数值取值范围为 ${rule.settings.minType === 'isGreaterThanOrEqualTo' ? '[' : '('}${
      rule.settings.min ?? rule.settings.minDataLabel ?? 'Infinity'
    }, ${rule.settings.max ?? rule.settings.maxDataLabel ?? 'Infinity'}${
      rule.settings.maxType === 'isLessThanOrEqualTo' ? ']' : ')'
    }`;
  }
  return undefined;
};
