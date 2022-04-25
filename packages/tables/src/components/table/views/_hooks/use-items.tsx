import { InfoCircleOutlined, QuestionCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { renderField } from '@ty-one-start/fields';
import {
  mergeRuleToTooltip,
  normalizeTooltip,
  renderTableFormItem,
} from '@ty-one-start/form-items';
import type {
  OSTableFormFieldItemWithStaticPureConfigsWithChildren,
  RequestDataSourceActions,
  SearchFormAPI,
} from '@ty-one-start/tables';
import type {
  OSFieldBaseSettings,
  OSFormFieldItem,
  OSFormFieldItems,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormItemSimpleTooltip,
  OSFormItemType,
  OSRule,
  OSSelectFieldType,
  OSTableAPI,
  OSTableCellMeta,
  OSTableFormFieldItemExtra,
  OSTableFormFieldItemRender,
  OSTableFormFieldItems,
  OSTableFormFieldItemSearchType,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableType,
  OSTextFieldType,
  RecordType,
  RenderFieldOptions,
  RequiredRecursion,
  TableCoreAPI,
} from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import type { FormInstance } from 'antd';
import { Space, Tooltip } from 'antd';
import type { Rule } from 'antd/lib/form';
import type { ColumnGroupType, ColumnsType, ColumnType } from 'antd/lib/table';
import cls from 'classnames';
import utl from 'lodash';
import React, { useMemo, useRef } from 'react';
import type { ResizeableHeaderCellProps } from '../../components/resizeable-header-cell';
import {
  DEFAULT_WIDTH,
  headerCellWithKeyClsPrefix,
  searchHeadFormFieldRowId,
  tdSelfClassTag,
  verticalRowCellWithKeyClsPrefix,
} from '../../constants';
import { runTableSettings } from '../../utils';
import { getDataIndexId, getKeyIndexId } from '@ty-one-start/utils';
import { getColEditable } from '../../utils/get-col-editable';
import type { SearchRequestOptionsMapColIdType } from '../_typeings';

/** 中间产物 */
const useIntermediateProducts = ({ reset }: { reset?: () => void }) => {
  const searchRequestOptionsMapColIdRef = useRef<SearchRequestOptionsMapColIdType>({});

  const searchTransfromMapDataIndexIdRef = useRef<
    Record<string, Required<OSTableFormFieldItemSearchType>['transform']>
  >({});

  /** 表格的总宽度 */
  const totalTableWidthRef = useRef<number>(0);

  // @TODO: allColumnsIdRef 删除，staticPureConfigsFieldItemsRef 改为 id 结构数组，只保留 fieldItem 和 antd 2个静态 maps

  /**
   * 所有 column 的 id
   */
  const allColumnsIdRef = useRef<string[]>([]);

  /** 所有 column 的 antd 静态配置和 id 的 map */
  const columnsPropsIdMapsRef = useRef<
    Record<string, ColumnGroupType<RecordType> | ColumnType<RecordType>>
  >({});

  /** 所有 column 的 os 配置和 id 的 map */
  const columnsStaticPureConfigsIdMapsRef = useRef<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >({});

  /** 保留 fieldItems 树形结构的静态 fieldItems */
  const staticPureConfigsFieldItemsRef =
    useRef<OSTableFormFieldItemWithStaticPureConfigsWithChildren>([]);

  /** 是否启用了表单搜索 */
  const enableSearchFormRef = useRef<boolean>(false);

  /** 是否启用了高亮设置 */
  const enableCellHighlightRef = useRef<boolean>(false);

  /** 是否启用了列设置 */
  const enableColumnsSettingsRef = useRef<boolean>(false);

  const resetIntermediateProducts = () => {
    searchRequestOptionsMapColIdRef.current = {};
    searchTransfromMapDataIndexIdRef.current = {};
    totalTableWidthRef.current = 0;
    allColumnsIdRef.current = [];
    columnsPropsIdMapsRef.current = {};
    columnsStaticPureConfigsIdMapsRef.current = {};
    enableSearchFormRef.current = false;
    enableColumnsSettingsRef.current = false;
    enableCellHighlightRef.current = false;
    staticPureConfigsFieldItemsRef.current = [];

    reset?.();
  };

  return {
    searchRequestOptionsMapColIdRef,
    searchTransfromMapDataIndexIdRef,
    totalTableWidthRef,
    allColumnsIdRef,
    columnsPropsIdMapsRef,
    columnsStaticPureConfigsIdMapsRef,
    resetIntermediateProducts,
    enableSearchFormRef,
    enableColumnsSettingsRef,
    enableCellHighlightRef,
    staticPureConfigsFieldItemsRef,
  };
};

export const useItems = ({
  fieldItems,
  tableWrapForm,
  clsPrefix,
  editableRowKeys,
  rowKey,
  extraValueTypes,
  searchFormRef,
  tableCoreActionsRef,
  tableWrapRef,
  tableWrapFormRef,
  tableActionsRef,
  getFieldItems,
  requestDataSourceActionsRef,
  fieldItemSettings,
  allColumnsIdRef: propsAllColumnsIdRef,
  columnsStaticPureConfigsIdMapsRef: propsColumnsStaticPureConfigsIdMapsRef,
  searchFormFieldItemsRef,
  enableEditedCellDiffValueState,
  isEditableTable,
}: {
  searchFormFieldItemsRef: React.MutableRefObject<OSFormFieldItems>;
  tableWrapFormRef: React.RefObject<FormInstance>;
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
  extraValueTypes: Record<string, (options: RenderFieldOptions) => React.ReactNode>;
  searchFormRef: React.RefObject<SearchFormAPI | null>;
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  tableWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  enableEditedCellDiffValueState?: Required<OSTableType>['settings']['enableEditedCellDiffValueState'];
  getFieldItems?: OSTableType['getFieldItems'];
  isEditableTable?: boolean;
}) => {
  const {
    searchRequestOptionsMapColIdRef,
    searchTransfromMapDataIndexIdRef,
    totalTableWidthRef,
    allColumnsIdRef,
    columnsPropsIdMapsRef,
    columnsStaticPureConfigsIdMapsRef,
    enableSearchFormRef,
    enableColumnsSettingsRef,
    enableCellHighlightRef,
    staticPureConfigsFieldItemsRef,
    resetIntermediateProducts,
  } = useIntermediateProducts({
    reset: () => {
      // eslint-disable-next-line no-param-reassign
      propsAllColumnsIdRef.current = [];
      // eslint-disable-next-line no-param-reassign
      propsColumnsStaticPureConfigsIdMapsRef.current = {};
      // eslint-disable-next-line no-param-reassign
      searchFormFieldItemsRef.current = [];
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
      colId,
    }: {
      colId: string;
      editable?: Required<OSTableFormFieldItemExtra>['settings']['editable'];
      valueType?: OSTableFormFieldItems[number]['type'];
      settings?: OSTableFormFieldItems[number]['settings'];
      render?: OSTableFormFieldItemRender;
      requests?: OSTableFormFieldItems[number]['requests'];
      dependencies?: OSFormFieldItem['dependencies'];
      dataIndex?: Required<OSFormItemType>['settings']['dataIndex'];
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      return {
        ...col_,
        onCell: (data, index) => {
          const colEditable = getColEditable({
            rowData: data,
            rowIndex: index ?? -1,
            editable,
            editableRowKeys,
            rowKey,
          });
          const prev = col_.onCell?.(data, index);
          return {
            ...prev,
            editable,
            rowData: data,
            rowIndex: index,
            rowId: data[rowKey],
            colId,
            enableEditedCellDiffValueState,
            className: cls(
              prev?.className,
              [clsPrefix, colEditable ? 'cell-editing' : ''].filter(Boolean).join('-'),
            ),
          };
        },
        render: (val, rowData, rowIndex) => {
          const cellMeta: OSTableCellMeta = {
            rowId: rowData[rowKey],
            rowIndex,
            rowData,
            dataIndex,
          };

          const colEditable = getColEditable({
            rowData,
            rowIndex,
            editable,
            editableRowKeys,
            rowKey,
          });

          if (colEditable) {
            const dom = renderTableFormItem(valueType, settings, requests ?? {}, {
              dataSource: tableActionsRef.current.getDataSource(),
              rowData,
              rowIndex,
              rowId: rowData[rowKey],
              actions: tableActionsRef.current,
              dependencies,
              defaultSettings: {
                ...fieldItemSettings,
                inlineError: true,
              },
              getExtraSettings: (
                staticFormItemSettings: OSTableFormFieldItemWithStaticPureConfigs['settings'],
              ) => {
                return {
                  ...staticFormItemSettings,
                  formItemId: staticFormItemSettings?.formItemId
                    ? `${staticFormItemSettings.formItemId}-edit-${rowIndex}`
                    : undefined,
                };
              },
              getField: (
                staticFieldSettings,
                staticFieldRequests,
                staticFormItemSettings,
                staticFormItemRequests,
                options,
              ) => {
                return renderField(
                  colEditable ? 'edit' : 'read',
                  valueType,
                  {
                    ...staticFieldSettings,
                    bordered: false,
                    /** 应该必须配合 type 才能出 OSFieldBaseSettings 类型，这样 as 一下  */
                    id: (staticFieldSettings as OSFieldBaseSettings)?.id
                      ? `${(staticFieldSettings as OSFieldBaseSettings).id}-edit-${rowIndex}`
                      : undefined,
                    ...(() => {
                      if (valueType === 'select' && requests?.requestOptions) {
                        const data = requestDataSourceActionsRef.current?.getFieldOptionsMapColId();
                        const runtimeColId = getKeyIndexId(
                          staticFieldSettings?.key ||
                            staticFormItemSettings?.dataIndex ||
                            staticFormItemSettings?.title,
                        );
                        return {
                          valueEnums: data?.[runtimeColId],
                        } as OSSelectFieldType['settings'];
                      }
                      return {};
                    })(),
                  },
                  staticFieldRequests,
                  {
                    types: extraValueTypes,
                    props: options?.props,
                    ref: options?.ref,
                    formRef: tableWrapFormRef,
                    cellMeta,
                    isWrapFormItem: true,
                    wrapFormType: 'table-form',
                    autoFetchSelectOptions: !!isEditableTable,
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

          const renderCellDom = () => {
            const dom = renderField(
              'read',
              valueType,
              {
                ...fieldItemSettings,
                ...staticFieldSettings,
                bordered: false,
                id: (staticFieldSettings as OSFieldBaseSettings)?.id
                  ? `${(staticFieldSettings as OSFieldBaseSettings).id}-read-${rowIndex}`
                  : undefined,
                ...(() => {
                  /**
                   * 当字符串搜索字段存在，高亮显示
                   */
                  const isSearchAndShow = () => {
                    if (staticFieldSettings?.search) {
                      if (typeof staticFieldSettings?.search === 'object') {
                        return staticFieldSettings?.search.type !== 'only';
                      }
                      return staticFieldSettings?.search !== 'only';
                    }
                    return false;
                  };

                  if (valueType === 'text' && isSearchAndShow()) {
                    const searchs = searchFormRef.current?.getSearchFormDataSource?.();
                    return {
                      searchValue: searchs?.[getDataIndexId(staticFieldSettings?.dataIndex)],
                    } as OSTextFieldType['settings'];
                  }

                  if (valueType === 'select' && requests?.requestOptions) {
                    const data = requestDataSourceActionsRef.current?.getFieldOptionsMapColId();
                    return {
                      valueEnums: data?.[colId],
                    } as OSSelectFieldType['settings'];
                  }

                  return {};
                })(),
              },
              requests,
              {
                types: extraValueTypes,
                text: dataIndex ? utl.get(rowData, dataIndex) : undefined,
                autoFetchSelectOptions: !!isEditableTable,
                formRef: tableWrapFormRef,
                cellMeta,
                wrapFormType: 'table-form',
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

          let cellDom = renderCellDom();

          if (staticFieldSettings?.ellipsisTooltip) {
            cellDom =
              val != null ? (
                <Tooltip
                  title={(() => {
                    if (valueType === 'select' && requests?.requestOptions) {
                      const data = requestDataSourceActionsRef.current?.getFieldOptionsMapColId();

                      return val != null
                        ? (Array.isArray(val) ? val : [val])
                            .map((item: string) => data![colId][item])
                            .join(', ')
                        : undefined;
                    }

                    return val;
                  })()}
                  placement="topLeft"
                >
                  <span
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {cellDom}
                  </span>
                </Tooltip>
              ) : (
                '--'
              );
          }

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
      editable,
    }: {
      editable?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['editable'];
      valueType?: OSTableFormFieldItems[number]['type'];
      align?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['align'];
      title?: React.ReactNode;
    }) =>
    (col_: ColumnType<RecordType>): ColumnType<RecordType> => {
      const colEditable = getColEditable({
        editable,
        editableRowKeys,
        rowKey,
      });

      const align_ = (() => {
        if (colEditable) {
          return 'left';
        }
        if (align) {
          return align;
        }
        if (valueType) {
          if (['digit', 'money'].includes(valueType)) {
            return 'right';
          }
          if (['select', 'date', 'date-range', 'switch'].includes(valueType)) {
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
    options?: {
      parentFieldItems?: OSTableFormFieldItems;
      /** 父节点是不是同级别最后一个节点 */
      parentIsLast: boolean;
      parentStaticPureConfigsFieldItem?: OSTableFormFieldItemWithStaticPureConfigs & {
        children: OSTableFormFieldItemWithStaticPureConfigs[];
      };
    },
  ): ColumnsType<RecordType> => {
    const { parentIsLast, parentFieldItems } = options ?? {};
    return (
      (fieldItems_
        ?.map((fieldItem, fieldItemIndex) => {
          const { type: valueType, requests: _requests, dependencies } = fieldItem;

          const _settings = runTableSettings(fieldItem.settings, {
            dataSource: tableActionsRef.current.getDataSource(),
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
            resizeable,
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

          const colId = getKeyIndexId(
            fieldItem.key || mergedSettings.dataIndex || mergedSettings?.title,
          );

          /** 最小宽度没有指定，则和用户指定的 默认宽度 一致 */
          const minWidth = mergedSettings.minWidth ?? mergedSettings.defaultWidth ?? DEFAULT_WIDTH;

          const defaultWidth =
            tableCoreActionsRef.current.getLocalColumnWidth()?.[dataIndexId] ??
            mergedSettings.defaultWidth ??
            DEFAULT_WIDTH;

          if (search) {
            enableSearchFormRef.current = true;

            if (typeof search === 'object' && search.transform) {
              searchTransfromMapDataIndexIdRef.current[dataIndexId] = search.transform;
            }

            searchFormFieldItemsRef.current.push({
              settings: fieldItem.settings,
              requests: _requests,
              dependencies,
              type: valueType,
            } as OSFormFieldItemWithStaticPureConfigs);

            if (search === 'only' || (typeof search === 'object' && search.type === 'only'))
              return null;
          }

          if (valueType === 'select' && _requests?.requestOptions) {
            const showSearch = (mergedSettings as OSSelectFieldType['settings'])?.showSearch;
            const showSearchType = (() => {
              if (showSearch) {
                return showSearch === 'local' ? 'local' : 'remote';
              }
              return undefined;
            })();
            searchRequestOptionsMapColIdRef.current[colId] = {
              enableShowSearch: !!showSearch,
              showSearchType,
              dataIndexId,
              request:
                _requests.requestOptions as RequiredRecursion<OSSelectFieldType>['requests']['requestOptions'],
            };
          }

          if (colId) {
            columnsStaticPureConfigsIdMapsRef.current[colId] =
              // eslint-disable-next-line no-multi-assign, no-param-reassign
              propsColumnsStaticPureConfigsIdMapsRef.current[colId] = {
                type: valueType,
                settings: mergedSettings,
                requests: _requests,
              } as OSTableFormFieldItemWithStaticPureConfigs;
          }

          const staticPureConfigsFieldItem = {
            type: valueType,
            settings: mergedSettings,
            requests: _requests,
          } as OSTableFormFieldItemWithStaticPureConfigsWithChildren[number];

          /** 如果存在父级静态配置，则往父级 children 里面塞，否则就是第一层 */
          if (options?.parentStaticPureConfigsFieldItem) {
            if (options.parentStaticPureConfigsFieldItem.children) {
              options.parentStaticPureConfigsFieldItem.children.push(staticPureConfigsFieldItem);
            } else {
              // eslint-disable-next-line no-param-reassign
              options.parentStaticPureConfigsFieldItem.children = [staticPureConfigsFieldItem];
            }
          } else {
            staticPureConfigsFieldItemsRef.current.push(staticPureConfigsFieldItem);
          }

          if (hide) {
            return null;
          }

          if (valueType === 'group' && fieldItem.children) {
            const columnGroup = {
              title: mergedSettings?.title,
              align: 'left',
              key: colId,
              onHeaderCell: () => {
                return {
                  className: `${clsPrefix}-group-header`,
                };
              },
              children: renderItems(fieldItem.children, {
                parentFieldItems: fieldItems_,
                parentIsLast: fieldItemIndex === fieldItems_.length - 1,
                parentStaticPureConfigsFieldItem: staticPureConfigsFieldItem,
              }),
            } as ColumnGroupType<RecordType>;

            if (colId) {
              allColumnsIdRef.current.push(colId);
              propsAllColumnsIdRef.current.push(colId);
              columnsPropsIdMapsRef.current[colId] = columnGroup;
            }

            return columnGroup;
          }

          allColumnsIdRef.current.push(dataIndexId);
          propsAllColumnsIdRef.current.push(dataIndexId);

          /** 汇总表格宽度 */
          totalTableWidthRef.current += defaultWidth;

          const defaultCol: ColumnType<RecordType> = {
            shouldCellUpdate: (record, prevRecord) => {
              if (mergedSettings?.shouldCellUpdate) {
                return mergedSettings.shouldCellUpdate(record, prevRecord);
              }
              const rowEditable = editableRowKeys ? editableRowKeys.includes(record[rowKey]) : true;
              const colEditable =
                editable === true || (typeof editable === 'function' && editable(record));
              if (colEditable && rowEditable) {
                return record[rowKey] !== prevRecord[rowKey];
              }
              return true;
            },
            fixed,
            defaultSortOrder,
            key: colId,
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
            onHeaderCell: (data, index): ResizeableHeaderCellProps => {
              return {
                className: cls(
                  `${clsPrefix}-column-header`,
                  `${headerCellWithKeyClsPrefix}-${getDataIndexId(
                    runTableSettings(mergedSettings, {
                      form: tableWrapForm,
                      rowData: data,
                      rowIndex: index ?? -1,
                      rowId: searchHeadFormFieldRowId,
                      actions: tableActionsRef.current,
                    })?.dataIndex,
                    '-',
                  )}`,
                ),
                minColumnWidth: minWidth,
                tableWrapRef,
                colDefaultWidth: defaultWidth,
                resizeable,
                tableCoreActionsRef,
                columnKey: dataIndexId,
                last:
                  fieldItemIndex === fieldItems_.length - 1 &&
                  (parentFieldItems ? parentIsLast : true),
              };
            },
          };

          const column = utl.flow([
            handleAlign({
              valueType,
              align: mergedSettings?.align,
              title,
              editable: mergedSettings.editable,
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
              colId,
              editable,
              valueType,
              settings: fieldItem.settings,
              requests: fieldItem.requests,
              dependencies,
              dataIndex,
              render: fieldItem.render,
            }),
          ])(defaultCol);

          columnsPropsIdMapsRef.current[colId] = column;

          return column;
        })
        .filter(Boolean) as ColumnsType<RecordType> | undefined) ?? []
    );
  };

  const actionsRef = useActionsRef({
    renderItems,
    resetIntermediateProducts,
  });

  const columns = useMemo(() => {
    actionsRef.current.resetIntermediateProducts();

    return actionsRef.current.renderItems(getFieldItems ? getFieldItems(fieldItems) : fieldItems);
  }, [actionsRef, fieldItems, getFieldItems]);

  return {
    columns,
    enableCellHighlight: enableCellHighlightRef.current,
    searchRequestOptionsMapColIdRef: searchRequestOptionsMapColIdRef.current,
    searchTransfromMapDataIndexId: searchTransfromMapDataIndexIdRef.current,
    totalTableWidth: totalTableWidthRef.current,
    allColumnsId: allColumnsIdRef.current,
    columnsPropsIdMaps: columnsPropsIdMapsRef.current,
    columnsStaticPureConfigsIdMaps: columnsStaticPureConfigsIdMapsRef.current,
    searchFormFieldItems: searchFormFieldItemsRef.current,
    enableSearchForm: enableSearchFormRef.current,
    enableColumnsSettings: enableColumnsSettingsRef.current,
    staticPureConfigsFieldItems: staticPureConfigsFieldItemsRef.current,
  };
};
