import {
  DownOutlined,
  PushpinFilled,
  SettingOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import type { TreeProps } from '@ty/antd';
import { Button, Col, Drawer, Row, Tree, Typography } from '@ty/antd';
import type { ColumnGroupType, ColumnsType, ColumnType } from '@ty/antd/lib/table';
import produce from 'immer';
import utl from 'lodash';
import type { FixedType } from 'rc-table/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSTableFormFieldItemWithStaticPureConfigs, RecordType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import type { SettingsDataNode } from '../../typings';
import type { ColumnsSettingsActions } from './typings';
import { findTreeNodeMeta, mapTreeNode } from '../utils/tree-utils';

const loop = <T extends { children?: any[]; key?: React.Key }>(
  data: T[],
  key: React.Key,
): {
  item: T;
  items: T[];
  index: number;
} | null => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return {
        item: data[i],
        index: i,
        items: data,
      };
    }
    if (data[i].children) {
      const result = loop(data[i].children as T[], key);
      if (result) return result;
    }
  }
  return null;
};

export const useSettings = ({
  columns,
  allColumnsId,
  columnsPropsIdMaps,
  columnsStaticPureConfigsIdMaps,
  tableWrapRef,
  enable,
  searchSwitchActionsRef,
  ref,
}: {
  searchSwitchActionsRef: React.RefObject<{
    toggleTableHeaderSearchDom: () => void;
  }>;
  columns: ColumnsType<RecordType>;
  allColumnsId: string[];
  columnsPropsIdMaps: Record<string, ColumnGroupType<RecordType> | ColumnType<RecordType>>;
  columnsStaticPureConfigsIdMaps: Record<string, OSTableFormFieldItemWithStaticPureConfigs>;
  enable?: boolean;
  tableWrapRef?: React.RefObject<HTMLDivElement>;
  ref: React.RefObject<Partial<ColumnsSettingsActions>>;
}) => {
  const clsPrefix = useClsPrefix('settings');
  const [visible, setVisible] = useState(false);

  const [checkedKeys, setCheckedKeys] = useState<
    | React.Key[]
    | {
        checked: React.Key[];
        halfChecked: React.Key[];
      }
  >([]);

  /** 所有临时被删除的 column 注册表 */
  const [columnVisibleMap, setColumnVisibleMap] = useState<Record<string, boolean>>(() => {
    return utl.mapValues(columnsStaticPureConfigsIdMaps, () => true);
  });
  const [columnFixedMap, setColumnFixedMap] = useState<Record<string, FixedType | undefined>>({});

  const [treeData, setTreeData] = useState<SettingsDataNode[]>(() => {
    const getTreeDataFromColumns = (columns_: ColumnsType<RecordType>): SettingsDataNode[] => {
      return (
        columns_.map((item) => {
          const { configable, title } =
            columnsStaticPureConfigsIdMaps[item.key ?? '']?.settings ?? {};

          const getSelectable = () => {
            if (typeof configable === 'boolean') {
              return configable;
            }
            return !!configable?.selectable;
          };

          const columnGroup = item as ColumnGroupType<RecordType>;
          if ((columnGroup as ColumnGroupType<RecordType>).children) {
            /** columnGroup 是 normalize 之后的数据，key 一定会存在 */
            const key = columnGroup.key!;

            return {
              key,
              children: getTreeDataFromColumns(
                (columnGroup as ColumnGroupType<RecordType>).children,
              ),
              title,
              disableCheckbox: !getSelectable(),
            };
          }

          const column = item as ColumnType<RecordType>;
          /** TODO: 经过 useItems 处理后的 col 将 key 类型改为 required */
          const key = column.key!;
          return {
            key,
            title,
            disableCheckbox: !getSelectable(),
          };
        }) as (null | SettingsDataNode)[]
      ).filter((item): item is SettingsDataNode => item != null);
    };

    return getTreeDataFromColumns(columns);
  });

  const handleDrop: TreeProps['onDrop'] = useCallback(
    (info) => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const data = [...treeData];

      let dragObj: SettingsDataNode | null = null;
      const result = loop(data, dragKey);
      if (!result) return;
      const { item, index, items } = result;
      items.splice(index, 1);
      dragObj = item;

      if (dragObj == null) return;

      /** 插入子级别 */
      if (!info.dropToGap) {
        if (!(columnsPropsIdMaps[dropKey] as ColumnGroupType<RecordType>).children) {
          const result_ = loop(data, dropKey);
          if (!result_) return;
          const { items: items_, index: index_ } = result_;
          if (dropPosition === -1) {
            items_.splice(index_, 0, dragObj);
          } else {
            items_.splice(index_ + 1, 0, dragObj);
          }
        } else {
          const result_ = loop(data, dropKey);
          if (!result_) return;
          const { item: item_ } = result_;
          // eslint-disable-next-line no-param-reassign
          item_.children = item_.children || [];
          // 添加到头部，可以是随意位置
          item_.children.unshift(dragObj);
        }
      } else if (
        (info.node.children || []).length > 0 &&
        info.node.expanded &&
        dropPosition === 1
      ) {
        const result_ = loop(data, dropKey);
        if (!result_) return;
        const { item: item_ } = result_;
        // eslint-disable-next-line no-param-reassign
        item_.children = item_.children || [];
        // 添加到头部，可以是随意位置
        item_.children.unshift(dragObj);
      } else {
        const result_ = loop(data, dropKey);
        if (!result_) return;
        const { items: items_, index: index_ } = result_;
        if (dropPosition === -1) {
          items_.splice(index_, 0, dragObj);
        } else {
          items_.splice(index_ + 1, 0, dragObj);
        }
      }

      setTreeData(data);
    },
    [columnsPropsIdMaps, treeData],
  );

  const visualTreeData = useMemo(() => {
    return mapTreeNode(treeData, (item) => {
      const { configable } = columnsStaticPureConfigsIdMaps[item.key ?? '']?.settings ?? {};

      const columnItem = columnsPropsIdMaps[item.key];

      const draggable = (() => {
        if (typeof configable === 'boolean') {
          return configable;
        }
        return !!configable?.draggble;
      })();

      const fixedable = (() => {
        if (typeof configable === 'boolean') {
          return configable;
        }
        return !!configable?.fixable;
      })();

      const cancelEventDefaults = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
      };

      const renderTitle = (title?: React.ReactNode) => {
        const fixedIconCommonStyle = { fontSize: 14, color: '#1890ff' };

        const renderAlignIcon = () => {
          const fixedTop = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            cancelEventDefaults(e);
            setColumnFixedMap(
              produce((draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[item.key!] = 'left';
              }),
            );

            setTreeData((prev) => {
              const result = findTreeNodeMeta(prev, (it) => it.key === item.key);
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
            cancelEventDefaults(e);
            setColumnFixedMap(
              produce((draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[item.key!] = 'right';
              }),
            );

            setTreeData((prev) => {
              const result = findTreeNodeMeta(prev, (it) => it.key === item.key);
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
            cancelEventDefaults(e);
            setColumnFixedMap(
              produce((draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[item.key!] = undefined;
              }),
            );

            setTreeData((prev) => {
              // 找到第一个不是 fixed 的
              const next = [...prev];
              const itemIndex = next.findIndex((it) => it.key === item.key);
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
            cancelEventDefaults(e);
            setColumnFixedMap(
              produce((draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[item.key!] = undefined;
              }),
            );

            setTreeData((prev) => {
              // 找到第一个不是 fixed 的
              const next = [...prev];
              const itemIndex = next.findIndex((it) => it.key === item.key);
              if (itemIndex !== -1) {
                const [removed] = next.splice(itemIndex, 1);
                const lastNotFixed = utl.findLastIndex(
                  next,
                  (it) => columnFixedMap[it.key] == null,
                );
                next.splice(lastNotFixed, 0, removed);
                return next;
              }
              return prev;
            });
          };

          const className = `${clsPrefix}-fixed-icon fixed-icon`;

          if (columnFixedMap[item.key] === 'right') {
            return [
              <VerticalAlignTopOutlined
                className={className}
                onClick={fixedTop}
                style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
              />,
              <VerticalAlignMiddleOutlined
                className={className}
                onClick={deleteFixedBottom}
                style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
              />,
            ];
          }
          if (columnFixedMap[item.key] === 'left') {
            return [
              <VerticalAlignBottomOutlined
                className={className}
                onClick={fixedBottom}
                style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
              />,
              <VerticalAlignMiddleOutlined
                className={className}
                onClick={deleteFixedTop}
                style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
              />,
            ];
          }

          return [
            <VerticalAlignTopOutlined
              className={className}
              onClick={fixedTop}
              style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
            />,
            <VerticalAlignBottomOutlined
              className={className}
              onClick={fixedBottom}
              style={{ ...fixedIconCommonStyle, marginLeft: 5 }}
            />,
          ];
        };

        return (
          <Row justify="space-between" align="middle" className={`${clsPrefix}-tree-item`}>
            <Col flex="auto">
              <Typography.Text ellipsis>{title}</Typography.Text>
            </Col>
            <Row align="middle">
              {fixedable && renderAlignIcon()}
              {columnFixedMap[item.key] && (
                <PushpinFilled
                  className="pushpin-icon"
                  style={{ ...fixedIconCommonStyle, fontSize: 12, marginLeft: 5 }}
                />
              )}
              {draggable && (
                <span
                  className="anticon"
                  role="img"
                  aria-label="info-darg-icon"
                  style={{
                    cursor: 'move',
                    fontSize: 16,
                    marginLeft: 3,
                  }}
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2119"
                    width="1em"
                    height="1em"
                    fill="#888"
                  >
                    <path
                      d="M298.666667 810.666667 298.666667 725.333333 384 725.333333 384 810.666667 298.666667 810.666667M469.333333 810.666667 469.333333 725.333333 554.666667 725.333333 554.666667 810.666667 469.333333 810.666667M640 810.666667 640 725.333333 725.333333 725.333333 725.333333 810.666667 640 810.666667M298.666667 640 298.666667 554.666667 384 554.666667 384 640 298.666667 640M469.333333 640 469.333333 554.666667 554.666667 554.666667 554.666667 640 469.333333 640M640 640 640 554.666667 725.333333 554.666667 725.333333 640 640 640M298.666667 469.333333 298.666667 384 384 384 384 469.333333 298.666667 469.333333M469.333333 469.333333 469.333333 384 554.666667 384 554.666667 469.333333 469.333333 469.333333M640 469.333333 640 384 725.333333 384 725.333333 469.333333 640 469.333333M298.666667 298.666667 298.666667 213.333333 384 213.333333 384 298.666667 298.666667 298.666667M469.333333 298.666667 469.333333 213.333333 554.666667 213.333333 554.666667 298.666667 469.333333 298.666667M640 298.666667 640 213.333333 725.333333 213.333333 725.333333 298.666667 640 298.666667Z"
                      p-id="2120"
                    ></path>
                  </svg>
                </span>
              )}
            </Row>
          </Row>
        );
      };

      return {
        ...item,
        title: renderTitle(columnItem?.title),
      };
    });
  }, [treeData, columnsStaticPureConfigsIdMaps, columnsPropsIdMaps, clsPrefix, columnFixedMap]);

  const tableColumns = useMemo(() => {
    /** 使用 treeData 的顺序去修改 columns */
    const getNextColumns = (data: SettingsDataNode[]): ColumnsType<RecordType> => {
      return data
        .map((item) => {
          if (item.children && item.children.length) {
            return {
              ...columnsPropsIdMaps[item.key],
              fixed: columnFixedMap[item.key],
              children: getNextColumns(item.children),
            };
          }

          return {
            ...columnsPropsIdMaps[item.key],
            fixed: columnFixedMap[item.key],
          };
        })
        .filter((item) => {
          const columnGroup = item as ColumnGroupType<RecordType>;
          if (columnGroup.children) {
            return !!columnGroup.children.length;
          }

          return columnVisibleMap[item.key!];
        });
    };
    return getNextColumns(treeData);
  }, [columnsPropsIdMaps, columnFixedMap, columnVisibleMap, treeData]);

  /** 如果 columns 一开始为空渲染，defaultSortOrder 会无法正确显示 */
  const tableColumnsWithoutEmpty = useMemo(() => {
    return utl.isEmpty(tableColumns) ? columns : tableColumns;
  }, [tableColumns, columns]);

  const falsifyColumnsVisibleMap = useMemo(() => {
    return allColumnsId.reduce((obj, key) => {
      return {
        [key]: false,
        ...obj,
      };
    }, {});
  }, [allColumnsId]);

  const treeDom = useMemo(() => {
    return (
      <Tree
        className={`${clsPrefix}-tree`}
        defaultExpandAll
        checkable
        blockNode
        treeData={visualTreeData}
        checkedKeys={checkedKeys}
        selectable={false}
        icon={null}
        switcherIcon={<DownOutlined />}
        showLine={{
          showLeafIcon: false,
        }}
        draggable={(item) => {
          const configable = columnsStaticPureConfigsIdMaps[item.key].settings?.configable;
          if (typeof configable === 'boolean') {
            return configable;
          }
          return !!configable?.draggble;
        }}
        onDrop={handleDrop}
        onCheck={(checked) => {
          /** 未设置 checkStrictly checked 为数组类型 */
          if (Array.isArray(checked)) {
            setColumnVisibleMap(
              checked.reduce((obj, key) => {
                return {
                  ...obj,
                  [key]: true,
                };
              }, falsifyColumnsVisibleMap),
            );
          }
        }}
      />
    );
  }, [
    checkedKeys,
    clsPrefix,
    columnsStaticPureConfigsIdMaps,
    falsifyColumnsVisibleMap,
    handleDrop,
    visualTreeData,
  ]);

  const drawerDom = useMemo(() => {
    return (
      <Drawer
        className={`${clsPrefix}-drawer`}
        placement="right"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        width={350}
        footer={
          <Row justify="end" className={`${clsPrefix}-tree-wrapper-toolbar`}>
            <Col>
              <Button
                type="link"
                onClick={() => {
                  const initialMap = allColumnsId.reduce((obj, key) => {
                    return {
                      [key]: true,
                      ...obj,
                    };
                  }, {});

                  setColumnVisibleMap(initialMap);
                  setColumnFixedMap(falsifyColumnsVisibleMap);
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        }
        getContainer={() => {
          return tableWrapRef?.current?.querySelector('.ty-ant-table') ?? document.body;
        }}
        style={{ position: 'absolute' }}
      >
        <div className={`${clsPrefix}-tree-wrapper`}>{treeDom}</div>
      </Drawer>
    );
  }, [allColumnsId, clsPrefix, falsifyColumnsVisibleMap, tableWrapRef, treeDom, visible]);

  const resetBtnDom = useMemo(() => {
    return (
      <Button
        type="text"
        icon={<SettingOutlined />}
        onClick={() => {
          setVisible((prev) => !prev);
        }}
      ></Button>
    );
  }, []);

  useActionsRef(
    {
      getColumnsSettingsTreeData: () => treeData,
      getColumnsSettingsVisibleMap: () => columnVisibleMap,
      getColumnsSettingsFixedMap: () => columnFixedMap,
      setColumnsSettingsVisibleMap: (visibles) => visibles && setColumnVisibleMap(visibles),
      setColumnsSettingsFixedMap: (fixeds) => fixeds && setColumnFixedMap(fixeds),
      setColumnsSettingsTreeData: (treeData_) => treeData_ && setTreeData(treeData_),
    },
    ref,
  );

  useEffect(() => {
    setCheckedKeys(utl.keys(columnVisibleMap).filter((item) => columnVisibleMap[item]));
  }, [columnVisibleMap]);

  useEffect(() => {
    searchSwitchActionsRef.current?.toggleTableHeaderSearchDom();
  }, [columnVisibleMap, searchSwitchActionsRef]);

  if (enable) {
    return {
      drawerDom,
      iconDom: resetBtnDom,
      columns: tableColumnsWithoutEmpty,
    };
  }

  return {
    drawerDom: null,
    iconDom: null,
    columns,
  };
};
