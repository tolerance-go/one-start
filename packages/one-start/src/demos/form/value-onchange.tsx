/**
 * desc: requestDataSource 会触发一次 onChange
 */
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  const [values, setValues] = useState<RecordType | undefined>({
    digit: 888,
  });
  return (
    <OSProviderWrapper>
      <div>{JSON.stringify(values)}</div>
      <OSForm
        ref={formRef}
        value={values}
        onChange={setValues}
        settings={{
          initialValues: {
            digit: 10000,
          },
          fieldItems: [
            {
              type: 'date',
              settings: {
                dataIndex: 'date',
                title: 'date',
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'digit',
                title: 'digit',
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            await delay(1500);
            return {
              error: false,
              data: {
                date: '1994-2-13',
                digit: 20000,
              },
            };
          },
        }}
      ></OSForm>
      <div>
        <OSTrigger
          type="button"
          settings={{
            text: '重置表单',
          }}
          onClick={() => {
            formRef.current?.resetFields();
          }}
        ></OSTrigger>
      </div>
    </OSProviderWrapper>
  );
};
