import type { OSCustomFieldElementProps } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import React from 'react';

const Custom: React.FC<OSCustomFieldElementProps> = (props) => {
  console.log(props);
  return <div>{props.value ?? 'hi'}</div>;
};

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'custom',
              settings: {
                dataIndex: 'custom',
                title: 'custom',
                element: <Custom />,
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            await delay(1000);
            return {
              error: false,
              data: {
                custom: 'hello',
              },
            };
          },
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};
