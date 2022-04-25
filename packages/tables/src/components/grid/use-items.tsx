import type { ColDef, ColGroupDef } from '@ag-grid-enterprise/all-modules';
import { InfoCircleOutlined, QuestionCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { renderField } from '@ty-one-start/fields';
import {
  mergeRuleToTooltip,
  normalizeTooltip,
  renderTableFormItem,
} from '@ty-one-start/form-items';
import type {
  OSFormFieldItem,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormItemSimpleTooltip,
  OSFormItemType,
  OSGridAPI,
  OSRule,
  OSSelectFieldType,
  OSTableFormFieldItemExtra,
  OSTableFormFieldItemRender,
  OSTableFormFieldItems,
  OSTableFormFieldItemSearchType,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableType,
  RecordType,
  CustomFieldValueTypeOptions,
  RequiredRecursion,
} from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import type { FormInstance } from 'antd';
import { Space, Tooltip } from 'antd';
import type { Rule } from 'antd/lib/form';
import type { ColumnGroupType, ColumnType } from 'antd/lib/table';
import cls from 'classnames';
import utl from 'lodash';
import React, { useMemo, useRef } from 'react';
import {
  DEFAULT_WIDTH,
  searchHeadFormFieldRowId,
  tdSelfClassTag,
  verticalRowCellWithKeyClsPrefix,
} from './constants';
import { getDataIndexId, runTableSettings } from './utils';

/** 中间产物 */
const useIntermediateProducts = ({ reset }: { reset?: () => void }) => {
  const searchRequestOptionsMapDataIndexIdRef = useRef<
    Record<string, RequiredRecursion<OSSelectFieldType>['requests']['requestOptions']>
  >({});

  const searchTransfromMapDataIndexIdRef = useRef<
    Record<string, Required<OSTableFormFieldItemSearchType>['transform']>
  >({});

  /** 最下层所有设置 search 的 items */
  const searchFormFieldItemsRef = useRef<OSFormFieldItem[]>([]);

  /** 表格的总宽度 */
  const totalTableWidthRef = useRef<number>(0);

  /** 所有 column 的 antd 配置和 id 的 map */
  const allColumnsIdMapsRef = useRef<
    Record<string, ColumnGroupType<RecordType> | ColumnType<RecordType>>
  >({});

  /** 所有 column 的 os 配置和 id 的 map */
  const columnsStaticPureConfigsIdMapsRef = useRef<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >({});

  /** 是否启用了表单搜索 */
  const enableSearchFormRef = useRef<boolean>(false);

  /** 是否启用了高亮设置 */
  const enableCellHighlightRef = useRef<boolean>(false);

  /** 是否启用了列设置 */
  const enableColumnsSettingsRef = useRef<boolean>(false);

  const resetIntermediateProducts = () => {
    searchRequestOptionsMapDataIndexIdRef.current = {};
    searchTransfromMapDataIndexIdRef.current = {};
    searchFormFieldItemsRef.current = [];
    totalTableWidthRef.current = 0;
    allColumnsIdMapsRef.current = {};
    columnsStaticPureConfigsIdMapsRef.current = {};
    enableSearchFormRef.current = false;
    enableColumnsSettingsRef.current = false;
    enableCellHighlightRef.current = false;

    reset?.();
  };

  return {
    searchRequestOptionsMapDataIndexIdRef,
    searchTransfromMapDataIndexIdRef,
    searchFormFieldItemsRef,
    totalTableWidthRef,
    allColumnsIdMapsRef,
    columnsStaticPureConfigsIdMapsRef,
    resetIntermediateProducts,
    enableSearchFormRef,
    enableColumnsSettingsRef,
    enableCellHighlightRef,
  };
};

export const useItems = ({
  fieldItems,
  tableWrapForm,
  clsPrefix,
  editableRowKeys,
  rowKey,
  extraValueTypes,
  tableActionsRef,
  getFieldItems,
  fieldItemSettings,
  allColumnsIdRef: propsAllColumnsIdRef,
  columnsStaticPureConfigsIdMapsRef: propsColumnsStaticPureConfigsIdMapsRef,
}: {
  tableKey?: string;
  fieldItems?: OSTableFormFieldItems;
  fieldItemSettings?: Required<OSTableType>['settings']['fieldItemSettings'];
  tableWrapForm: FormInstance;
  clsPrefix: string;
  allColumnsIdRef: React.MutableRefObject<string[]>;
  columnsStaticPureConfigsIdMapsRef: React.MutableRefObject<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >;
  editableRowKeys?: RequiredRecursion<OSTableType>['settings']['editableRowKeys'];
  rowKey: RequiredRecursion<OSTableType>['settings']['rowKey'];
  searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
  extraValueTypes: Record<string, (options: CustomFieldValueTypeOptions) => React.ReactNode>;
  tableActionsRef: React.MutableRefObject<OSGridAPI>;
  getFieldItems?: OSTableType['getFieldItems'];
}) => {
  const {
    searchRequestOptionsMapDataIndexIdRef,
    searchTransfromMapDataIndexIdRef,
    searchFormFieldItemsRef,
    totalTableWidthRef,
    allColumnsIdMapsRef,
    columnsStaticPureConfigsIdMapsRef,
    enableSearchFormRef,
    enableColumnsSettingsRef,
    enableCellHighlightRef,
    resetIntermediateProducts,
  } = useIntermediateProducts({
    reset: () => {
      // eslint-disable-next-line no-param-reassign
      propsColumnsStaticPureConfigsIdMapsRef.current = {};
    },
  });

  const handleEditable =
    ({
      editable,
      valueType,
      settings,
      requests,
      dependencies,
      dataIndex,
      render,
    }: {
      editable?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['editable'];
      valueType?: OSTableFormFieldItems[number]['type'];
      settings?: OSTableFormFieldItems[number]['settings'];
      render?: OSTableFormFieldItemRender;
      requests?: OSTableFormFieldItems[number]['requests'];
      dependencies?: OSFormFieldItem['dependencies'];
      dataIndex?: RequiredRecursion<OSFormItemType>['settings']['dataIndex'];
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      const getColEditable = (rowData: RecordType, rowIndex: number) => {
        const colEditable = (() => {
          if (editable == null) {
            return false;
          }
          if (typeof editable === 'function') {
            return editable(rowData, rowIndex);
          }
          return !!editable;
        })();

        return colEditable && (editableRowKeys ? editableRowKeys.includes(rowData[rowKey]) : true);
      };

      return {
        ...col_,
        onCell: (data, index) => {
          const colEditable = getColEditable(data, index ?? -1);
          const prev = col_.onCell?.(data, index);
          return {
            ...prev,
            className: cls(
              prev?.className,
              [clsPrefix, colEditable ? 'cell-editing' : ''].filter(Boolean).join('-'),
            ),
          };
        },
        render: (val, rowData = {}, rowIndex) => {
          const colEditable = getColEditable(rowData, rowIndex);

          if (colEditable) {
            const dom = renderTableFormItem(valueType, settings, requests ?? {}, {
              rowData,
              rowIndex,
              rowId: rowData[rowKey],
              actions: tableActionsRef.current,
              dependencies,
              defaultSettings: fieldItemSettings,
              getField: (staticFieldSettings, staticFieldRequests) => {
                return renderField(
                  colEditable ? 'edit' : 'read',
                  valueType,
                  {
                    ...staticFieldSettings,
                    bordered: false,
                  },
                  staticFieldRequests,
                  {
                    types: extraValueTypes,
                  },
                );
              },
            });

            if (render) {
              return render({
                mode: 'edit',
                dom,
                rowData,
                rowIndex,
                rowId: rowData[rowKey],
              });
            }

            return dom;
          }

          const staticFieldSettings = runTableSettings(settings, {
            form: tableWrapForm,
            rowData,
            rowIndex,
            rowId: rowData[rowKey],
            actions: tableActionsRef.current,
          });

          if (staticFieldSettings?.ellipsisTooltip) {
            return val != null ? (
              <Tooltip title={val} placement="topLeft">
                {val}
              </Tooltip>
            ) : (
              '--'
            );
          }

          const renderCellDom = () => {
            const dom = renderField(
              'read',
              valueType,
              {
                ...fieldItemSettings,
                ...staticFieldSettings,
                bordered: false,
              },
              requests,
              {
                types: extraValueTypes,
                text: dataIndex ? utl.get(rowData, dataIndex) : undefined,
                autoFetchSelectOptions: false,
              },
            );

            if (staticFieldSettings?.cellTooltip) {
              const { cellTooltip } = staticFieldSettings;
              const renderTooltipDom = (style: React.CSSProperties) => (
                <Tooltip
                  title={
                    Array.isArray(cellTooltip)
                      ? cellTooltip.map((item) => <div key={item}>{item}</div>)
                      : cellTooltip
                  }
                >
                  <InfoCircleOutlined
                    style={{
                      cursor: 'help',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      ...style,
                    }}
                  />
                </Tooltip>
              );
              if (col_.align === 'right') {
                return (
                  <>
                    {renderTooltipDom({
                      left: 7,
                    })}
                    {dom}
                  </>
                );
              }
              return (
                <>
                  {dom}
                  {renderTooltipDom({
                    right: 7,
                  })}
                </>
              );
            }

            return dom;
          };

          const cellDom = renderCellDom();

          if (render) {
            return render({
              mode: 'read',
              dom: cellDom,
              rowData,
              rowIndex,
              rowId: rowData[rowKey],
            });
          }

          return cellDom;
        },
      };
    };

  const handleAlign =
    ({
      valueType,
      align,
      title,
    }: {
      valueType?: OSTableFormFieldItems[number]['type'];
      align?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['align'];
      title?: React.ReactNode;
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      const align_ = (() => {
        if (align) {
          return align;
        }
        if (valueType) {
          if (['digit', 'money'].includes(valueType)) {
            return 'right';
          }
          if (['select', 'date', 'date-range'].includes(valueType)) {
            return 'center';
          }
        }
        return align;
      })();
      return {
        ...col_,
        align: align_,
        title,
      };
    };

  const handleHighlight =
    ({
      highlight,
    }: {
      highlight?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['highlight'];
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      if (highlight) {
        enableCellHighlightRef.current = true;

        return {
          ...col_,
          onCell: (data: RecordType, index?: number) => {
            const meta = highlight(data, index);
            const props = col_.onCell?.(data, index);
            return {
              ...props,
              className: cls(
                props?.className,
                meta?.type ? `cell-highlight-${meta?.type}` : undefined,
              ),
            };
          },
        } as ColumnType<RecordType>;
      }
      return col_;
    };

  const handleTooltip =
    ({
      tooltip,
      linkagetip,
      rules,
    }: {
      linkagetip?: string | string[];
      tooltip?: OSFormItemSimpleTooltip;
      rules?: (OSRule | Rule)[];
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      const normalizedTooltip = mergeRuleToTooltip(rules, normalizeTooltip(tooltip));

      return {
        ...col_,
        title:
          normalizedTooltip.title?.length || linkagetip ? (
            <Space size={4}>
              {col_.title}
              {linkagetip ? (
                <Tooltip
                  title={
                    Array.isArray(linkagetip)
                      ? linkagetip.map((item) => <div key={item}>{item}</div>)
                      : linkagetip
                  }
                >
                  <ThunderboltOutlined
                    style={{
                      color: 'rgba(0, 0, 0, 0.45)',
                      cursor: 'help',
                      fontSize: 12,
                    }}
                  />
                </Tooltip>
              ) : null}
              {normalizedTooltip.title?.length ? (
                <Tooltip
                  title={normalizedTooltip.title.map((item, index) => (
                    <div key={index.toString()}>{item}</div>
                  ))}
                >
                  <QuestionCircleOutlined
                    style={{
                      color: 'rgba(0, 0, 0, 0.45)',
                      cursor: 'help',
                    }}
                  />
                </Tooltip>
              ) : null}
            </Space>
          ) : (
            col_.title
          ),
      };
    };

  const renderItems = (
    fieldItems_?: OSTableFormFieldItems,
    // options?: {
    //   parentFieldItems?: OSTableFormFieldItems;
    //   /** 父节点是不是同级别最后一个节点 */
    //   parentIsLast: boolean;
    // },
  ): (ColDef | ColGroupDef)[] => {
    // const { parentIsLast, parentFieldItems } = options ?? {};
    return (
      (fieldItems_
        ?.map((fieldItem) => {
          const { type: valueType, requests: _requests, dependencies } = fieldItem;

          const _settings = runTableSettings(fieldItem.settings, {
            form: tableWrapForm,
            rowData: {},
            rowIndex: -1,
            rowId: searchHeadFormFieldRowId,
            actions: tableActionsRef.current,
          });

          const mergedFieldItemSettings = {
            resizeable: true,
            configable: {
              selectable: true,
              draggble: true,
              fixable: true,
            },
            ...fieldItemSettings,
          };

          const mergedSettings = {
            ...mergedFieldItemSettings,
            ..._settings,
          };

          const {
            hide,
            editable,
            search,
            title,
            dataIndex,
            // resizeable,
            fixed,
            defaultSortOrder,
            configable,
            ellipsisTooltip,
          } = mergedSettings;

          /** 设置 col 排序和隐藏 */
          if (configable) {
            enableColumnsSettingsRef.current = true;
          }

          const dataIndexId = getDataIndexId(dataIndex);

          /** 最小宽度没有指定，则和用户指定的 默认宽度 一致 */
          const minWidth = mergedSettings.minWidth ?? mergedSettings.defaultWidth ?? DEFAULT_WIDTH;

          // const defaultWidth =
          //   tableCoreActionsRef.current.getLocalColumnWidth()?.[dataIndexId] ??
          //   mergedSettings.defaultWidth ??
          //   DEFAULT_WIDTH;
          const defaultWidth = mergedSettings.defaultWidth ?? DEFAULT_WIDTH;

          if (search) {
            enableSearchFormRef.current = true;

            if (typeof search === 'object' && search.transform) {
              searchTransfromMapDataIndexIdRef.current[dataIndexId] = search.transform;
            }

            const tableExtraSettings: (keyof Required<OSTableFormFieldItemExtra>['settings'])[] = [
              'editable',
              'search',
              'sorter',
            ];
            searchFormFieldItemsRef.current.push({
              settings: utl.omit(mergedSettings, tableExtraSettings),
              requests: _requests,
              dependencies,
              type: valueType,
            } as OSFormFieldItemWithStaticPureConfigs);

            if (search === 'only' || (typeof search === 'object' && search.type === 'only'))
              return null;
          }

          if (
            valueType === 'select' &&
            _requests?.requestOptions &&
            !(mergedSettings as OSSelectFieldType['settings'])?.showSearch
          ) {
            searchRequestOptionsMapDataIndexIdRef.current[dataIndexId] =
              _requests.requestOptions as RequiredRecursion<OSSelectFieldType>['requests']['requestOptions'];
          }

          const colId = fieldItem.key || dataIndexId || mergedSettings?.title;

          if (colId) {
            columnsStaticPureConfigsIdMapsRef.current[colId] =
              // eslint-disable-next-line no-multi-assign, no-param-reassign
              propsColumnsStaticPureConfigsIdMapsRef.current[colId] = {
                type: valueType,
                settings: mergedSettings,
                requests: _requests,
              } as OSTableFormFieldItemWithStaticPureConfigs;
          }

          if (hide) {
            return null;
          }

          if (valueType === 'group' && fieldItem.children) {
            const key = fieldItem.key || mergedSettings?.title;

            const columnGroup = {
              title: mergedSettings?.title,
              align: 'left',
              key,
              onHeaderCell: () => {
                return {
                  className: `${clsPrefix}-group-header`,
                };
              },
              children: renderItems(
                fieldItem.children,
                // {
                //   parentFieldItems: fieldItems_,
                //   parentIsLast: fieldItemIndex === fieldItems_.length - 1,
                // }
              ),
            } as ColumnGroupType<RecordType>;

            if (key) {
              propsAllColumnsIdRef.current.push(key);
              allColumnsIdMapsRef.current[key] = columnGroup;
            }

            return {
              headerName: mergedSettings.title,
              children: columnGroup.children,
            } as ColGroupDef;
          }

          propsAllColumnsIdRef.current.push(dataIndexId);

          /** 汇总表格宽度 */
          totalTableWidthRef.current += defaultWidth;

          const defaultCol: ColumnType<RecordType> = {
            fixed,
            defaultSortOrder,
            key: dataIndexId,
            width: defaultWidth,
            /** 排序的话增加 5 px 右距 */
            title,
            dataIndex,
            sorter: mergedSettings?.sorter,
            ellipsis: ellipsisTooltip
              ? {
                  showTitle: false,
                }
              : true,
            onCell: (data, index) => {
              const dataIndexIdStr = getDataIndexId(
                runTableSettings(mergedSettings, {
                  form: tableWrapForm,
                  rowData: data,
                  rowIndex: index,
                  rowId: data[rowKey],
                  actions: tableActionsRef.current,
                })?.dataIndex,
                '-',
              );
              return {
                'data-data-index': dataIndexIdStr,
                className: cls(
                  tdSelfClassTag,
                  `${clsPrefix}-table-cell`,
                  `${verticalRowCellWithKeyClsPrefix}-${dataIndexIdStr}`,
                ),
              };
            },
          };

          const column = utl.flow([
            handleAlign({
              valueType,
              align: mergedSettings?.align,
              title,
            }),
            handleHighlight({
              highlight: mergedSettings?.highlight,
            }),
            handleTooltip({
              linkagetip: mergedSettings?.linkagetip,
              tooltip: mergedSettings?.tooltip,
              rules: mergedSettings?.rules,
            }),
            handleEditable({
              editable,
              valueType,
              settings: fieldItem.settings,
              requests: fieldItem.requests,
              dependencies,
              dataIndex,
              render: fieldItem.render,
            }),
          ])(defaultCol);

          allColumnsIdMapsRef.current[dataIndexId] = column;

          return {
            headerName: mergedSettings.title,
            field: column.dataIndex,
            cellRenderer: 'field-renderer',
            cellRendererParams: {
              columnConfigs: column,
            },
            pinned: mergedSettings.fixed,
            rowGroup: mergedSettings.rowGroup,
            type: valueType && ['digit', 'money'].includes(valueType) ? 'rightAligned' : undefined,
            minWidth,
            maxWidth: mergedSettings.maxWidth,
          } as ColDef;
        })
        .filter(Boolean) as (ColDef | ColGroupDef)[] | undefined) ?? []
    );
  };

  const actionsRef = useActionsRef({
    renderItems,
    resetIntermediateProducts,
  });

  const columnDefs = useMemo(() => {
    actionsRef.current.resetIntermediateProducts();

    return actionsRef.current.renderItems(getFieldItems ? getFieldItems(fieldItems) : fieldItems);
  }, [actionsRef, fieldItems, getFieldItems]);

  return {
    columnDefs,
    enableCellHighlight: enableCellHighlightRef.current,
    searchRequestOptionsMapDataIndexId: searchRequestOptionsMapDataIndexIdRef.current,
    searchTransfromMapDataIndexId: searchTransfromMapDataIndexIdRef.current,
    totalTableWidth: totalTableWidthRef.current,
    allColumnsIdMaps: allColumnsIdMapsRef.current,
    columnsStaticPureConfigsIdMaps: columnsStaticPureConfigsIdMapsRef.current,
    searchFormFieldItems: searchFormFieldItemsRef.current,
    enableSearchForm: enableSearchFormRef.current,
    enableColumnsSettings: enableColumnsSettingsRef.current,
  };
};
