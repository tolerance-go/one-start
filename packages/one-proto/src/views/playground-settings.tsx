import { CloseOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { mapTreeNode } from '@ty-one-start/one-start';
import { Col, Drawer, Row, Tabs, Tree } from '@ty/antd';
import cls from 'classnames';
import type { DataNode } from 'rc-tree/lib/interface';
import React, { useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import type { NodeDataType } from './typings';
import { renderNodeActions } from './utils/render-node-actions';

const PlaygroundSettings: React.FC<{
  clsPrefix: string;
  appData: NodeDataType[];
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>;
}> = (props) => {
  const { clsPrefix, setAppData, appData } = props;
  const [visible, setVisible] = useState(false);

  const rendererTreeData = useMemo(() => {
    return mapTreeNode(appData, (item) => {
      return {
        key: item.id,
        title: (
          <Row justify="space-between">
            <Col>{item.elementType}</Col>
            <Col>{renderNodeActions(item, setAppData)}</Col>
          </Row>
        ),
        children: item.children,
      } as DataNode;
    });
  }, [appData, setAppData]);

  return (
    <>
      <Drawer
        className={`${clsPrefix}-drawer`}
        visible={visible}
        onClose={() => setVisible(false)}
        placement="right"
        width={500}
        bodyStyle={{
          padding: '0 10px',
        }}
        style={{
          zIndex: 999,
        }}
        handler={
          <div
            style={{
              right: 500,
            }}
            className={cls(`${clsPrefix}-drawer-trigger`)}
            onClick={() => setVisible((prev) => !prev)}
          >
            {visible ? <CloseOutlined /> : <SettingOutlined />}
          </div>
        }
      >
        <Tabs size="small" defaultActiveKey="tree-data">
          <Tabs.TabPane tab="树形数据" key="tree-data">
            <Tree
              className={`${clsPrefix}-tree`}
              showLine={{
                showLeafIcon: false,
              }}
              selectable={false}
              blockNode
              switcherIcon={<DownOutlined />}
              icon={null}
              defaultExpandAll
              treeData={rendererTreeData}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="JSON 数据" key="json-data">
            <ReactJson src={appData} />
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    </>
  );
};

export default PlaygroundSettings;
