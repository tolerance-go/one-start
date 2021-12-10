import {
  OSEditableTable,
  OSProviderWrapper,
  RecordType,
  parseTableValue,
} from '@ty-one-start/one-start';
import { Radio } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [direction, setDirection] = useState<'top' | 'bottom'>('bottom');

  const [value, setValue] = useState<RecordType[]>();

  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <div>
        <Radio.Group onChange={(e) => setDirection(e.target.value)} value={direction}>
          <Radio value={'top'}>top</Radio>
          <Radio value={'bottom'}>bottom</Radio>
        </Radio.Group>
      </div>
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
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
          addable: {
            direction,
          },
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};
