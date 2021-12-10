/* eslint-disable consistent-return */
import { CloseOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from '@ty/antd';
import utl from 'lodash';
import React, { useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import store from 'store2';
import type { OSFormAPI, RecordType } from '../../typings';

export type FormUpdateTimestampProps = {
  unionId: string;
  formRef: React.RefObject<OSFormAPI>;
  dialogVisible: boolean;
};

export type FormUpdateTimestampAPI = {
  updateLocalData?: (values?: RecordType) => void;
  removeLocalData?: () => void;
  removeData?: () => void;
};

const FormUpdateTimestamp: React.ForwardRefRenderFunction<
  FormUpdateTimestampAPI,
  FormUpdateTimestampProps
> = ({ unionId, formRef, dialogVisible }, ref) => {
  const formSaveKey = useMemo(() => {
    return `${unionId}_save_form_values`;
  }, [unionId]);

  const formSaveTimeKey = useMemo(() => {
    return `${unionId}_save_form_values_time`;
  }, [unionId]);

  const [visible, setVisible] = useState(
    !!(store.get(formSaveKey, false) && store.get(formSaveTimeKey, false)),
  );
  const [latestSaveTime, setLatestSaveTime] = useState(store.get(formSaveTimeKey));

  const updateLocalData = utl.debounce((values?: RecordType) => {
    const saveTimeStr = new Date().toLocaleTimeString();
    setLatestSaveTime(saveTimeStr);
    setVisible(true);
    store.set(formSaveKey, values);
    store.set(formSaveTimeKey, saveTimeStr);
  }, 450);

  const removeLocalData = () => {
    setLatestSaveTime(undefined);
    store.remove(formSaveKey);
    store.remove(formSaveTimeKey);
  };

  const removeData = () => {
    removeLocalData();

    setVisible(false);
    formRef.current?.resetFields();
  };

  useImperativeHandle(ref, () => ({
    updateLocalData,
    removeLocalData,
    removeData,
  }));

  useLayoutEffect(() => {
    if (dialogVisible) {
      const localValues = store.get(formSaveKey);
      if (localValues) {
        formRef.current?.setFieldsValue(localValues);
      }
    }
  }, [dialogVisible, formRef, formSaveKey]);

  return (
    <Tag
      closable
      visible={visible}
      closeIcon={
        <Tooltip title="清空最近保存数据，将重置当前表单">
          <CloseOutlined />
        </Tooltip>
      }
      onClose={() => {
        removeData();
      }}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        最后保存: {latestSaveTime ?? '--'}
      </Typography.Text>
    </Tag>
  );
};

export default React.forwardRef(FormUpdateTimestamp);
