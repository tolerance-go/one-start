import type {
  OSFormFieldItem,
  OSFormFieldItemSettingsFnOption,
  OSFormFieldItemWithStaticPureConfigs,
  OSTableFormFieldItem,
  OSTableFormFieldItemSettingsFnOption,
} from '@ty-one-start/typings';

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
