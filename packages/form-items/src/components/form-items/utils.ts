import type { OSRule, OSFormItemTooltip, OSFormItemSimpleTooltip } from '@ty-one-start/typings';
import type { Rule, RuleObject } from '@ty/antd/lib/form';
import { getRuleTooltip } from './rules/tooltips';

export const mergeRuleToTooltip = (rules?: (Rule | OSRule)[], tooltip?: OSFormItemTooltip) => {
  const ruleTootips = rules
    ?.filter((item): item is OSRule => {
      if (typeof item === 'function') {
        return false;
      }
      if (typeof item === 'object') {
        return !!(item as OSRule & RuleObject).ruleType;
      }
      return false;
    })
    .map((osRule) => getRuleTooltip(osRule))
    .filter((item): item is string => item != null);

  return {
    ...tooltip,
    title: tooltip?.title.concat(ruleTootips ?? []),
  };
};

export const normalizeTooltip = (
  tooltip?: OSFormItemSimpleTooltip,
): OSFormItemTooltip | undefined => {
  if (Array.isArray(tooltip) || typeof tooltip === 'string') {
    return {
      title: Array.isArray(tooltip) ? tooltip : [tooltip],
    };
  }
  return tooltip;
};
