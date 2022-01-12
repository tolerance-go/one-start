import {
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import produce from 'immer';
import utl from 'lodash';
import type { FixedType } from 'rc-table/lib/interface';
import React from 'react';
import { findTreeNodeMeta } from '../../../../utils/tree-utils';
import type { SettingsDataNode } from '../../../../../typings';
import { Space } from '@ty/antd';

const cancelEventDefaults = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
  e.stopPropagation();
  e.preventDefault();
};

export const FixableActions = ({
  treeNode,
  setColumnFixedMap,
  setTreeData,
  columnFixedMap,
  iconStyle,
  gutter,
  onFixedChange,
}: {
  setColumnFixedMap: React.Dispatch<React.SetStateAction<Record<string, FixedType | undefined>>>;
  setTreeData: React.Dispatch<React.SetStateAction<SettingsDataNode[]>>;
  treeNode: SettingsDataNode;
  clsPrefix: string;
  columnFixedMap: Record<string, FixedType | undefined>;
  iconStyle?: React.CSSProperties;
  gutter: number;
  onFixedChange: () => void;
}) => {
  const fixedTop = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onFixedChange();
    cancelEventDefaults(e);
    setColumnFixedMap(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[treeNode.key!] = 'left';
      }),
    );

    setTreeData((prev) => {
      const result = findTreeNodeMeta(prev, (it) => it.key === treeNode.key);
      if (result) {
        if (result.parent) {
          const [removed] = result.parent.children!.splice(result.itemIndex!, 1);
          return [removed, ...prev];
        }
        const [removed] = prev.splice(result.itemIndex!, 1);
        return [removed, ...prev];
      }
      return prev;
    });
  };

  const fixedBottom = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onFixedChange();
    cancelEventDefaults(e);
    setColumnFixedMap(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[treeNode.key!] = 'right';
      }),
    );

    setTreeData((prev) => {
      const result = findTreeNodeMeta(prev, (it) => it.key === treeNode.key);
      if (result) {
        if (result.parent) {
          const [removed] = result.parent.children!.splice(result.itemIndex!, 1);
          return [...prev, removed];
        }
        const [removed] = prev.splice(result.itemIndex!, 1);
        return [...prev, removed];
      }
      return prev;
    });
  };

  const deleteFixedTop = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onFixedChange();
    cancelEventDefaults(e);
    setColumnFixedMap(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[treeNode.key!] = undefined;
      }),
    );

    setTreeData((prev) => {
      // 找到第一个不是 fixed 的
      const next = [...prev];
      const itemIndex = next.findIndex((it) => it.key === treeNode.key);
      if (itemIndex !== -1) {
        const [removed] = next.splice(itemIndex, 1);
        const firstNotFixed = next.findIndex((it) => columnFixedMap[it.key] == null);
        next.splice(firstNotFixed, 0, removed);
        return next;
      }
      return prev;
    });
  };

  const deleteFixedBottom = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onFixedChange();
    cancelEventDefaults(e);
    setColumnFixedMap(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[treeNode.key!] = undefined;
      }),
    );

    setTreeData((prev) => {
      // 找到第一个不是 fixed 的
      const next = [...prev];
      const itemIndex = next.findIndex((it) => it.key === treeNode.key);
      if (itemIndex !== -1) {
        const [removed] = next.splice(itemIndex, 1);
        const lastNotFixed = utl.findLastIndex(next, (it) => columnFixedMap[it.key] == null);
        next.splice(lastNotFixed, 0, removed);
        return next;
      }
      return prev;
    });
  };

  const renderIcons = () => {
    if (columnFixedMap[treeNode.key] === 'right') {
      return [
        <VerticalAlignTopOutlined onClick={fixedTop} style={{ ...iconStyle }} />,
        <VerticalAlignMiddleOutlined onClick={deleteFixedBottom} style={{ ...iconStyle }} />,
      ];
    }

    if (columnFixedMap[treeNode.key] === 'left') {
      return [
        <VerticalAlignBottomOutlined onClick={fixedBottom} style={{ ...iconStyle }} />,
        <VerticalAlignMiddleOutlined onClick={deleteFixedTop} style={{ ...iconStyle }} />,
      ];
    }

    return [
      <VerticalAlignTopOutlined onClick={fixedTop} style={{ ...iconStyle }} />,
      <VerticalAlignBottomOutlined onClick={fixedBottom} style={{ ...iconStyle }} />,
    ];
  };

  return <Space size={gutter}>{renderIcons()}</Space>;
};
