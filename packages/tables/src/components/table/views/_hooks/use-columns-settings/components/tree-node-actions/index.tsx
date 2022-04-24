import { PushpinFilled } from '@ant-design/icons';
import { Col, Row, Space, Typography } from '@ty/antd';
import type { FixedType } from 'rc-table/lib/interface';
import React, { useState } from 'react';
import type { SettingsDataNode } from '@ty-one-start/typings';
import { DragIcon } from '../drag-icon';
import { FixableActions } from './fixable-actions';

const gutter = 5;

export const TreeNodeActions = ({
  draggable,
  fixedable,
  title,
  setColumnFixedMap,
  setTreeData,
  treeNode,
  clsPrefix,
  columnFixedMap,
  isFixed,
  onFixedChange,
}: {
  draggable: boolean;
  fixedable: boolean;
  title: React.ReactNode;
  setColumnFixedMap: React.Dispatch<React.SetStateAction<Record<string, FixedType | undefined>>>;
  setTreeData: React.Dispatch<React.SetStateAction<SettingsDataNode[]>>;
  treeNode: SettingsDataNode;
  clsPrefix: string;
  columnFixedMap: Record<string, FixedType | undefined>;
  isFixed: boolean;
  onFixedChange?: () => void;
}) => {
  const fixedIconCommonStyle = { fontSize: 14, color: '#1890ff' };
  const [mouseHovering, setMouseHovering] = useState(false);

  return (
    <Row
      justify="space-between"
      align="middle"
      className={`${clsPrefix}-tree-item`}
      onMouseEnter={() => {
        setMouseHovering(true);
      }}
      onMouseLeave={() => {
        setMouseHovering(false);
      }}
    >
      <Col flex="auto">
        <Typography.Text ellipsis>{title}</Typography.Text>
      </Col>
      <Col>
        {/* 做显示切换的时候，如果是通过 CSS 控制不要用 Space.size 或者 Row.gutter 包裹，因为哪怕子元素为空，依旧会包裹 Item */}
        <Space size={gutter} align="center">
          {mouseHovering && fixedable && (
            <FixableActions
              onFixedChange={() => {
                onFixedChange?.();
                setMouseHovering(false);
              }}
              treeNode={treeNode}
              setColumnFixedMap={setColumnFixedMap}
              setTreeData={setTreeData}
              clsPrefix={clsPrefix}
              columnFixedMap={columnFixedMap}
              iconStyle={fixedIconCommonStyle}
              gutter={gutter}
            />
          )}
          {!mouseHovering && isFixed && (
            <PushpinFilled
              className="pushpin-icon"
              style={{ ...fixedIconCommonStyle, fontSize: 11 }}
            />
          )}
          {draggable && (
            <DragIcon
              style={{
                cursor: 'move',
                fontSize: 14,
              }}
            />
          )}
        </Space>
      </Col>
    </Row>
  );
};
