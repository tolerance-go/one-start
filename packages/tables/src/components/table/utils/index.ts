import type { NamePath } from '@ty/antd/lib/form/interface';
import type {
  OSFormFieldItem,
  OSTableFormFieldItem,
  OSFormFieldItemSettingsFnOption,
  OSTableFormFieldItemSettingsFnOption,
  OSFormFieldItemWithStaticPureConfigs,
} from '@ty-one-start/typings';
import { normalizeDataIndex } from '@ty-one-start/utils';

export const getNamePathId = (
  namePath: NamePath | null | undefined | readonly (string | number)[],
  split: string,
) => {
  return normalizeDataIndex(namePath).join(split);
};

export const getKeyIndexId = (
  dataIndex: number | string | readonly (string | number)[] | undefined | null,
  split: string = '-',
) => {
  return getNamePathId(dataIndex, split);
};

export const getDataIndexId = (
  dataIndex: number | string | readonly (string | number)[] | undefined | null,
  split: string = '.',
) => {
  return getNamePathId(dataIndex, split);
};

export const runTableSettings = (
  settings_: OSTableFormFieldItem['settings'],
  options_: OSTableFormFieldItemSettingsFnOption,
) => {
  if (typeof settings_ === 'function') {
    return settings_(options_);
  }
  return settings_;
};

export const runFormSettings = (
  settings_: OSFormFieldItem['settings'],
  options_: OSFormFieldItemSettingsFnOption,
): OSFormFieldItemWithStaticPureConfigs['settings'] => {
  if (typeof settings_ === 'function') {
    return settings_(options_);
  }
  return settings_;
};
