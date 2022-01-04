/* eslint-disable import/no-extraneous-dependencies */
import type { OSSearchGridAPI, RecordType } from '@ty-one-start/one-start';
import { OSPage, OSProviderWrapper, OSSearchGrid } from '@ty-one-start/one-start';
import React, { useRef } from 'react';
import { treeData } from './tree-data-2';

const options = {
  dataIndex: 'aggregateTypes',
  typeKey: 'aggregateTypeZH',
  valueKey: 'aggregateKey',
};

export default () => {
  const tableRef = useRef<OSSearchGridAPI>(null);
  return (
    <OSProviderWrapper>
      <OSPage
        settings={{
          content: (
            <OSSearchGrid
              ref={tableRef}
              settings={{
                treeDatable: {
                  typeKey: options.typeKey,
                  valueKey: options.valueKey,
                },
                searchFormItemChunkSize: 3,
                highlightVerticalRow: false,
                searchFormSettings: {
                  labelCol: {
                    span: 6,
                  },
                  wrapperCol: {
                    span: 18,
                  },
                },
                fieldItems: treeData.fieldItems as RecordType[],
              }}
              requests={{
                requestDataSource: async () => {
                  return {
                    error: false,
                    data: {
                      page: treeData?.page,
                      total: treeData?.totalCount,
                    },
                  };
                },
              }}
            />
          ),
        }}
      />
    </OSProviderWrapper>
  );
};
