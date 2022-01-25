import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from '@ty/antd';
import { Button, Space, Typography, Upload } from '@ty/antd';
import type { UploadFile } from '@ty/antd/es/upload/interface';
import React from 'react';
import type { OSUploadFieldAPI, OSUploadFieldType } from '../../typings';

const OSUploadField: React.ForwardRefRenderFunction<OSUploadFieldAPI, OSUploadFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const {
    disabled,
    maxNumber,
    immediately = false,
    accept,
    action,
    headers,
    name,
  } = settings ?? {};

  if (mode === 'read') {
    const render = () => {
      const val = text ?? _value;
      if (val != null) {
        return (
          <Space
            split=","
            size={5}
            style={{
              flexWrap: 'wrap',
            }}
          >
            {val.map((item) => (
              <Typography.Link
                style={{
                  maxWidth: 300,
                }}
                ellipsis
                key={item.name}
                href={item.url}
                download
              >
                {item.name}
              </Typography.Link>
            ))}
          </Space>
        );
      }
      return '--';
    };

    const dom = <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{render()}</span>;
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: UploadProps['onChange'] = (params) => {
      const maxFiles = (fileList: UploadFile[]) => {
        if (maxNumber) {
          return fileList?.slice(-maxNumber);
        }
        return fileList;
      };

      const nextValue = maxFiles(params.fileList);

      onChangeHook?.(nextValue);
      return _onChange?.(nextValue);
    };

    return (
      <Upload
        accept={accept}
        action={action}
        headers={headers}
        name={name}
        disabled={disabled}
        ref={ref as React.MutableRefObject<any>}
        fileList={_value}
        onChange={onChange}
        beforeUpload={() => {
          if (immediately === false) {
            return false;
          }
          return true;
        }}
      >
        <Button
          size="small"
          icon={
            <UploadOutlined
              style={{
                marginRight: 5,
              }}
            />
          }
        >
          点击上传
        </Button>
      </Upload>
    );
  }
  return null;
};

export default React.forwardRef(OSUploadField);
export const Settings: React.FC<OSUploadFieldType['settings']> = () => <></>;
