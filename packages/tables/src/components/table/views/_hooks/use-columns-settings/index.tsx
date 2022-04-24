import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import type { TreeProps } from '@ty/antd';
import { Button, Col, Drawer, Row, Tree } from '@ty/antd';
import type { ColumnGroupType, ColumnsType, ColumnType } from '@ty/antd/lib/table';
import utl from 'lodash';
import type { FixedType } from 'rc-table/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ColumnOrdersMetaType,
  OSTableFormFieldItemWithStaticPureConfigs,
  RecordType,
  SettingsDataNode,
} from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import { mapTreeNode } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import type {
  ColumnsSettingsActions,
  OSTableFormFieldItemWithStaticPureConfigsWithChildren,
} from '@ty-one-start/tables';
import { getKeyIndexId } from '../../../utils';
import { ImmediateLoadingButton } from './components/immediate-loading-button';
import { TreeNodeActions } from './components/tree-node-actions';
import { findTreeItem, sortTreeWithOrder } from './utils';

export const useSettings = ({
  columnsPropsIdMaps,
  columnsStaticPureConfigsIdMaps,
  tableWrapRef,
  enable,
  ref,
  staticPureConfigsFieldItems,
  columns,
}: {
  columns: ColumnsType<RecordType>;
  staticPureConfigsFieldItems: OSTableFormFieldItemWithStaticPureConfigsWithChildren;
  allColumnsId: string[];
  columnsPropsIdMaps: Record<string, ColumnGroupType<RecordType> | ColumnType<RecordType>>;
  columnsStaticPureConfigsIdMaps: Record<string, OSTableFormFieldItemWithStaticPureConfigs>;
  enable?: boolean;
  tableWrapRef?: React.RefObject<HTMLDivElement>;
  ref: React.RefObject<Partial<ColumnsSettingsActions>>;
}) => {
  const clsPrefix = useClsPrefix('settings');
  const [visible, setVisible] = useState(false);

  /** 记录距离上次应用设置是否用户修改了配置 */
  const [isUserChangeSettings, setIsUserChangeSettings] = useState(false);

  const [checkedKeys, setCheckedKeys] = useState<
    | React.Key[]
    | {
        checked: React.Key[];
        halfChecked: React.Key[];
      }
  >([]);

  /** 所有临时被删除的 column 注册表 */
  const [columnVisibleMap, setColumnVisibleMap] = useState<Record<string, boolean>>({});
  const [columnFixedMap, setColumnFixedMap] = useState<Record<string, FixedType | undefined>>({});
  /**
   * 记录列在每个层级的排序 order 顺序，key 为父级组件所在路径
   */
  const [columnOrders, setColumnOrders] = useState<ColumnOrdersMetaType>({});
  /** 代理列配置，用户确认后传递给 antd table */
  const [antdColumns, setAntdColumns] = useState<ColumnsType<RecordType>>([]);

  const [treeData, setTreeData] = useState<SettingsDataNode[]>([]);

  const handleDrop: TreeProps['onDrop'] = useCallback(
    (info) => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const data = [...treeData];

      let dragObj: SettingsDataNode | null = null;
      const result = findTreeItem(data, dragKey);
      if (!result) return;
      const { item, index, items } = result;
      items.splice(index, 1);
      dragObj = item;

      if (dragObj == null) return;

      /** 插入子级别 */
      if (!info.dropToGap) {
        if (!(columnsPropsIdMaps[dropKey] as ColumnGroupType<RecordType>).children) {
          const result_ = findTreeItem(data, dropKey);
          if (!result_) return;
          const { items: items_, index: index_ } = result_;
          if (dropPosition === -1) {
            items_.splice(index_, 0, dragObj);
          } else {
            items_.splice(index_ + 1, 0, dragObj);
          }
        } else {
          const result_ = findTreeItem(data, dropKey);
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
        const result_ = findTreeItem(data, dropKey);
        if (!result_) return;
        const { item: item_ } = result_;
        // eslint-disable-next-line no-param-reassign
        item_.children = item_.children || [];
        // 添加到头部，可以是随意位置
        item_.children.unshift(dragObj);
      } else {
        const result_ = findTreeItem(data, dropKey);
        if (!result_) return;
        const { items: items_, index: index_ } = result_;
        if (dropPosition === -1) {
          items_.splice(index_, 0, dragObj);
        } else {
          items_.splice(index_ + 1, 0, dragObj);
        }
      }

      setIsUserChangeSettings(true);
      setTreeData(data);
    },
    [columnsPropsIdMaps, treeData],
  );

  const getTreeDataFromColumns = (
    staticFieldItems: OSTableFormFieldItemWithStaticPureConfigsWithChildren,
  ): SettingsDataNode[] => {
    return (
      staticFieldItems.map((item) => {
        const { configable, title } = item?.settings ?? {};

        const getSelectable = () => {
          if (typeof configable === 'boolean') {
            return configable;
          }
          return !!configable?.selectable;
        };

        const columnGroup = item;
        if (columnGroup.children) {
          /** columnGroup 是 normalize 之后的数据，key 一定会存在 */
          const key = getKeyIndexId(
            columnGroup.settings?.key ??
              columnGroup.settings?.dataIndex ??
              columnGroup.settings?.title,
          );

          return {
            key,
            children: getTreeDataFromColumns(columnGroup.children),
            title,
            disableCheckbox: !getSelectable(),
          };
        }

        const column = item;
        /** TODO: 经过 useItems 处理后的 col 将 key 类型改为 required */
        const key = getKeyIndexId(
          column.settings?.key ?? column.settings?.dataIndex ?? column.settings?.title,
        );
        return {
          key,
          title,
          disableCheckbox: !getSelectable(),
        };
      }) as (null | SettingsDataNode)[]
    ).filter((item): item is SettingsDataNode => item != null);
  };

  /**
   * treeData 的排序操作不会修改 columnsOrders，而是直接操作的 treeData 本身，
   * 因此这里需要通过 treeData 实时计算最新排序
   */
  const getColumnsSettingsOrders = () => {
    const initalColumnOrders = {};

    /** 先计算第一层，否则数据会被覆盖 */
    Object.assign(
      initalColumnOrders,
      treeData.reduce(
        (dist, next, index) => ({
          ...dist,
          [[next]?.map((it) => getKeyIndexId(it?.key)).join('.')]: index,
        }),
        {},
      ),
    );

    mapTreeNode(treeData, (item, __, ___, options) => {
      const fieldItemId = getKeyIndexId(item?.key);
      const { children } = item;
      if (children) {
        initalColumnOrders[fieldItemId] = {
          order: initalColumnOrders[fieldItemId] ?? options?.index,
          children: children.reduce(
            (dist, next, index) => ({
              ...dist,
              [getKeyIndexId(next?.key)]: index,
            }),
            {},
          ),
        };
      }

      return item;
    });

    return initalColumnOrders;
  };

  const convertTreeDataToColumns = (options?: {
    initalTreeData?: SettingsDataNode[];
    initalColumnVisibleMap?: Record<string, boolean>;
    initalColumnFixedMap?: Record<string, boolean>;
  }) => {
    const isVisible = (item: SettingsDataNode) =>
      (options?.initalColumnVisibleMap ?? columnVisibleMap)[item.key!] !== false;

    setAntdColumns(
      mapTreeNode(
        (options?.initalTreeData ?? treeData).filter((item) => {
          return isVisible(item) || item.children?.some(isVisible);
        }),
        (item) => {
          if (item.children) {
            return {
              ...columnsPropsIdMaps[item.key],
              fixed: (options?.initalColumnFixedMap ?? columnFixedMap)[item.key],
              children: item.children.filter((it) => {
                return isVisible(it) || it.children?.some(isVisible);
              }),
            };
          }

          return {
            ...columnsPropsIdMaps[item.key],
            fixed: (options?.initalColumnFixedMap ?? columnFixedMap)[item.key],
          };
        },
      ),
    );
  };

  const setColumnsSettingsFixedMap = (fixed?: Record<string, FixedType | undefined>) => {
    if (fixed == null) return;

    setColumnFixedMap(fixed);

    /** --- 将 fixed 的列重新排序，置顶/尾 --- */
    const removed = {};

    const filter = (treeData_: SettingsDataNode[]) => {
      return treeData_.filter((it) => {
        if (it.key in fixed) {
          removed[it.key] = it;
          return false;
        }
        return true;
      });
    };

    setTreeData((prev) =>
      mapTreeNode(filter(prev), (item) => {
        if (item.children) {
          return {
            ...item,
            children: filter(item.children),
          };
        }
        return item;
      }),
    );

    const pairs = utl.toPairs(fixed);
    const fixedLeft = pairs.filter(([, fixedType]) => fixedType === 'left' || fixedType === true);
    const fixedRight = pairs.filter(([, fixedType]) => fixedType === 'right');

    setTreeData((prev) => [
      ...fixedLeft.map(([key]) => removed[key]),
      ...prev,
      ...fixedRight.map(([key]) => removed[key]),
    ]);
  };

  /** 应用当前配置数据到表格 */
  const applyColumnSettings = () => {
    convertTreeDataToColumns();
    setVisible(false);
  };

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

      const renderTitle = (title?: React.ReactNode) => {
        return (
          <TreeNodeActions
            treeNode={item}
            setColumnFixedMap={setColumnFixedMap}
            setTreeData={setTreeData}
            clsPrefix={clsPrefix}
            columnFixedMap={columnFixedMap}
            fixedable={fixedable}
            draggable={draggable}
            isFixed={!!columnFixedMap[item.key]}
            title={title}
            onFixedChange={() => setIsUserChangeSettings(true)}
          />
        );
      };

      return {
        ...item,
        title: renderTitle(columnItem?.title),
      };
    });
  }, [treeData, columnsStaticPureConfigsIdMaps, columnsPropsIdMaps, clsPrefix, columnFixedMap]);

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
          const configable = columnsStaticPureConfigsIdMaps[item.key ?? '']?.settings?.configable;
          if (typeof configable === 'boolean') {
            return configable;
          }
          return !!configable?.draggble;
        }}
        onDrop={handleDrop}
        onCheck={(checked) => {
          setIsUserChangeSettings(true);
          /** 未设置 checkStrictly checked 为数组类型 */
          if (Array.isArray(checked)) {
            setColumnVisibleMap((prev) =>
              [...checked].reduce(
                (obj, key) => {
                  return {
                    ...obj,
                    [key]: true,
                  };
                },
                utl.mapValues(prev, () => false),
              ),
            );
          }
        }}
      />
    );
  }, [checkedKeys, clsPrefix, columnsStaticPureConfigsIdMaps, handleDrop, visualTreeData]);

  const coreActionsRef = useActionsRef({
    convertTreeDataToColumns,
    getTreeDataFromColumns,
    applyColumnSettings,
  });

  const handleReset = useCallback(() => {
    const initalColumnVisibleMap = {};
    const initalColumnFixedMap = {};
    const initalColumnOrders = {};

    /** 先计算第一层，否则数据会被覆盖 */
    Object.assign(
      initalColumnOrders,
      staticPureConfigsFieldItems.reduce(
        (dist, next, index) => ({
          ...dist,
          [[next]
            ?.map((it) =>
              getKeyIndexId(it.settings?.key ?? it.settings?.dataIndex ?? it.settings?.title),
            )
            .join('.')]: index,
        }),
        {},
      ),
    );

    mapTreeNode(staticPureConfigsFieldItems, (item, parent, parents, options) => {
      const fieldItemId = getKeyIndexId(
        item.settings?.key ?? item.settings?.dataIndex ?? item.settings?.title,
      );
      initalColumnVisibleMap[fieldItemId] = true;
      if (item.settings?.fixed) {
        initalColumnFixedMap[fieldItemId] = true;
      }
      const { children } = item;
      if (children) {
        initalColumnOrders[fieldItemId] = {
          order: initalColumnOrders[fieldItemId] ?? options?.index,
          children: children.reduce(
            (dist, next, index) => ({
              ...dist,
              [getKeyIndexId(
                next.settings?.key ?? next.settings?.dataIndex ?? next.settings?.title,
              )]: index,
            }),
            {},
          ),
        };
      }

      return item;
    });

    const initalTreeData = coreActionsRef.current.getTreeDataFromColumns(
      staticPureConfigsFieldItems,
    );

    setTreeData(initalTreeData);
    setColumnVisibleMap(initalColumnVisibleMap);
    setColumnFixedMap(initalColumnFixedMap);
    setColumnOrders(initalColumnOrders);

    /** 状态更新后执行 */
    coreActionsRef.current.convertTreeDataToColumns({
      initalTreeData,
      initalColumnVisibleMap,
      initalColumnFixedMap,
    });
    setVisible(false);
    setIsUserChangeSettings(false);
  }, [coreActionsRef, staticPureConfigsFieldItems]);

  const drawerDom = useMemo(() => {
    return (
      <Drawer
        className={`${clsPrefix}-drawer`}
        placement="right"
        closable={false}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        width={350}
        footer={
          <Row justify="center" className={`${clsPrefix}-tree-wrapper-toolbar`}>
            <Col span={12}>
              <ImmediateLoadingButton onClick={handleReset}>重置</ImmediateLoadingButton>
            </Col>
            <Col span={12}>
              <ImmediateLoadingButton
                type={'primary'}
                disabled={!isUserChangeSettings}
                onClick={() => {
                  coreActionsRef.current.applyColumnSettings();
                  setIsUserChangeSettings(false);
                }}
              >
                确认
              </ImmediateLoadingButton>
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
  }, [
    handleReset,
    clsPrefix,
    visible,
    isUserChangeSettings,
    treeDom,
    coreActionsRef,
    tableWrapRef,
  ]);

  const settingsIconDom = useMemo(() => {
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

  const actionsRef = useActionsRef(
    {
      getColumnsSettingsTreeData: () => treeData,
      getColumnsSettingsVisibleMap: () => columnVisibleMap,
      getColumnsSettingsFixedMap: () => columnFixedMap,
      getColumnsSettingsOrders,
      setColumnsSettingsVisibleMap: (visibles) =>
        visibles &&
        setColumnVisibleMap({
          ...utl.mapValues(columnsStaticPureConfigsIdMaps, () => true),
          ...visibles,
        }),
      setColumnsSettingsFixedMap,
      setColumnsSettingsTreeData: (treeData_) => treeData_ && setTreeData(treeData_),
      setColumnsSettingsOrders: (orders) => orders && setColumnOrders(orders),
      applyColumnSettings,
    },
    ref,
  );

  /** 根据原始 antd columns 计算列配置树 */
  useEffect(() => {
    setTreeData(coreActionsRef.current.getTreeDataFromColumns(staticPureConfigsFieldItems));
  }, [staticPureConfigsFieldItems, coreActionsRef]);

  /** 根据 columnsStaticPureConfigsIdMaps 计算列显示 map */
  useEffect(() => {
    setColumnVisibleMap((prev) => ({
      ...utl.mapValues(columnsStaticPureConfigsIdMaps, () => true),
      ...prev,
    }));
  }, [columnsStaticPureConfigsIdMaps]);

  /** 根据 columnsStaticPureConfigsIdMaps 计算列固定 map */
  useEffect(() => {
    setColumnFixedMap((prev) => ({
      ...utl.mapValues(
        utl.pickBy(columnsStaticPureConfigsIdMaps, (item) => item.settings?.fixed),
        (item) => item.settings?.fixed,
      ),
      ...prev,
    }));
  }, [columnsStaticPureConfigsIdMaps]);

  /** 根据 columnVisibleMap 计算视图中的 checkedKeys */
  useEffect(() => {
    setCheckedKeys(utl.keys(utl.pickBy(columnVisibleMap, (item) => item === true)));
  }, [columnVisibleMap]);

  /** 根据 columnOrders 重新排序 treeData */
  useEffect(() => {
    setTreeData((prev) => {
      const next = sortTreeWithOrder(prev, columnOrders);
      return next;
    });
  }, [columnOrders]);

  if (enable) {
    return {
      drawerDom,
      iconDom: settingsIconDom,
      /** 如果 columns 一开始为空渲染，defaultSortOrder 会无法正确显示 */
      columns: utl.isEmpty(antdColumns) ? columns : antdColumns,
      actionsRef,
    };
  }

  return {
    drawerDom: null,
    iconDom: null,
    columns,
    actionsRef,
  };
};
