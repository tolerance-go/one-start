import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'a',
                dataIndex: 'a',
              },
            },
            {
              type: 'money',
              dependencies: ['a'],
              settings: ({ form }) => {
                if (form.getFieldValue('a') > 100) {
                  return {
                    title: 'b-gogo',
                    dataIndex: 'b-gogo',
                  };
                }

                return {
                  title: 'b',
                  dataIndex: 'b',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                };
              },
            },
            {
              type: 'money',
              dependencies: ['b-gogo'],
              settings: ({ form }) => {
                if (form.getFieldValue('b-gogo') > 100) {
                  return {
                    title: 'c-gogo',
                    dataIndex: 'c',
                    hide: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  };
                }
                if (form.getFieldValue('b-gogo') > 10) {
                  return {
                    title: 'c-gogo',
                    dataIndex: 'c',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  };
                }
                return {
                  title: 'c',
                  dataIndex: 'c',
                };
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};
