import React from 'react';
import type { OSAtomFieldAPI, OSAtomFieldType } from '@ty-one-start/typings';
import { renderFieldBase } from '@ty-one-start/utils';

const OSAtomField: React.ForwardRefRenderFunction<OSAtomFieldAPI, OSAtomFieldType> = (
  props,
  ref,
) => {
  const {
    mode = 'read',
    value /** value onchange 会被 antd form item 包裹后注入，text 在 options 当中传入 */,
    settings,
    onChange,
    onValueChange,
    options,
  } = props;
  const {
    type,
    settings: innerSettings,
    requests,
    hooks,
    slots,
    ...restSettings /** OSFieldBaseSettings 第一层可能会注入默认配置 */
  } = settings ?? {};

  const dom = renderFieldBase(mode, type, { ...restSettings, ...innerSettings }, requests, {
    ...options,
    ref: ref ?? undefined,
    value,
    onChange,
    onValueChange,
  });

  return <>{dom}</>;
};

export default React.forwardRef(OSAtomField);
export const Settings: React.FC<OSAtomFieldType['settings']> = () => <></>;
