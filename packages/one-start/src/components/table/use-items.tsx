import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { FormInstance } from '@ty/antd';
import { Button, Col, Divider, Row, Space, Tooltip, Typography } from '@ty/antd';
import type { NamePath } from '@ty/antd/lib/form/interface';
import type { ColumnGroupType, ColumnsType, ColumnType } from '@ty/antd/lib/table';
import cls from 'classnames';
import utl from 'lodash';
import type { Rule } from 'rc-field-form/lib/interface';
import React, { createRef, useMemo, useRef } from 'react';
import { mergeRuleToTooltip, normalizeTooltip } from '../form-items/utils';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  OSFieldAPI,
  OSFormFieldItem,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormItemSimpleTooltip,
  OSFormItemType,
  OSOpenableFieldBaseAPI,
  OSRule,
  OSTextFieldType,
  OSSelectFieldType,
  OSTableAPI,
  OSTableFormFieldItemExtra,
  OSTableFormFieldItemRender,
  OSTableFormFieldItems,
  OSTableFormFieldItemSearchType,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableType,
  OSTextFieldAPI,
  RecordType,
  RenderFieldOptions,
  TableCoreActions,
} from '../../typings';
import { renderField } from '../utils/render-field';
import { renderTableFormItem } from '../utils/render-table-form-item';
import type { RequiredRecursion } from '../../typings';
import type { ResizeableHeaderCellProps } from './components/resizeable-header-cell';
import {
  DEFAULT_WIDTH,
  eventNames,
  headerCellWithKeyClsPrefix,
  searchFixedIconCls,
  searchHeadFormFieldRowId,
  searchHeadFormFieldRowIdOverlay,
  searchHeadFormSwitchIsOpenMarkId,
  tdSelfClassTag,
  verticalRowCellWithKeyClsPrefix,
} from './constants';
import type { EventPayloads, RequestDataSourceActions, SearchFormActions } from './typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';
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

  /** 所有 column 的 id */
  const allColumnsIdRef = useRef<string[]>([]);

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
    allColumnsIdRef.current = [];
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
    allColumnsIdRef,
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
  snapshotOfCurrentSearchParametersRef,
  extraValueTypes,
  searchFormActionsRef,
  tableCoreActionsRef,
  tableWrapRef,
  tableActionsRef,
  getFieldItems,
  requestDataSourceActionsRef,
  fieldItemSettings,
  allColumnsIdRef: propsAllColumnsIdRef,
  columnsStaticPureConfigsIdMapsRef: propsColumnsStaticPureConfigsIdMapsRef,
}: {
  tableKey?: string;
  fieldItems?: OSTableFormFieldItems;
  fieldItemSettings?: RequiredRecursion<OSTableType>['settings']['fieldItemSettings'];
  tableWrapForm: FormInstance;
  clsPrefix: string;
  allColumnsIdRef: React.MutableRefObject<string[]>;
  columnsStaticPureConfigsIdMapsRef: React.MutableRefObject<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >;
  snapshotOfCurrentSearchParametersRef: React.MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  editableRowKeys?: RequiredRecursion<OSTableType>['settings']['editableRowKeys'];
  rowKey: RequiredRecursion<OSTableType>['settings']['rowKey'];
  searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
  extraValueTypes: Record<string, (options: RenderFieldOptions) => React.ReactNode>;
  searchFormActionsRef: React.MutableRefObject<Partial<SearchFormActions>>;
  tableCoreActionsRef: React.MutableRefObject<TableCoreActions>;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  tableWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  getFieldItems?: OSTableType['getFieldItems'];
}) => {
  const {
    searchRequestOptionsMapDataIndexIdRef,
    searchTransfromMapDataIndexIdRef,
    searchFormFieldItemsRef,
    totalTableWidthRef,
    allColumnsIdRef,
    allColumnsIdMapsRef,
    columnsStaticPureConfigsIdMapsRef,
    enableSearchFormRef,
    enableColumnsSettingsRef,
    enableCellHighlightRef,
    resetIntermediateProducts,
  } = useIntermediateProducts({
    reset: () => {
      // eslint-disable-next-line no-param-reassign
      propsAllColumnsIdRef.current = [];
      // eslint-disable-next-line no-param-reassign
      propsColumnsStaticPureConfigsIdMapsRef.current = {};
    },
  });

  const handleFilter =
    ({
      dataIndex,
      valueType,
      settings,
      requests,
      search,
      dependencies,
    }: {
      dataIndex?: NamePath;
      valueType?: OSTableFormFieldItems[number]['type'];
      settings?: OSTableFormFieldItems[number]['settings'];
      requests?: OSTableFormFieldItems[number]['requests'];
      search?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['search'];
      dependencies?: OSFormFieldItem['dependencies'];
    }) =>
    (col: ColumnType<RecordType>): ColumnType<RecordType> => {
      if (!search) return col;

      const inputRef = createRef<OSFieldAPI>();

      const dropdownEventHandlerRef: {
        current?: (payload: EventPayloads['SwitchedSearchForm']) => void;
      } = {};

      const renderFilterTitle = () => {
        if (dataIndex) {
          return (
            <Typography.Text italic key="search-item-value">
              {renderTableFormItem(
                valueType,
                (options) => {
                  const { form } = options;
                  const staticSettings =
                    typeof settings === 'function' ? settings(options) : settings;
                  if (
                    form.getFieldValue(searchHeadFormFieldRowId)?.[getDataIndexId(dataIndex)] ==
                      null ||
                    form.getFieldValue(searchHeadFormSwitchIsOpenMarkId) === true
                  ) {
                    return {
                      hide: true,
                      dataIndex: staticSettings?.dataIndex,
                    };
                  }
                  return {
                    ...staticSettings,
                    labelCol: { span: 0 },
                    wrapperCol: { span: 24 },
                  };
                },
                requests ?? {},
                {
                  dependencies: [
                    ...(dependencies ?? []),
                    searchHeadFormSwitchIsOpenMarkId,
                    searchHeadFormFieldRowId,
                  ],
                  rowData: {},
                  rowIndex: -1,
                  rowId: searchHeadFormFieldRowId,
                  actions: tableActionsRef.current,
                  getField: (staticFieldSettings, staticFieldRequests) => {
                    return renderField(
                      'read',
                      valueType,
                      staticFieldSettings,
                      staticFieldRequests,
                      {
                        types: extraValueTypes,
                      },
                    );
                  },
                  renderFormItem: (dom) => {
                    return (
                      <Space size={5} style={{ paddingLeft: 5 }}>
                        <span>=</span>
                        {dom}
                      </Space>
                    );
                  },
                },
              )}
            </Typography.Text>
          );
        }
        return null;
      };

      return {
        ...col,
        title: (
          <span style={{ paddingRight: col.align === 'right' && col.sorter ? 5 : 0 }}>
            {col.title}
            {renderFilterTitle()}
          </span>
        ),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              if (valueType === 'digit' || valueType === 'money' || valueType === 'percent') {
                (inputRef.current as HTMLInputElement)?.select();
              }
              if (valueType === 'select' || valueType === 'date') {
                (inputRef.current as OSOpenableFieldBaseAPI)?.open();
                (inputRef.current as HTMLInputElement)?.focus();
              }
              // 临时不 open
              if (valueType === 'date-range') {
                (inputRef.current as HTMLInputElement)?.focus();
              }
              if (valueType === 'text') {
                (inputRef.current as OSTextFieldAPI)?.focus({
                  cursor: 'all',
                });
              }
            });
          }
        },
        /** 触发时机为 table 更新的时候 */
        filterIcon: () => {
          const value =
            tableWrapForm.getFieldValue(searchHeadFormFieldRowId)?.[getDataIndexId(dataIndex)];
          return (
            <SearchOutlined
              className={searchFixedIconCls}
              style={{
                fontSize: 14,
                color: value ? '#1890ff' : undefined,
              }}
            />
          );
        },
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          if (dropdownEventHandlerRef.current) {
            tableCoreActionsRef.current.off(
              eventNames.switchedSearchForm,
              dropdownEventHandlerRef.current,
            );
          }

          dropdownEventHandlerRef.current = (payload: EventPayloads['SwitchedSearchForm']) => {
            if (payload.open === false) {
              const value_ =
                snapshotOfCurrentSearchParametersRef.current.search[getDataIndexId(dataIndex)];

              /** TODO: 待测试，非 string 类型的值能不能存储 */
              // 同步 filterValue 的值，以正确执行 confirm 后的行为
              setSelectedKeys(value_ == null ? [] : [value_ as string]);
            }
          };

          tableCoreActionsRef.current.on(
            eventNames.switchedSearchForm,
            dropdownEventHandlerRef.current,
          );

          /** 编辑暂停后，触发搜索 */
          const triggerRequest = () => {
            const value_ =
              snapshotOfCurrentSearchParametersRef.current.search[getDataIndexId(dataIndex)];

            /** TODO: 待测试，非 string 类型的值能不能存储 */
            setSelectedKeys(value_ == null ? [] : [value_ as string]);

            // confirm({
            //   closeDropdown: false,
            // });
            confirm();
          };

          const fieldItemDom = renderTableFormItem(
            valueType,
            {
              ...settings,
              bordered: false,
              autoFocus: true,
              initialValue: selectedKeys[0],
              styles: {
                minHeight: undefined,
                padding: '0 5px',
              },
              labelCol: {
                span: 0,
              },
              wrapperCol: {
                span: 24,
              },
            },
            requests ?? {},
            {
              formItemClassName: `${clsPrefix}-filter-dropdown-form-item`,
              rowId: searchHeadFormFieldRowIdOverlay,
              actions: tableActionsRef.current,
              getField: (staticFieldSettings, staticFieldRequests) => {
                return renderField('edit', valueType, staticFieldSettings, staticFieldRequests, {
                  ref: inputRef,
                  onChangeHook: (value_) => {
                    searchFormActionsRef.current.setSearchFormValues?.(
                      {
                        [getDataIndexId(dataIndex)]: value_,
                      },
                      {
                        updateOverlay: false,
                      },
                    );
                  },
                  types: extraValueTypes,
                });
              },
            },
          );

          return (
            <div
              style={{ position: 'relative', padding: '0 4px 0 4px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  triggerRequest();
                }
              }}
            >
              {fieldItemDom}
              <Divider style={{ margin: 0 }} />
              <Row>
                <Col flex={'auto'}>
                  <Button
                    style={{ fontSize: 12 }}
                    size="small"
                    block
                    type="text"
                    onClick={() => {
                      searchFormActionsRef.current.setSearchFormValues?.({
                        [getDataIndexId(dataIndex)]: undefined,
                      });
                      triggerRequest();
                    }}
                  >
                    重置
                  </Button>
                </Col>
                <Col>
                  <Divider type="vertical" />
                </Col>
                <Col flex={'auto'}>
                  <Button
                    style={{ fontSize: 12 }}
                    size="small"
                    type="link"
                    block
                    onClick={() => {
                      triggerRequest();
                    }}
                  >
                    搜索
                  </Button>
                </Col>
              </Row>
            </div>
          );
        },
      };
    };

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
        render: (val, rowData, rowIndex) => {
          const colEditable = getColEditable(rowData, rowIndex);

          if (colEditable) {
            const dom = renderTableFormItem(valueType, settings, requests ?? {}, {
              dataSource: tableActionsRef.current.getDataSource(),
              rowData,
              rowIndex,
              rowId: rowData[rowKey],
              actions: tableActionsRef.current,
              dependencies,
              defaultSettings: fieldItemSettings,
              getField: (staticFieldSettings, staticFieldRequests, __, ___, options) => {
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
                    props: options?.props,
                    ref: options?.ref,
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
                    const searchs = searchFormActionsRef.current?.getSearchFormDataSource?.();
                    return {
                      searchValue: searchs?.[getDataIndexId(staticFieldSettings?.dataIndex)],
                    } as OSTextFieldType['settings'];
                  }

                  if (valueType === 'select' && requests?.requestOptions) {
                    const data = requestDataSourceActionsRef.current?.getFieldOptionsMapDataIndex();
                    const id = getDataIndexId(staticFieldSettings?.dataIndex);
                    return {
                      valueEnums: data?.[id],
                    } as OSSelectFieldType['settings'];
                  }

                  return {};
                })(),
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

          let cellDom = renderCellDom();

          if (staticFieldSettings?.ellipsisTooltip) {
            cellDom =
              val != null ? (
                <Tooltip
                  title={(() => {
                    if (valueType === 'select' && requests?.requestOptions) {
                      const data =
                        requestDataSourceActionsRef.current?.getFieldOptionsMapDataIndex();
                      const id = getDataIndexId(staticFieldSettings?.dataIndex);

                      return val != null
                        ? (Array.isArray(val) ? val : [val])
                            .map((item: string) => data![id][item])
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
              children: renderItems(fieldItem.children, {
                parentFieldItems: fieldItems_,
                parentIsLast: fieldItemIndex === fieldItems_.length - 1,
              }),
            } as ColumnGroupType<RecordType>;

            if (key) {
              allColumnsIdRef.current.push(key);
              propsAllColumnsIdRef.current.push(key);
              allColumnsIdMapsRef.current[key] = columnGroup;
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
            }),
            handleHighlight({
              highlight: mergedSettings?.highlight,
            }),
            handleTooltip({
              linkagetip: mergedSettings?.linkagetip,
              tooltip: mergedSettings?.tooltip,
              rules: mergedSettings?.rules,
            }),
            handleFilter({
              dataIndex,
              valueType,
              settings: fieldItem.settings,
              requests: fieldItem.requests,
              search,
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
    searchRequestOptionsMapDataIndexId: searchRequestOptionsMapDataIndexIdRef.current,
    searchTransfromMapDataIndexId: searchTransfromMapDataIndexIdRef.current,
    totalTableWidth: totalTableWidthRef.current,
    allColumnsId: allColumnsIdRef.current,
    allColumnsIdMaps: allColumnsIdMapsRef.current,
    columnsStaticPureConfigsIdMaps: columnsStaticPureConfigsIdMapsRef.current,
    searchFormFieldItems: searchFormFieldItemsRef.current,
    enableSearchForm: enableSearchFormRef.current,
    enableColumnsSettings: enableColumnsSettingsRef.current,
  };
};
