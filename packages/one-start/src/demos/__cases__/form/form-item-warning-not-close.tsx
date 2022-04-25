/**
 * debug: true
 * desc: TODO antd setValue 后会重置验证状态，我们内部的 waring 需要继承该设计
 */
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useRef, useState } from 'react';

export default () => {
  const [data, setData] = useState<RecordType>();
  const [vdata, setVdata] = useState<RecordType>();
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="button"
          settings={{
            text: 'setValues',
          }}
          onClick={async () => {
            formRef.current?.setFieldsValue({
              asyncValidate: 7,
            });
          }}
        />
        <OSTrigger
          type="button"
          settings={{
            text: 'validate',
          }}
          onClick={async () => {
            const rsp = await formRef.current?.validate();
            setVdata(rsp?.data.values);
          }}
        />
        <OSTrigger
          type="button"
          settings={{
            text: 'reset',
          }}
          onClick={async () => {
            formRef.current?.resetFields();
            setData({});
            setVdata({});
          }}
        />
      </Space>
      <OSForm
        onChange={(values) => {
          setData(values);
        }}
        ref={formRef}
        settings={{
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'asyncValidate',
                dataIndex: 'asyncValidate',
                rules: [
                  {
                    validator: async (_, val) => {
                      // await delay(1000);
                      if (val > 10) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`${val} error`));
                    },
                  },
                ],
                warningRules: [
                  { required: true },
                  {
                    validator: async (_, val) => {
                      // await delay(1000);
                      if (val < 10) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`${val} error`));
                    },
                  },
                ],
              },
            },
          ],
        }}
      ></OSForm>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(vdata, null, 2)}</pre>
    </OSProviderWrapper>
  );
};
