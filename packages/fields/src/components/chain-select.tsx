import { SwapRightOutlined } from '@ant-design/icons';
import { Badge, Space, Tag } from 'antd';
import utl from 'lodash';
import type { SelectRawValueType as RawValueType } from '@ty-one-start/typings';
import React from 'react';
import type {
  OSChainSelectBaseAPI,
  OSChainSelectFieldAPI,
  OSChainSelectFieldType,
  OSChainSelectFieldValueType,
} from '@ty-one-start/typings';
import { useClsPrefix } from '@ty-one-start/utils';
import OSSelect from './select';

const OSChainSelectField: React.ForwardRefRenderFunction<
  OSChainSelectFieldAPI,
  OSChainSelectFieldType
> = (props, ref) => {
  const { value: _value } = props;
  const { type, ...selectProps } = props;

  const clsPrefix = useClsPrefix('field-chain-select');

  return (
    <OSSelect
      {...selectProps}
      onChange={(next) => {
        props.onChange?.(next as OSChainSelectFieldValueType);
      }}
      onValueChange={(next) => {
        props.onValueChange?.(next as OSChainSelectFieldValueType);
      }}
      settings={{
        ...props.settings,
        mode: 'multiple',
      }}
      ref={ref}
      className={clsPrefix}
      tagRender={({ closable, onClose, label, value }) => {
        return (
          <>
            <Tag closable={closable} onClose={onClose}>
              <Space>
                <Badge
                  count={utl.findIndex(_value, (item) => item === value) + 1}
                  style={{ backgroundColor: '#2db7f5', display: 'inline-block' }}
                />
                {label}
              </Space>
            </Tag>
            {utl.last(_value) === value ? null : <SwapRightOutlined style={{ marginRight: 6 }} />}
          </>
        );
      }}
      renderOnRead={(value, optionsMap) => {
        const chainVal = value as OSChainSelectFieldValueType;
        return (
          <span>
            {chainVal?.map((item: RawValueType, index: number) => {
              return (
                <span>
                  <Space>
                    <Badge count={index + 1} style={{ backgroundColor: '#2db7f5' }} />
                    {optionsMap?.[item]?.label}
                  </Space>
                  {index === chainVal.length - 1 ? null : (
                    <SwapRightOutlined style={{ marginLeft: 6, marginRight: 6 }} />
                  )}
                </span>
              );
            })}
          </span>
        );
      }}
    />
  );
};

export default React.forwardRef(OSChainSelectField);

export const Settings: React.FC<OSChainSelectFieldType['settings']> = () => <></>;
export const Requests: React.FC<OSChainSelectFieldType['requests']> = () => <></>;
export const SelectBaseAPI: React.FC<OSChainSelectBaseAPI> = () => <></>;
