import { Spin, Transfer } from '@ty/antd';
import React, { useEffect, useState } from 'react';
import type {
  OSTransferFieldAPI,
  OSTransferFieldSource,
  OSTransferFieldType,
  OSTransferFieldValueType,
} from '@ty-one-start/typings';
import utl from 'lodash';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { LoadingOutlined } from '@ant-design/icons/lib/icons';

const OSTransferField: React.ForwardRefRenderFunction<OSTransferFieldAPI, OSTransferFieldType> = (
  props,
  ref,
) => {
  const {
    text,
    onValueChange,
    settings,
    mode = 'read',
    value: _value,
    onChange: _onChange,
    requests,
  } = props;

  const { source, listStyle } = settings ?? {};
  const [loading, setLoading] = useState(false);
  const [asyncSource, setAsyncSource] = useState<OSTransferFieldSource>();

  const handleRequestSource = async () => {
    if (!requests?.requestSource) return;

    setLoading(true);
    const { error, data } = await requests.requestSource().then(normalizeRequestOutputs);
    setLoading(false);
    if (error) return;

    setAsyncSource(data);
  };

  useEffect(() => {
    handleRequestSource();
  }, []);

  if (mode === 'read') {
    const sourceMap = utl.fromPairs(source?.map((item) => [item.key, item.title]));
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>}>
        {(text ?? _value)?.map((key) => sourceMap[key])?.join(', ')}
      </span>
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange = (value: OSTransferFieldValueType) => {
      onValueChange?.(value);
      return _onChange?.(value);
    };

    return (
      <Spin spinning={loading} indicator={<LoadingOutlined />}>
        <Transfer
          ref={
            ref as React.RefObject<
              Transfer<{
                key?: string | undefined;
                title: string;
                children?: OSTransferFieldValueType | undefined;
              }>
            >
          }
          targetKeys={_value}
          dataSource={asyncSource ?? source}
          render={(item) => item.title}
          onChange={onChange}
          listStyle={listStyle}
        ></Transfer>
      </Spin>
    );
  }
  return null;
};

export default React.forwardRef(OSTransferField);
export const Settings: React.FC<OSTransferFieldType['settings']> = () => <></>;
