import { LoadingOutlined } from '@ant-design/icons';
import type { FormInstance } from '@ty/antd';
import { Form, Table } from '@ty/antd';
import type { FormProps } from '@ty/antd/es/form/Form';
import type { SorterResult } from '@ty/antd/es/table/interface';
import type { NamePath } from '@ty/antd/lib/form/interface';
import cls from 'classnames';
import EventEmitter from 'eventemitter3';
import utl from 'lodash';
import { isMoment } from 'moment';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import ResizeObserver from 'rc-resize-observer';
import type { FixedType } from 'rc-table/lib/interface';
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import store from 'store2';
import UAParser from 'ua-parser-js';
import { useActionsRef } from '../hooks/use-actions-ref';
import { ExtraValueTypesContext } from '../providers/extra-value-types';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import { TableWrapperContext } from '../providers/table-context';
import type {
  OSTableAPI,
  OSTableFormFieldItemExtra,
  OSTableFormFieldItemSettingsFnOption,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableFormGroupType,
  OSTableType,
  OSTableValueType,
  RecordType,
  SettingsDataNode,
  TableCoreActions,
} from '../../typings';
import { parseTableValue } from '../utils/parse-table-value';
import { mapTreeNode } from '../utils/tree-utils';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { ResizeableHeaderCell } from './components/resizeable-header-cell';
import {
  defaultPageSize,
  DEFAULT_TABLE_HEIGHT,
  searchHeadFormFieldRowId,
  searchHeadFormFieldRowIdOverlay,
  searchHeadFormSwitchIsOpenMarkId,
} from './constants';
import type {
  ColumnsSettingsActions,
  RequestDataSourceActions,
  SearchFormActions,
  SelectionsActions,
  TreeSpreadActions,
} from './typings';
import { useHighlight } from './use-highlight';
import { useHighLightHeader } from './use-highlight-header';
import { useItems } from './use-items';
import { usePagination } from './use-pagination';
import { useRequestDataSource } from './use-request-data-source';
import { useRowActions } from './use-row-actions';
import { useSearchForm } from './use-search-form';
import { useSearchSwitch } from './use-search-switch';
import { useSearchTimestamp } from './use-search-timestamp';
import { useSelection } from './use-selection';
import { useSettings } from './use-settings';
import { useSnapshotOfCurrentSearchParameters } from './use-snapshot-of-current-search-parameters';
import { useTableTopPanel } from './use-table-top-panel';
import { useTreeSpread } from './use-tree-spread';
import { useVirtualGrid } from './use-virtual-grid';

const uaparser = new UAParser();

