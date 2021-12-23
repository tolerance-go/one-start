import type {
  OSFormFieldItemWithStaticPureConfigs,
  OSTableFormFieldItemWithStaticPureConfigs,
} from '../typings';
import utl from 'lodash';
import { formItemSettingsFields } from '../form-items/form-item-settings-fields';

export const pickFieldSettings = (settings: OSFormFieldItemWithStaticPureConfigs['settings']) => {
  return utl.omit(settings, formItemSettingsFields);
};

export const pickFormItemSettings = (
  settings: OSFormFieldItemWithStaticPureConfigs['settings'],
) => {
  return utl.pick(settings, formItemSettingsFields);
};

const formItemRequestsFields = ['requestFormItemValue', 'requestInitialValue'];

export const pickFieldRequests = (requests: OSFormFieldItemWithStaticPureConfigs['requests']) => {
  return utl.omit(requests, formItemRequestsFields);
};

export const pickFormItemRequests = (
  requests: OSFormFieldItemWithStaticPureConfigs['requests'],
) => {
  return utl.pick(requests, formItemRequestsFields);
};

export const pickTableFormItemRequests = (
  requests: Required<OSTableFormFieldItemWithStaticPureConfigs>['requests'],
) => {
  return utl.pick(requests, formItemRequestsFields);
};
