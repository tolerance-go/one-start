import React from 'react';
import type { OSAtomFieldAPI, OSAtomFieldType } from '../../typings';
import { renderFieldBase } from '../utils/render-field-base';

const OSAtomField: React.ForwardRefRenderFunction<OSAtomFieldAPI, OSAtomFieldType> = (
  props,
  ref,
) => {
  const { mode = 'read', value, text, settings, onChange, onValueChange } = props;

  const {
    type,
    settings: innerSettings,
    requests,
    hooks,
    slots,
    ...restSettings /** OSFieldBaseSettings 第一层可能会注入默认配置 */
  } = settings ?? {};

  const dom = renderFieldBase(mode, type, { ...restSettings, ...innerSettings }, requests, {
    ref: ref ?? undefined,
    text,
    value,
    onChange,
    onValueChange,
  });

  return <>{dom}</>;
};

export default React.forwardRef(OSAtomField);
export const Settings: React.FC<OSAtomFieldType['settings']> = () => <></>;