const OSTable: React.ForwardRefRenderFunction<OSTableAPI, OSTableType> = (props, ref) => {
  const {
    settings,
    requests,
    value,
    autoRequestWhenMounted: propsAutoRequestWhenMounted = true,
    onChange,
    getFieldItems,
    __localkey,
    extraRowActions,
    extraActions,
    extraBatchOperation,
  } = props;
  const {
    enableColumnsSettings: propsEnableColumnsSettings,
    fieldItems: __fieldItems,
    editableRowKeys,
    pagination,
    actions,
    rowActions,
    fieldItemSettings,
    highlightVerticalRow = false,
    singleSearchForm = true,
    tableKey,
    searchFormItemChunkSize,
    rowSelection,
    tableMaxWidth,
    loopRequest,
    highlightBadge,
    changeDebounceTimestamp = 450,
    autoRequestWhenMounted: userAutoRequestWhenMounted,
  } = settings ?? {};

  const autoRequestWhenMounted = userAutoRequestWhenMounted ?? propsAutoRequestWhenMounted;

  const [fieldItemsState, setFieldItemsState] = useState<typeof __fieldItems>();

  const clsPrefix = useClsPrefix('os-table');
  const rowKey = props.settings?.rowKey ?? 'id';
  const extraValueTypes = useContext(ExtraValueTypesContext);
  const [tableWrapForm] = Form.useForm();
  const { snapshotOfCurrentSearchParametersRef } = useSnapshotOfCurrentSearchParameters();
  const { wrapRef } = useHighLightHeader({
    highlightVerticalRow,
  });
  const searchFormActionsRef = useRef<Partial<SearchFormActions>>({});
  /**
   * 2. dataSource 对应组件 value，类型可能为 meta
   * 2.1 table 存在一个虚拟状态 value 对应包裹 table 的表单内部状态，修改 dataSource 后需要同步修改他
   * 3. visualDataSource 对应 dataSource 是 antd table 的显示数据
   */
  const [dataSource, setDataSource] = useState<OSTableValueType>();

  /**
   * 内部将 dataSource 和 values 进行绑定了，为了满足前端检索需求
   * 新建虚拟的 vdataSource 高于 dataSource 进行展示
   */
  const [visualDataSource, setVisualDataSource] = useState<RecordType[]>();
  const tableWrapFormRef = useRef<FormInstance>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  const [eventBus] = useState(new EventEmitter());

  const [tableWidth, setTableWidth] = useState(0);

  // const isValuesChangeRef = useRef(false);

  /**
   * 当前用户最新输入的 cell 值，当 linkage 计算完成后重新设置表单值
   * 可能出现最新输入的值要比联动的 changed cell value 更新，导致变化当前 focus 的 cell
   */
  const latestUserInputValueRef = useRef();

  const columnSettingsActionsRef = useActionsRef<Partial<ColumnsSettingsActions>>({});

  const _fieldItems = fieldItemsState ?? __fieldItems;

  const validate = async (
    nameList?: NamePath[],
  ): Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  > => {
    try {
      const values = await tableWrapFormRef.current?.validateFields(nameList);
      return {
        error: false,
        data: values,
      };
    } catch (errors) {
      return { error: true, data: errors as ValidateErrorEntity };
    }
  };

  const getFieldsError = () => {
    const fieldsError = tableWrapFormRef.current?.getFieldsError() ?? [];
    return fieldsError;
  };
  const currentDefaultPageSize = useMemo(() => {
    if (typeof pagination === 'object') {
      return pagination.defaultPageSize ?? defaultPageSize;
    }
    return defaultPageSize;
  }, [pagination]);

  const convertValuesToDataSource = useCallback(
    (values: RecordType) => {
      /**
       * 这里以 dataSource 为基准进行 map 非常重要，
       * 可以保证在 visual dataSource 编辑的时候，
       * 可以让 onChange 的 value 维持在总 dataSource 的情形
       */
      return dataSource?.map((item) => {
        const val = values[item[rowKey]];
        if (val) {
          return {
            ...item,
            ...val,
          };
        }
        return item;
      });
    },
    [dataSource, rowKey],
  );

  const setTableFormData = useCallback(
    (dataSource_?: RecordType[]) => {
      const nextValues = utl.mapValues(
        utl.groupBy(dataSource_, (item) => item[rowKey]),
        ([val]) => val,
      );
      const old = tableWrapForm.getFieldsValue();
      const next = utl.mapValues(nextValues, (record, rowId) => {
        /** 对象形式的 val 会重置 errors，不管是否 diff */
        return utl.omitBy(record, (val, key) => {
          if (
            old[rowId]?.[key] !== val &&
            typeof latestUserInputValueRef.current === 'object' &&
            typeof latestUserInputValueRef.current![rowId] === 'object' &&
            key in latestUserInputValueRef.current![rowId]
          ) {
            return true;
          }

          return old[rowId]?.[key] === val;
        });
      });
      latestUserInputValueRef.current = undefined;
      tableWrapForm.setFieldsValue(next);
    },
    [rowKey, tableWrapForm],
  );

  const selectionActionsRef = useActionsRef<Partial<SelectionsActions>>({});

  /**
   * 清空上一次单元格用户输入，原作用是避免数值联动冲掉当前输入
   * 但是在手动设置的情况下，需要先清理，避免无效
   */
  const clearPrevUserCellInputs = () => {
    latestUserInputValueRef.current = undefined;
  };

  const setDataSourceAndFormData = useCallback(
    (dataSource_?: OSTableValueType, clearInputCachce: boolean = true) => {
      /** 更新选中状态 */
      const selectedRowKeys = selectionActionsRef.current?.getSelectedRowKeys?.();

      if (dataSource_?.length && selectedRowKeys?.length) {
        const freshItems: RecordType[] = [];

        mapTreeNode(dataSource_, (item) => {
          if (selectedRowKeys.includes(item[rowKey])) {
            freshItems.push(item);
            return item;
          }
          return null;
        });

        if (freshItems.length) {
          selectionActionsRef.current?.setSelectedRows?.(freshItems);
          selectionActionsRef.current.setSelectedRowKeys?.(freshItems.map((item) => item[rowKey]));
        }
      }

      if (clearInputCachce) {
        clearPrevUserCellInputs();
      }

      setDataSource(dataSource_);
      setTableFormData(parseTableValue(dataSource_));
    },
    [selectionActionsRef, setTableFormData, rowKey],
  );

  const normalizeDataSource = (dataSource_?: RecordType[]) => {
    return dataSource_?.map((item: RecordType) => {
      return utl.mapValues(item, (val) => {
        if (Array.isArray(val)) {
          return val.map((it) => (isMoment(it) ? it?.format('YYYY-MM-DD') : it));
        }
        if (isMoment(val)) {
          return val.format('YYYY-MM-DD');
        }
        return val;
      });
    });
  };

  const getDataSource = useCallback(() => {
    /**
     * TODO: 根据 fieldItem 进行转换
     */
    return normalizeDataSource(dataSource);
  }, [dataSource]);

  const getVisualDataSource = useCallback(() => {
    return visualDataSource;
  }, [visualDataSource]);

  /** 切换展开 */
  const switchHeaderFormSwitchMark = (open: boolean) => {
    tableWrapForm.setFieldsValue({
      [searchHeadFormSwitchIsOpenMarkId]: open,
    });
  };

  const setHeaderFormValues = (values: RecordType) => {
    /** 同步表格头部的 search form  */
    tableWrapForm.setFieldsValue({
      [searchHeadFormFieldRowId]: values,
    });
  };

  const getHeaderFormValues = () => {
    /** 同步表格头部的 search form  */
    return tableWrapForm.getFieldValue(searchHeadFormFieldRowId);
  };

  const setSearchHeadFormOverlayValues = (values: RecordType) => {
    tableWrapForm.setFieldsValue({
      [searchHeadFormFieldRowIdOverlay]: values,
    });
  };

  const saveLocalColumnWidth = utl.debounce((columnKey: string, width: number) => {
    store.add(`${__localkey}_LOCAL_COLUMN_WIDTHS`, {
      [columnKey]: width,
    });
  }, 200);

  const getLocalColumnWidth = () => {
    return store.get(`${__localkey}_LOCAL_COLUMN_WIDTHS`, undefined);
  };

  const tableCoreActionsRef = useActionsRef<TableCoreActions>({
    setTableFormData,
    setVisualDataSource,
    setDataSourceAndFormData,
    setHeaderFormValues,
    getHeaderFormValues,
    switchHeaderFormSwitchMark,
    setSearchHeadFormOverlayValues,
    once(...args) {
      return eventBus.once(...args);
    },
    on(...args) {
      return eventBus.on(...args);
    },
    off(...args) {
      return eventBus.off(...args);
    },
    emit(...args) {
      return eventBus.emit(...args);
    },
    saveLocalColumnWidth,
    getLocalColumnWidth,
  });

  const treeSpreadActionsRef = useRef<TreeSpreadActions>(null);

  const requestDataSourceActionsRef = useRef<RequestDataSourceActions>(null);

  const reload = () => {
    requestDataSourceActionsRef.current?.requestDataSource({});
  };

  const getChangedValuesMeta = (changedValues?: RecordType) => {
    return utl.flatten(
      Object.keys(changedValues ?? {}).map((rowId) => {
        return Object.keys(changedValues![rowId]).map((dataIndex) => {
          return {
            rowId,
            rowIndex: dataSource?.findIndex((item) => item[rowKey] === rowId),
            rowData: changedValues![rowId],
            dataIndex,
          };
        });
      }),
    );
  };

  const allColumnsIdRef = useRef<string[]>([]);
  const columnsStaticPureConfigsIdMapsRef = useRef<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >({});
  const serachFormCurrentValuesRef = useRef<RecordType>();

  const getAllColumnsId = () => {
    return allColumnsIdRef.current;
  };

  const getColumnsStaticPureConfigsIdMaps = (): Record<
    string,
    OSTableFormFieldItemWithStaticPureConfigs
  > => {
    return columnsStaticPureConfigsIdMapsRef.current;
  };

  const getSearchFormCurrentValues = (): RecordType | undefined => {
    return serachFormCurrentValuesRef.current;
  };

  const removeSelection = (rowId: string) => {
    tableCoreActionsRef.current.removeSelectedRowKeysAndRow?.((prev: React.Key[]) => {
      const pos = prev.findIndex((item) => item === rowId);
      if (pos > -1) {
        return [prev[pos]];
      }
      return [];
    });
  };

  const resetSearchForm = () => {
    searchFormActionsRef.current.resetSerachFormValues?.();
  };

  const setSearchFormCurrentValues = (values: RecordType) => {
    searchFormActionsRef.current.setSearchFormValues?.(values);
  };

  const tableActionsRef = useActionsRef<OSTableAPI>({
    clearPrevUserCellInputs,
    setColumnsSettingsTreeData: (data?: SettingsDataNode[]) =>
      columnSettingsActionsRef.current.setColumnsSettingsTreeData?.(data),
    getColumnsSettingsFixedMap: () =>
      columnSettingsActionsRef.current.getColumnsSettingsFixedMap?.(),
    setColumnsSettingsFixedMap: (fixeds?: Record<string, FixedType | undefined>) =>
      columnSettingsActionsRef.current.setColumnsSettingsFixedMap?.(fixeds),
    setColumnsSettingsVisibleMap: (visibles?: Record<string, boolean>) =>
      columnSettingsActionsRef.current.setColumnsSettingsVisibleMap?.(visibles),
    getCurrentSearchFormFieldItems: () =>
      searchFormActionsRef.current.getCurrentSearchFormFieldItems?.(),
    getColumnsSettingsVisibleMap: () =>
      columnSettingsActionsRef.current.getColumnsSettingsVisibleMap?.(),
    getColumnsSettingsTreeData: () =>
      columnSettingsActionsRef.current.getColumnsSettingsTreeData?.() ?? [],
    getVisualDataSource,
    reload,
    setDataSource: (dataSource_?: RecordType[]) => {
      setDataSourceAndFormData(dataSource_);
      onChange?.(dataSource_);
    },
    normalizeDataSource,
    getDataSource,
    getOriginDataSource: () => dataSource,
    getAllColumnsId,
    getColumnsStaticPureConfigsIdMaps,
    getSearchFormCurrentValues,
    setSearchFormCurrentValues,
    getSearchFormDataSource: () => {
      return searchFormActionsRef.current.getSearchFormDataSource?.();
    },
    removeSelection,
    resetSearchFormValues: resetSearchForm,
    validate,
    getFieldsError,
    core: tableCoreActionsRef.current,
  });

  const {
    columns,
    searchRequestOptionsMapDataIndexId,
    searchTransfromMapDataIndexId,
    totalTableWidth,
    allColumnsId,
    allColumnsIdMaps,
    columnsStaticPureConfigsIdMaps,
    searchFormFieldItems,
    enableSearchForm,
    enableColumnsSettings,
    enableCellHighlight,
  } = useItems({
    requestDataSourceActionsRef,
    tableKey,
    fieldItemSettings,
    tableWrapRef,
    fieldItems: _fieldItems,
    tableWrapForm,
    clsPrefix,
    editableRowKeys,
    allColumnsIdRef,
    columnsStaticPureConfigsIdMapsRef,
    rowKey,
    extraValueTypes,
    searchFormActionsRef,
    snapshotOfCurrentSearchParametersRef,
    searchFormItemChunkSize: settings?.searchFormItemChunkSize,
    tableCoreActionsRef,
    tableActionsRef,
    getFieldItems,
  });

  const { highlightTag } = useHighlight({
    enableHighlight: enableCellHighlight,
    highlightBadge,
  });

  const {
    dom: searchFormDom,
    setSearchFormVisible,
    searchFormVisible,
    resetSerachFormValues,
    searchFormRef,
  } = useSearchForm({
    dataSource,
    searchFormItemChunkSize,
    clsPrefix,
    __localkey,
    tableCoreActionsRef,
    snapshotOfCurrentSearchParametersRef,
    searchFormFieldItems,
    ref: searchFormActionsRef,
    enable: enableSearchForm,
    searchFormSettings: settings?.searchFormSettings,
    serachFormCurrentValuesRef,
    tableKey,
  });

  const {
    dom: selectionDom,
    setSelectedRowKeys,
    setSelectedRows,
    selectedRowKeys,
  } = useSelection({
    batchOperation: props.settings?.batchOperation,
    tableActionsRef,
    extraBatchOperation,
    tableCoreActionsRef,
    rowKey,
    ref: selectionActionsRef,
  });

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [setSelectedRowKeys, setSelectedRows]);

  const { dom: searchTimestampDom, setTimeStr: setSarchTimeStr } = useSearchTimestamp({
    pagination,
    tableActionsRef,
    enableSearch: !!searchFormDom,
    loading: dataSource == null || dataSource.length === 0,
    loopRequest,
  });

  const { loading, totalCount, current } = useRequestDataSource({
    setFieldItemsState,
    loopRequest,
    tableKey,
    tableActionsRef,
    requestDataSource: requests?.requestDataSource,
    requestVisualDataSource: requests?.requestVisualDataSource,
    snapshotOfCurrentSearchParametersRef,
    searchTransfromMapDataIndexId,
    searchRequestOptionsMapDataIndexId,
    tableCoreActionsRef,
    clearSelection,
    requestDataSourceActionsRef,
    setSarchTimeStr,
    autoRequestWhenMounted,
    searchFormRef,
    treeSpreadActionsRef,
    defaultPageSize: currentDefaultPageSize,
  });

  const { dom: searchSwitchDom, actionsRef: searchSwitchActionsRef } = useSearchSwitch({
    fieldItems: _fieldItems,
    searchFormVisible,
    resetSerachFormValues,
    setSearchFormVisible,
    requestDataSourceActionsRef,
    tableCoreActionsRef,
    enable: enableSearchForm,
    tableWrapRef,
    isExistPropsRequestVisualDataSource: typeof requests?.requestVisualDataSource === 'function',
  });

  const {
    drawerDom,
    iconDom: settingDom,
    columns: _columns,
  } = useSettings({
    columns,
    allColumnsId,
    columnsPropsIdMaps: allColumnsIdMaps,
    columnsStaticPureConfigsIdMaps,
    enable: propsEnableColumnsSettings ?? enableColumnsSettings,
    tableWrapRef,
    searchSwitchActionsRef,
    ref: columnSettingsActionsRef,
  });

  const { columns: mergedColumns } = useRowActions({
    columns: _columns,
    rowKey,
    rowActions,
    clsPrefix,
    tableActionsRef,
    extraRowActions,
  });

  useImperativeHandle(ref, () => {
    return tableActionsRef.current;
  });

  useEffect(() => {
    const apis = tableActionsRef.current;

    if (props.refKey) {
      referencesDispatch({
        type: 'registe',
        payload: {
          type: 'tables',
          key: props.refKey,
          apis,
        },
      });
    }
  });

  const getRowClassName = (
    row: { level?: number; [key: string]: any },
    index?: number,
    options?: {
      suffix?: string;
    },
  ) => {
    const withSuffix = (item: string) => {
      return [item, options?.suffix].filter(Boolean).join('-');
    };
    if (index == null) return undefined;
    const base = withSuffix(`${clsPrefix}-row`);
    if (row.level != null && row.level > 0)
      return cls(base, withSuffix(`${clsPrefix}-blue-level-${row.level}`));
    return cls(
      base,
      index % 2 ? withSuffix(`${clsPrefix}-row-odd`) : withSuffix(`${clsPrefix}-row-even`),
    );
  };

  const {
    renderVirtualGrid,
    // tableHeight: _tableHeight,
    spreadBtnDom,
  } = useVirtualGrid({
    tableWidth,
    columns: mergedColumns,
    tableHeight: settings?.tableHeight ?? DEFAULT_TABLE_HEIGHT,
    dataSource,
    enable: settings?.enableGridTree,
    tableWrapRef,
    columnsSettingsIdMaps: columnsStaticPureConfigsIdMaps,
    rowKey,
    getRowClassName,
    tableCoreActionsRef,
  });

  const { expandBtn, expandedRowKeys, setExpandedRowKeys } = useTreeSpread({
    dataSource,
    ref: treeSpreadActionsRef,
  });

  useEffect(() => {
    const nextDataSource = parseTableValue(value);

    tableCoreActionsRef.current.setDataSourceAndFormData(nextDataSource, false);

    /**
     * table 内部存在 vitrual dataSource 提供前端搜索功能的数据展示，和 dataSource 是绑定关系
     * 当 dataSource 删除或者更新的时候，同时更新 visual dataSource
     */
    setVisualDataSource((prev) =>
      prev?.filter((item) => {
        return nextDataSource?.find((it) => it[rowKey] === item[rowKey]) as RecordType;
      }),
    );
  }, [tableCoreActionsRef, rowKey, value]);

  const tableTopPanel = useTableTopPanel({
    spreadBtnDom,
    selectionDom,
    singleSearchForm,
    searchFormFieldItems,
    searchFormItemChunkSize,
    drawerDom,
    searchFormDom,
    searchSwitchDom,
    expandBtn,
    actions,
    extraActions,
    settingDom,
    tableActionsRef,
    clsPrefix,
    highlightTag,
  });

  const normalizedPagination = usePagination({
    enableGridTree: settings?.enableGridTree,
    current,
    pagination,
    totalCount,
  });

  const handleValueChange: FormProps['onValuesChange'] = (changedValues, values) => {
    if (props.settings?.changedValueHasMeta) {
      onChange?.({
        target: convertValuesToDataSource(values),
        origin: dataSource,
        changedMeta: {
          type: 'modify',
          data: getChangedValuesMeta(changedValues),
        },
      });
      return;
    }
    const data = convertValuesToDataSource(values);
    onChange?.(data);
  };

  const handleValueChangeWithDebounce: FormProps['onValuesChange'] = changeDebounceTimestamp
    ? utl.debounce(handleValueChange, changeDebounceTimestamp)
    : handleValueChange;

  return (
    <TableWrapperContext.Provider value={tableWrapRef}>
      <div ref={tableWrapRef}>
        {tableTopPanel}
        <Form
          form={tableWrapForm}
          className={cls(clsPrefix, props.className)}
          ref={tableWrapFormRef}
          onValuesChange={(changedValues, values) => {
            console.log('latestUserInputValueRef.current', changedValues, values);
            latestUserInputValueRef.current = changedValues;

            handleValueChangeWithDebounce(changedValues, values);
          }}
        >
          <div
            ref={wrapRef}
            style={{
              position: 'relative',
              maxWidth:
                tableMaxWidth != null
                  ? tableMaxWidth - (uaparser.getOS().name === 'Windows' ? 17 : 0)
                  : undefined,
            }}
          >
            <ResizeObserver
              onResize={({ width }) => {
                setTableWidth(width);
              }}
            >
              <Table
                tableLayout="fixed"
                loading={{
                  indicator: <LoadingOutlined />,
                  spinning: loading,
                }}
                rowSelection={
                  selectionDom
                    ? {
                        type: 'checkbox',
                        onChange: (selectedRowKeys_: React.Key[], selectedRows_: RecordType[]) => {
                          setSelectedRowKeys(selectedRowKeys_);
                          setSelectedRows(selectedRows_);
                        },
                        selectedRowKeys,
                        checkStrictly: rowSelection?.checkStrictly,
                      }
                    : undefined
                }
                rowKey={rowKey}
                columns={mergedColumns}
                dataSource={visualDataSource ?? dataSource}
                onChange={(pagination_, filters, sorter) => {
                  const isFePagination = () => {
                    const originDataSource = tableActionsRef.current.getOriginDataSource();
                    const visualDataSource_ = tableActionsRef.current.getVisualDataSource();

                    const viewData = visualDataSource_ ?? originDataSource;

                    return totalCount != null && viewData != null && totalCount === viewData.length;
                  };

                  if (isFePagination()) {
                    requestDataSourceActionsRef.current?.setCurrent(pagination_.current);
                    return;
                  }

                  requestDataSourceActionsRef.current?.requestDataSource({
                    current: pagination_.current ?? 1,
                    pageSize: pagination_.pageSize ?? defaultPageSize,
                    order: (sorter as SorterResult<RecordType>).order,
                    orderBy: (sorter as SorterResult<RecordType>).field,
                  });
                }}
                onRow={(row, index) => {
                  return {
                    className: getRowClassName(row, index),
                  };
                }}
                expandable={{
                  expandedRowKeys,
                  onExpandedRowsChange: (_expandedRowKeys) => {
                    setExpandedRowKeys(_expandedRowKeys);
                  },
                }}
                pagination={normalizedPagination}
                scroll={{
                  x: totalTableWidth,
                  y: settings?.tableHeight ?? DEFAULT_TABLE_HEIGHT,
                }}
                components={{
                  header: {
                    wrapper: props.headerWrapper,
                    cell: ResizeableHeaderCell,
                  },
                  body: settings?.enableGridTree ? renderVirtualGrid : undefined,
                }}
              />
            </ResizeObserver>
            {searchTimestampDom}
          </div>
        </Form>
      </div>
    </TableWrapperContext.Provider>
  );
};

export default React.forwardRef(OSTable);

export const TableSettings: React.FC<OSTableType['settings']> = () => <></>;
export const TableAPI: React.FC<OSTableAPI> = () => <></>;
export const TableFormGroupItem: React.FC<OSTableFormGroupType> = () => <></>;
export const TableFormFieldItemSettingsFnOption: React.FC<OSTableFormFieldItemSettingsFnOption> =
  () => <></>;
export const TableFormFieldItemExtraSettings: React.FC<OSTableFormFieldItemExtra['settings']> =
  () => <></>;
