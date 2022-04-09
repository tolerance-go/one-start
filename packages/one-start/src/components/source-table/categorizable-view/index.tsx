import { DownOutlined } from '@ant-design/icons';
import type { TreeProps } from '@ty/antd';
import { Col, Row, Skeleton, Tree, Typography } from '@ty/antd';
import type { DataNode, EventDataNode } from '@ty/antd/lib/tree';
import utl from 'lodash';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';
import type { OSSourceTableAPI, OSSourceTableType } from '../../../typings';
import { useActionsRef } from '../../hooks/use-actions-ref';
import OSEmpty from '../../table/components/empty';
import { logRequestMessage } from '../../utils/log-request-message';
import { normalizeRequestOutputs } from '../../utils/normalize-request-outputs';
import { mapTreeNode } from '../../utils/tree-utils';
import BaseTable from '../base-table';

export const CategorizableView = ({
  categorizable,
  clsPrefix,
  tableProps,
  requestCategorizableData,
  renderCategorizableTable,
  tableRef,
}: {
  clsPrefix: string;
  categorizable?: Required<OSSourceTableType>['settings']['categorizable'];
  tableProps?: OSSourceTableType;
  requestCategorizableData?: Required<OSSourceTableType>['requests']['requestCategorizableData'];
  renderCategorizableTable?: Required<OSSourceTableType>['slots']['renderCategorizableTable'];
  tableRef: React.MutableRefObject<OSSourceTableAPI | null>;
}) => {
  const tableSpan = categorizable?.tableSpan ?? 20;

  const [requestCategorizableDataLoading, setRequestCategorizableDataLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [customTableDom, setCustomTableDom] = useState<React.ReactNode>();
  /** 需要保证可以 JSON.strinify */
  const [activeNode, setActiveNode] = useState<EventDataNode>();

  const insertCategorizableTreeChildAfterIndex = (
    parentKey: Key,
    index: number,
    data: DataNode,
  ) => {
    setTreeData(
      mapTreeNode(treeData, (item) => {
        if (item.children && item.key === parentKey) {
          const nextChilds = [...item.children];

          nextChilds.splice(index + 1, 0, data);
          return {
            ...item,
            children: nextChilds,
          };
        }
        return item;
      }),
    );
  };

  const deleteCategorizableTreeChild = (parentKey: Key, predicate: (node: DataNode) => boolean) => {
    setTreeData(
      mapTreeNode(treeData, (item) => {
        if (item.children && item.key === parentKey) {
          const nextChilds = item.children.filter((node) => !predicate(node));
          return {
            ...item,
            children: nextChilds,
          };
        }
        return item;
      }),
    );
  };

  const insertCategorizableTreeChildLatest = (parentKey: Key, data: DataNode) => {
    const next = mapTreeNode(treeData, (item) => {
      if (item.children && item.key === parentKey) {
        const nextChilds = [...item.children, data];
        return {
          ...item,
          children: nextChilds,
        };
      }
      return item;
    });
    setTreeData(next);
  };

  const apisRef = useActionsRef(
    {
      insertCategorizableTreeChildAfterIndex,
      insertCategorizableTreeChildLatest,
      deleteCategorizableTreeChild,
    },
    tableRef,
  );

  const handleTreeSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setActiveNode(info.node);

    if (renderCategorizableTable) {
      const custom = renderCategorizableTable({
        node: info.node,
        /** 注意：当 Table 卸载掉时候，ref.current 会设置为 null */
        apisRef,
      });
      if (custom) {
        setCustomTableDom(custom);
      } else {
        setCustomTableDom(undefined);
      }
    }
  };

  const handleRequestCategorizableData = async () => {
    if (!requestCategorizableData) return;

    setRequestCategorizableDataLoading(true);
    const { error, data } = await requestCategorizableData()
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());
    setRequestCategorizableDataLoading(false);

    if (error) return;

    if (data?.data) {
      setTreeData(data?.data);

      /**
       * 异步的默认展开全部，这里设计为数据的从无到有，则为默认展开的契机
       * 就像组件同步的默认展开全部一样，是从组件的从无到有
       */
      if (!treeData?.length && data?.data?.length) {
        const arr: string[] = [];

        mapTreeNode(data?.data, (item) => {
          if (item.children) {
            arr.push(item.key);
          }
        });

        setExpandedKeys(arr);
      }
    }
  };

  useEffect(() => {
    handleRequestCategorizableData();
  }, []);

  return (
    <Row gutter={15} align={'stretch'}>
      <Col
        className={`${clsPrefix}-categorizable-view`}
        style={{
          overflow: 'auto',
          border: '1px solid #babfc7',
          borderRadius: '2px',
          minHeight: 500,
          maxHeight: 850,
          padding: '10px 15px',
        }}
        span={24 - tableSpan}
      >
        <Typography.Title level={5}>{categorizable?.listTitle ?? '默认标题'}</Typography.Title>
        <Skeleton active paragraph={{ rows: 4 }} loading={requestCategorizableDataLoading}>
          {(() => {
            if (requestCategorizableDataLoading) {
              return null;
            }
            if (utl.isEmpty(treeData)) {
              return <OSEmpty style={{ margin: 0 }} />;
            }
            return (
              <Tree
                {...(requestCategorizableData
                  ? {
                      expandedKeys,
                      onExpand: setExpandedKeys,
                    }
                  : {})}
                showLine
                switcherIcon={<DownOutlined />}
                defaultExpandAll
                treeData={treeData}
                onSelect={handleTreeSelect}
              />
            );
          })()}
        </Skeleton>
      </Col>
      <Col span={tableSpan}>
        {customTableDom || (
          <BaseTable
            {...tableProps}
            tableRef={tableRef}
            requestParams={{
              requestDataSource: {
                activeNode,
              },
            }}
          />
        )}
      </Col>
    </Row>
  );
};