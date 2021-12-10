/**
 * desc: 级联会改变 taget 内容，可以安全使用
 */
import type { OSTableChangedValueType, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType | undefined>();

  const [linkageChangedValues, setLinkageChangedValues] = useState<RecordType>();
  const [linkageValues, setLinkageValues] = useState<RecordType>();
  const [linkageChangedValues2, setLinkageChangedValues2] = useState<RecordType>();
  const [linkageValues2, setLinkageValues2] = useState<RecordType>();
  const [onValuesChangeValues, setOnValuesChangeValues] = useState<RecordType>();
  const [onValuesChangeChangedValues, setOnValuesChangeChangedValues] = useState<RecordType>();

  return (
    <OSProviderWrapper>
      <Space>
        <Space>
          <div>
            <div>linkage changedValues:</div>
            <pre>{JSON.stringify(linkageChangedValues, null, 2)}</pre>
          </div>
          <div>
            <div>linkage values:</div>
            <pre>{JSON.stringify(linkageValues, null, 2)}</pre>
          </div>
        </Space>
        <Space>
          <div>
            <div>第二级 linkage changedValues:</div>
            <pre>{JSON.stringify(linkageChangedValues2, null, 2)}</pre>
          </div>
          <div>
            <div>第二级 linkage values:</div>
            <pre>{JSON.stringify(linkageValues2, null, 2)}</pre>
          </div>
        </Space>
      </Space>
      <Space>
        <div>
          <div>onValuesChange changedValues:</div>
          <pre>{JSON.stringify(onValuesChangeChangedValues, null, 2)}</pre>
        </div>
        <div>
          <div>onValuesChange values:</div>
          <pre>{JSON.stringify(onValuesChangeValues, null, 2)}</pre>
        </div>
      </Space>

      <div>onChange values:</div>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <OSForm
        value={value}
        onChange={setValue}
        onValuesChange={(changedValues, values) => {
          setOnValuesChangeChangedValues(changedValues);
          setOnValuesChangeValues(values);
        }}
        settings={{
          valueLinkage: [
            (changedValues, values) => {
              console.log(changedValues, values);

              setLinkageChangedValues(changedValues);
              setLinkageValues(values);

              if ('editable-table' in changedValues) {
                const changedValueMeta: OSTableChangedValueType = changedValues['editable-table'];

                if (changedValueMeta.changedMeta.type === 'modify')
                  return {
                    'editable-table': {
                      ...changedValueMeta,
                      target: [
                        {
                          text: 100,
                        },
                      ],
                    },
                  };
              }
              return {};
            },
            (changedValues, values) => {
              console.log(changedValues, values);

              setLinkageChangedValues2(changedValues);
              setLinkageValues2(values);

              if ('editable-table' in changedValues) {
                const changedValueMeta: OSTableChangedValueType = changedValues['editable-table'];

                if (changedValueMeta.changedMeta.type === 'modify')
                  return {
                    'editable-table': [
                      {
                        text: 500,
                      },
                    ],
                  };
              }
              return {};
            },
          ],
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
              },
            },
            {
              type: 'editable-table',
              settings: {
                dataIndex: 'editable-table',
                title: 'editable-table',
                changedValueHasMeta: true,
                fieldItems: [
                  {
                    type: 'text',
                    settings: {
                      dataIndex: 'text',
                      title: 'text',
                      editable: true,
                      autoFocus: true,
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: 'date',
                      dataIndex: 'date',
                      editable: true,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
                      editable: true,
                    },
                  },
                ],
                addable: {},
                removeable: {},
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};
