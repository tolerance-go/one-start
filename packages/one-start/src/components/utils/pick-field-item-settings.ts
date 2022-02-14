import type {
  OSFormFieldItemWithStaticPureConfigs,
  OSTableFormFieldItemWithStaticPureConfigs,
  RecordType,
} from '../../typings';
import utl from 'lodash';
import { formItemSettingsFields } from '../form-items/form-item-settings-fields';

/**
 * to fix 此节点的推断类型超出编译器将序列化的最大长度。需要显式类型注释。ts(7056)
 * 所以写出 recordType 和函数返回类型的形式
 */
export const pickFieldSettings = (
  settings: RecordType,
): Required<OSFormFieldItemWithStaticPureConfigs>['settings'] => {
  return utl.omit(settings, formItemSettingsFields);
};

export const pickFormItemSettings = (
  settings: RecordType,
): Required<OSFormFieldItemWithStaticPureConfigs>['settings'] => {
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
