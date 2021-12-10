/**
 * desc: 表单下的编辑表格字段会自动填充 rowId（使用数据下标）
 */
import { OSForm, OSProviderWrapper, RecordType } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>();
  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <OSForm
        value={values}
        onChange={setValues}
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          initialValues: {
            settings: {
              fieldItems: [{ type: 'text', settings: { title: 'text', dataIndex: 'text' } }],
            },
          },
          fieldItems: [
            {
              type: 'editable-table',
              settings: {
                title: 'fieldItems',
                dataIndex: ['settings', 'fieldItems'],
                fieldItems: [
                  {
                    type: 'select',
                    settings: {
                      editable: true,
                      title: 'type',
                      dataIndex: 'type',
                      valueEnums: {
                        actions: 'actions',
                        digit: 'digit',
                        money: 'money',
                        percent: 'percent',
                        select: 'select',
                        textarea: 'textarea',
                        option: 'option',
                        text: 'text',
                        date: 'date',
                        'date-range': 'date-range',
                        switch: 'switch',
                      },
                    },
                  },
                  {
                    type: 'layout-modal-form',
                    settings: {
                      editable: true,
                      title: '配置',
                      dataIndex: 'settings',
                      buttonTriggerText: '按钮1',
                      modalDialogSettings: { title: '标题' },
                      formFieldItems: [
                        { type: 'text', settings: { title: 'title', dataIndex: 'title' } },
                        { type: 'text', settings: { title: 'dataIndex', dataIndex: 'dataIndex' } },
                      ],
                    },
                  },
                ],
                addable: {},
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};
