import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from '@ty/antd';
import { message, notification, Space, Typography, Upload } from '@ty/antd';
import type { UploadFile } from '@ty/antd/es/upload/interface';
import utl from 'lodash';
import React from 'react';
import type { OSUploadFieldAPI, OSUploadFieldType } from '@ty-one-start/typings';
import OSTrigger from '../trigger';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';

const OSUploadField: React.ForwardRefRenderFunction<OSUploadFieldAPI, OSUploadFieldType> = (
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

  const {
    disabled,
    maxCount,
    immediately = false,
    accept,
    action,
    headers,
    name,
    data,
    maxSize,
    duplicationCheck,
    triggerButtonText,
    triggetButtonSettings,
    multiple,
  } = settings ?? {};
  const { requestAfterUpload } = requests ?? {};

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

  /** 批量选择 onChange 会重复触发 */
  const alertDuplicateWarn = utl.debounce((repeatedUnionFileNames: string[]) => {
    if (repeatedUnionFileNames.length > 1) {
      notification.warn({
        message: '请勿重复上传',
        description: `文件名为${repeatedUnionFileNames.join(', ')}的文件已经上传过`,
      });
    } else if (repeatedUnionFileNames.length === 1) {
      message.destroy();
      message.warning(`${repeatedUnionFileNames.join(', ')}已存在, 请勿重复上传`);
    }
  }, 200);

  const alertSizeWarn = utl.debounce((moreThanSizeParts: UploadFile[]) => {
    if (moreThanSizeParts.length > 1) {
      notification.warn({
        message: '文件大小超出限制',
        description: `文件名为${moreThanSizeParts
          .map((item) => item.name)
          .join(', ')}的文件大小超出限制(${maxSize}M)`,
      });
    } else if (moreThanSizeParts.length === 1) {
      message.warning(
        `${moreThanSizeParts.map((item) => item.name).join(', ')}的文件大小超出限制(${maxSize}M)`,
      );
    }
  }, 200);

  if (mode === 'edit' || mode === 'update') {
    const onChange: UploadProps['onChange'] = async (params) => {
      /** 重复校验 */
      const duplicate = (fileList: UploadFile[]) => {
        const fileNames = fileList.map((item) => item.name);
        const unionFileNames = utl.union(fileNames);

        if (duplicationCheck && unionFileNames.length !== fileList.length) {
          const lefts = [...unionFileNames];
          const repeated = [...fileNames];

          while (lefts.length) {
            const left = lefts.shift();
            const index = repeated.indexOf(left!);
            if (index !== -1) {
              repeated.splice(index, 1);
            }
          }

          const repeatedUnionFileNames = utl.union(repeated);

          alertDuplicateWarn(repeatedUnionFileNames);

          return utl.unionBy(fileList, (item) => item.name);
        }

        return fileList;
      };

      const sizeCheck = (fileList: UploadFile[]) => {
        if (maxSize) {
          const maxKb = maxSize * 1024 * 1204;

          const moreThanSizeParts = fileList.filter((item) => {
            return item.size != null ? item.size > maxKb : false;
          });

          alertSizeWarn(moreThanSizeParts);

          return fileList.filter((item) => {
            return item.size != null ? item.size <= maxKb : true;
          });
        }

        return fileList;
      };

      const nextValue = utl.flow(sizeCheck, duplicate)(params.fileList);

      onValueChange?.(nextValue);
      if (requestAfterUpload) {
        const { error, data: customFile } = await requestAfterUpload({
          fileList: nextValue,
          file: params.file,
        }).then(normalizeRequestOutputs);

        if (!error) {
          return _onChange?.(customFile ?? []);
        }
      }
      return _onChange?.(nextValue);
    };

    return (
      <Upload
        maxCount={maxCount}
        data={data}
        multiple={multiple}
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
        <OSTrigger
          type="button"
          settings={{
            icon: (
              <UploadOutlined
                style={{
                  marginRight: 5,
                }}
              />
            ),
            text: triggerButtonText ?? '点击上传',
            ...triggetButtonSettings,
          }}
        ></OSTrigger>
      </Upload>
    );
  }
  return null;
};

export default React.forwardRef(OSUploadField);
export const Settings: React.FC<OSUploadFieldType['settings']> = () => <></>;
