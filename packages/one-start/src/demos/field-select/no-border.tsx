import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <div>
        <OSSelectField
          // value="a"
          mode="edit"
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
          value={'a'}
        ></OSSelectField>
        <div
          style={{
            border: '1px solid blue',
          }}
        >
          <OSSelectField
            // value="a"
            mode="edit"
            settings={{
              valueEnums: {
                a: 'A',
                b: 'B',
                c: 'C',
              },
              bordered: false,
            }}
            value={'a'}
          ></OSSelectField>
        </div>
        <div
          style={{
            border: '1px solid blue',
          }}
        >
          <OSSelectField
            // value="a"
            mode="read"
            settings={{
              valueEnums: {
                a: 'A',
                b: 'B',
                c: 'C',
              },
            }}
            text="a"
          ></OSSelectField>
        </div>
        <div
          style={{
            border: '1px solid blue',
          }}
        >
          <OSSelectField
            // value="a"
            mode="edit"
            settings={{
              bordered: false,
              showSearch: true,
              valueEnums: {
                a: 'A',
                b: 'B',
                c: 'C',
              },
            }}
            text="a"
          ></OSSelectField>
        </div>
        <div
          style={{
            border: '1px solid blue',
          }}
        >
          <OSSelectField
            // value="a"
            mode="edit"
            settings={{
              bordered: false,
              mode: 'multiple',
              valueEnums: {
                a: 'A',
                b: 'B',
                c: 'C',
              },
            }}
            text="a"
          ></OSSelectField>
        </div>
      </div>
    </OSProviderWrapper>
  );
};
