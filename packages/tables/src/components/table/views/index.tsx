import { LoadingOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { ConfigProvider, Form, Table } from 'antd';
import type { FormProps } from 'antd/es/form/Form';
import type { SorterResult } from 'antd/es/table/interface';
import type { NamePath } from 'antd/lib/form/interface';
import cls from 'classnames';
import EventEmitter from 'eventemitter3';
import utl from 'lodash';
import { isMoment } from 'moment';
import type { ValidateErrorEntity } from 'rc-field-form/es/interface';
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
import ReactDOM from 'react-dom';
import store from 'store2';
import UAParser from 'ua-parser-js';
import type {
  ColumnOrdersMetaType,
  OSFormFieldItems,
  OSTableAPI,
  OSTableFormFieldItemExtra,
  OSTableFormFieldItemSettingsFnOption,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableFormGroupType,
  OSTableType,
  OSTableValueType,
  PrioritizedComponentSizeContextValue,
  RecordType,
  SettingsDataNode,
  TableCoreAPI,
  TableInlineAPI,
} from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import { ExtraValueTypesContext } from '@ty-one-start/provider';
import { PrioritizedComponentSizeContext } from '@ty-one-start/provider';
import { OSReferencesCollectorDispatchContext } from '@ty-one-start/provider';
import { TableAPIContext } from '@ty-one-start/provider';
import { TableWrapperContext } from '@ty-one-start/provider';
import { parseTableValue } from '@ty-one-start/utils';
import { mapTreeNode } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import { ResizeableHeaderCell } from '../components/resizeable-header-cell';
import SearchForm from '../components/search-form';
import tableBodyCell from '../components/table-body-cell';
import type { TableBodyRowProps } from '../components/table-body-row';
import TableBodyRow from '../components/table-body-row';
import { DEFAULT_PAGE_SIZE, DEFAULT_ROW_KEY, DEFAULT_TABLE_HEIGHT } from '../constants';
import { RowSelectionModel } from '../models/row-selection';
import { TableFormValueStateModel } from '../models/table-form-value-state';
import type {
  ColumnsSettingsActions,
  RequestDataSourceActions,
  SearchFormAPI,
  SelectionsActions,
  TreeSpreadActions,
} from '../typings';
import ActionsPanel from './actions-panel';
import SearchSwitcher from './actions-panel/search-switcher';
import { BulkOperationView } from './bulk-operation-view';
import SearchPanel from './search-panel';
import { useAntdRowSelectionConfigs } from './_hooks/use-antd-row-selection-configs';
import { useSettings } from './_hooks/use-columns-settings';
import { useHighlight } from './_hooks/use-highlight';
import { useHighLightHeader } from './_hooks/use-highlight-header';
import { useItems } from './_hooks/use-items';
import { usePagination } from './_hooks/use-pagination';
import { useQuicklyBulkSelectViewsState } from './_hooks/use-quickly-bulk-select-views-state';
import { useRequestDataSource } from './_hooks/use-request-data-source';
import { useRowActions } from './_hooks/use-row-actions';
import { useRowSelection } from './_hooks/use-row-selection';
import { useSearchTimestamp } from './_hooks/use-search-timestamp';
import { useSnapshotOfCurrentSearchParameters } from './_hooks/use-snapshot-of-current-search-parameters';
import { useTreeSpread } from './_hooks/use-tree-spread';

const uaparser = new UAParser();

const OSTable: React.ForwardRefRenderFunction<OSTableAPI, OSTableType> = (props, ref) => {
  const {
    settings,
    requests,
    slots,
    hooks,
    value,
    autoRequestWhenMounted: propsAutoRequestWhenMounted = true,
    onChange,
    getFieldItems,
    __localkey,
    extraRowActions,
    extraActions,
    extraBatchOperation,
    requestParams,
    isEditableTable = false,
    renderConsumers,
  } = props;
  const {
    enableEditedCellDiffValueState,
    enableColumnsSettings: propsEnableColumnsSettings,
    fieldItems: __fieldItems,
    editableRowKeys,
    pagination,
    actions,
    rowActions,
    fieldItemSettings,
    highlightVerticalRow = false,
    tableKey,
    searchFormItemChunkSize,
    rowSelection,
    tableMaxWidth,
    loopRequest,
    highlightBadge,
    changeDebounceTimestamp = 450,
    autoRequestWhenMounted: userAutoRequestWhenMounted,
    syncURLParams = true,
    batchOperation,
  } = settings ?? {};

  const { renderActions } = slots ?? {};

  const { afterSearch } = hooks ?? {};

  const autoRequestWhenMounted = userAutoRequestWhenMounted ?? propsAutoRequestWhenMounted;

  const [fieldItemsState, setFieldItemsState] = useState<typeof __fieldItems>();

  const globalSize = useContext(ConfigProvider.SizeContext);

  const clsPrefix = useClsPrefix('os-table');
  const rowKey = props.settings?.rowKey ?? DEFAULT_ROW_KEY;
  const extraValueTypes = useContext(ExtraValueTypesContext);
  const [tableWrapForm] = Form.useForm();
  const { snapshotOfCurrentSearchParametersRef } = useSnapshotOfCurrentSearchParameters();
  const { wrapRef } = useHighLightHeader({
    highlightVerticalRow,
  });
  const searchFormRef = useRef<SearchFormAPI>(null);
  /**
   * 2. dataSource ???????????? value?????????????????? meta
   * 2.1 table ???????????????????????? value ???????????? table ?????????????????????????????? dataSource ????????????????????????
   * 3. visualDataSource ?????? dataSource ??? antd table ???????????????
   */
  const [dataSource, setDataSource] = useState<OSTableValueType>();

  /**
   * ????????? dataSource ??? values ????????????????????????????????????????????????
   * ??????????????? vdataSource ?????? dataSource ????????????
   */
  const [visualDataSource, setVisualDataSource] = useState<RecordType[]>();
  const tableWrapFormRef = useRef<FormInstance>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  /** ????????????????????? search ??? items */
  const searchFormFieldItemsRef = useRef<OSFormFieldItems>([]);

  const [eventBus] = useState(new EventEmitter());

  // const isValuesChangeRef = useRef(false);

  /**
   * ??????????????????????????? cell ????????? linkage ????????????????????????????????????
   * ????????????????????????????????????????????? changed cell value ??????????????????????????? focus ??? cell
   */
  const latestUserInputValueRef = useRef();

  /**
   * ?????????????????????????????? debounce onChange ????????????????????????
   *
   */
  const latestIntervalUserInputValueRef = useRef();

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

  /**
   * ???????????????????????? pagination
   * ?????????????????????????????????????????????????????????????????????????????????
   */
  const normalizedPaginationParams = (() => {
    if (typeof pagination === 'object') {
      return {
        enable: true,
        configs: pagination,
      };
    }
    return {
      enable: false,
      configs: {},
    };
  })();

  const convertValuesToDataSource = useCallback(
    (values: RecordType) => {
      /**
       * ????????? dataSource ??????????????? map ???????????????
       * ??????????????? visual dataSource ??????????????????
       * ????????? onChange ??? value ???????????? dataSource ?????????
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
        /** ??????????????? val ????????? errors??????????????? diff */
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
   * ???????????????????????????????????????????????????????????????????????????????????????
   * ??????????????????????????????????????????????????????????????????
   */
  const clearPrevUserCellInputs = () => {
    latestUserInputValueRef.current = undefined;
  };

  const getIntervalLatestUserInputValue = () => {
    return latestIntervalUserInputValueRef.current;
  };

  const isChangeDebounce = () => {
    return !!changeDebounceTimestamp;
  };

  const setDataSourceAndFormData = useCallback(
    (dataSource_?: OSTableValueType, clearInputCachce: boolean = true) => {
      /** ?????????????????? */
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
     * TODO: ?????? fieldItem ????????????
     */
    return normalizeDataSource(dataSource);
  }, [dataSource]);

  const saveLocalColumnWidth = utl.debounce((columnKey: string, width: number) => {
    store.add(`${__localkey}_LOCAL_COLUMN_WIDTHS`, {
      [columnKey]: width,
    });
  }, 200);

  const getLocalColumnWidth = () => {
    return store.get(`${__localkey}_LOCAL_COLUMN_WIDTHS`, undefined);
  };

  /** ????????????????????? */
  const tableCoreActionsRef = useActionsRef<TableCoreAPI>({
    setTableFormData,
    setVisualDataSource,
    setDataSourceAndFormData,
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

  const reload = (options?: { current?: number; params?: RecordType }) => {
    requestDataSourceActionsRef.current?.requestDataSource({ ...options });
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
    return searchFormRef.current?.formRef.current?.getFieldsValue();
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
    searchFormRef.current?.resetSearchForm();
  };

  const setSearchFormCurrentValues = (values: RecordType) => {
    searchFormRef.current?.setSearchFormValues?.(values);
  };

  const getSearchFormDataSource = () => {
    return searchFormRef.current?.getSearchFormDataSource();
  };

  const getRowKey = () => rowKey;

  const getOriginDataSource = () => dataSource;

  /** ????????????????????????????????????????????? */
  const getVisualDataSource = () => visualDataSource;

  /** ??????????????? antd ??????????????? total ?????? */
  const currentTotalCountRef = useRef<number>();

  const getCurrentTotalCount = () => currentTotalCountRef.current;

  /**
   * ???????????????????????????????????????
   * 1. total === data.length
   * 2. total == null
   */
  const isFEPagination = () => {
    const originDataSource = getOriginDataSource();
    const visualDataSource_ = getVisualDataSource();
    const tableData = visualDataSource_ ?? originDataSource;
    const currentTotalCount = getCurrentTotalCount();

    return (
      currentTotalCount == null || (tableData != null && currentTotalCount === tableData.length)
    );
  };

  /** ??????????????????????????? */
  const getRowSelection = () => rowSelection;

  const setSelectedRowsAndKeys = (rows: RecordType[]) => {
    ReactDOM.unstable_batchedUpdates(() => {
      selectionActionsRef.current.setSelectedRows?.(rows);
      selectionActionsRef.current.setSelectedRowKeys?.(rows.map((item) => item[rowKey]));
    });
  };

  const tableInlineAPISRef = useActionsRef<TableInlineAPI>({
    getDataSource,
    getRowKey,
    isFEPagination,
    getOriginDataSource,
    getRowSelection,
    setSelectedRowsAndKeys,
  });

  const tableActionsRef = useActionsRef<OSTableAPI>({
    isChangeDebounce,
    getIntervalLatestUserInputValue,
    clearPrevUserCellInputs,
    getPagination: () => requestDataSourceActionsRef.current?.getPagination(),
    getColumnsSettingsOrders: () => columnSettingsActionsRef.current.getColumnsSettingsOrders?.(),
    setColumnsSettingsOrders: (orders?: ColumnOrdersMetaType) =>
      columnSettingsActionsRef.current.setColumnsSettingsOrders?.(orders),
    applyColumnSettings: () => columnSettingsActionsRef.current.applyColumnSettings?.(),
    setColumnsSettingsTreeData: (data?: SettingsDataNode[]) =>
      columnSettingsActionsRef.current.setColumnsSettingsTreeData?.(data),
    getColumnsSettingsFixedMap: () =>
      columnSettingsActionsRef.current.getColumnsSettingsFixedMap?.(),
    setColumnsSettingsFixedMap: (fixeds?: Record<string, FixedType | undefined>) =>
      columnSettingsActionsRef.current.setColumnsSettingsFixedMap?.(fixeds),
    setColumnsSettingsVisibleMap: (visibles?: Record<string, boolean>) =>
      columnSettingsActionsRef.current.setColumnsSettingsVisibleMap?.(visibles),
    getCurrentSearchFormFieldItems: () => searchFormFieldItemsRef.current,
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
    getOriginDataSource,
    getAllColumnsId,
    getColumnsStaticPureConfigsIdMaps,
    getSearchFormCurrentValues,
    setSearchFormCurrentValues,
    getSearchFormDataSource,
    removeSelection,
    resetSearchFormValues: resetSearchForm,
    validate,
    getFieldsError,
    core: tableCoreActionsRef.current,
  });

  const {
    columns,
    searchRequestOptionsMapColIdRef,
    searchTransfromMapDataIndexId,
    staticPureConfigsFieldItems,
    totalTableWidth,
    allColumnsId,
    columnsPropsIdMaps,
    columnsStaticPureConfigsIdMaps,
    searchFormFieldItems,
    enableSearchForm,
    enableColumnsSettings,
    enableCellHighlight,
  } = useItems({
    isEditableTable,
    enableEditedCellDiffValueState,
    searchFormFieldItemsRef,
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
    searchFormRef,
    searchFormItemChunkSize: settings?.searchFormItemChunkSize,
    tableCoreActionsRef,
    tableActionsRef,
    getFieldItems,
    tableWrapFormRef,
  });

  const { highlightTag } = useHighlight({
    enableHighlight: enableCellHighlight,
    highlightBadge,
  });

  /** ????????????????????????????????? */
  const formCurrentValuesRef = useRef<RecordType>();
  const [searchFormVisible, setSearchFormVisible] = useState<boolean>(true);

  const searchFormDom =
    enableSearchForm && searchFormVisible ? (
      <SearchForm
        {...{
          ref: searchFormRef,
          dataSource,
          searchFormItemChunkSize,
          clsPrefix,
          searchFormSettings: settings?.searchFormSettings,
          searchFormFieldItems,
          tableKey,
          searchFormVisible,
          formCurrentValuesRef,
          syncURLParams,
        }}
      />
    ) : null;

  const { setSelectedRowKeys, setSelectedRows, selectedRowKeys, selectedRows } = useRowSelection({
    tableCoreActionsRef,
    rowKey,
    ref: selectionActionsRef,
  });

  const rowOperationTriggersDom = React.Children.map(
    [
      ...(extraBatchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableActionsRef.current,
      }) ?? []),
      ...(batchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableActionsRef.current,
      }) ?? []),
    ],
    (item) => {
      if (React.isValidElement(item)) {
        return React.cloneElement(item, {
          ...item.props,
          __disabled: selectedRowKeys.length === 0,
        });
      }
      return item;
    },
  );

  const enableRowBulkOperation = React.Children.count(rowOperationTriggersDom) !== 0;

  // TODO: ????????????????????????
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bulkOperationViewDom = enableRowBulkOperation ? (
    <BulkOperationView
      {...{
        selectedRowKeys,
        operationDom: rowOperationTriggersDom,
      }}
    />
  ) : null;

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
    requestParamsWithRequestDataSource: requestParams?.requestDataSource,
    tableInlineAPISRef,
    currentTotalCountRef,
    syncURLParams,
    afterSearch,
    setFieldItemsState,
    loopRequest,
    tableKey,
    tableActionsRef,
    requestDataSource: requests?.requestDataSource,
    requestVisualDataSource: requests?.requestVisualDataSource,
    snapshotOfCurrentSearchParametersRef,
    searchTransfromMapDataIndexId,
    searchRequestOptionsMapColIdRef,
    tableCoreActionsRef,
    clearSelection,
    requestDataSourceActionsRef,
    setSarchTimeStr,
    autoRequestWhenMounted,
    searchFormRef,
    treeSpreadActionsRef,
    defaultPageSize: normalizedPaginationParams.configs.defaultPageSize,
    defaultCurrent: normalizedPaginationParams.configs.defaultCurrent,
  });

  const searchSwitchDom = enableSearchForm ? (
    <SearchSwitcher
      {...{
        searchFormVisible,
        searchFormRef,
        isExistPropsRequestVisualDataSource:
          typeof requests?.requestVisualDataSource === 'function',
        requestDataSourceActionsRef,
        tableCoreActionsRef,
        setSearchFormVisible,
      }}
    />
  ) : null;

  const {
    drawerDom,
    iconDom: settingDom,
    columns: _columns,
  } = useSettings({
    columns,
    allColumnsId,
    staticPureConfigsFieldItems,
    columnsPropsIdMaps,
    columnsStaticPureConfigsIdMaps,
    enable: propsEnableColumnsSettings ?? enableColumnsSettings,
    tableWrapRef,
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

  const { expandBtn, expandedRowKeys, setExpandedRowKeys } = useTreeSpread({
    dataSource,
    ref: treeSpreadActionsRef,
  });

  useEffect(() => {
    const nextDataSource = parseTableValue(value);

    tableCoreActionsRef.current.setDataSourceAndFormData(nextDataSource, false);

    /**
     * table ???????????? vitrual dataSource ????????????????????????????????????????????? dataSource ???????????????
     * ??? dataSource ?????????????????????????????????????????? visual dataSource
     */
    setVisualDataSource((prev) =>
      prev?.filter((item) => {
        return nextDataSource?.find((it) => it[rowKey] === item[rowKey]) as RecordType;
      }),
    );
  }, [tableCoreActionsRef, rowKey, value]);

  const finalPagination = usePagination({
    current,
    pagination,
    totalCount,
  });

  const changedvaluesCacheRef = useRef<RecordType>();

  const handleValueChangeCore = (values: RecordType) => {
    const data = convertValuesToDataSource(values);
    if (props.settings?.changedValueHasMeta) {
      onChange?.({
        target: data,
        origin: dataSource,
        changedMeta: {
          type: 'modify',
          data: getChangedValuesMeta(changedvaluesCacheRef.current),
        },
      });
    } else {
      onChange?.(data);
    }
    changedvaluesCacheRef.current = undefined;

    latestIntervalUserInputValueRef.current = undefined;
  };

  const handleValueChangeCoreWithDebounce = changeDebounceTimestamp
    ? utl.debounce(handleValueChangeCore, changeDebounceTimestamp)
    : handleValueChangeCore;

  const handleValueChange: FormProps['onValuesChange'] = (changedValues, values) => {
    changedvaluesCacheRef.current = utl.merge(changedvaluesCacheRef.current, changedValues);

    handleValueChangeCoreWithDebounce(values);
  };

  const handleTableChange = useCallback(
    (pagination_, filters, sorter) => {
      if (tableInlineAPISRef.current.isFEPagination()) {
        requestDataSourceActionsRef.current?.setCurrent(pagination_.current);
        return;
      }

      requestDataSourceActionsRef.current?.requestDataSource({
        current: pagination_.current ?? 1,
        pageSize: pagination_.pageSize ?? DEFAULT_PAGE_SIZE,
        order: (sorter as SorterResult<RecordType>).order,
        orderBy: (sorter as SorterResult<RecordType>).field,
      });
    },
    [tableInlineAPISRef],
  );

  const { selections } = useQuicklyBulkSelectViewsState({
    rowSelection,
    tableInlineAPISRef,
    setSelectedRowKeys,
    setSelectedRows,
  });

  const { configs: antdSelectionConfigs } = useAntdRowSelectionConfigs({
    selections,
    rowSelection,
    bulkOperationViewDom,
    selectedRowKeys,
    setSelectedRows,
    setSelectedRowKeys,
  });

  const prioritizedComSize = useMemo(() => {
    return {
      size: globalSize,
    } as PrioritizedComponentSizeContextValue;
  }, [globalSize]);

  const components = useMemo(() => {
    return {
      header: {
        wrapper: props.headerWrapper,
        cell: ResizeableHeaderCell,
      },
      body: {
        row: TableBodyRow,
        cell: tableBodyCell,
      },
    };
  }, [props.headerWrapper]);

  return (
    <TableAPIContext.Provider value={tableActionsRef}>
      <TableFormValueStateModel.Provider
        initialState={{
          tableCoreActionsRef,
          tableActionsRef,
          value,
          rowKey,
          enableEditedCellDiffValueState,
        }}
      >
        <RowSelectionModel.Provider>
          <TableWrapperContext.Provider value={tableWrapRef}>
            <div ref={tableWrapRef}>
              <SearchPanel
                {...{
                  searchFormFieldItems,
                  searchFormItemChunkSize,
                  searchFormDom,
                }}
              />
              <ActionsPanel
                {...{
                  selectionDom: bulkOperationViewDom,
                  searchFormFieldItems,
                  searchFormItemChunkSize,
                  searchFormDom,
                  searchSwitchDom,
                  expandBtn,
                  actions,
                  extraActions,
                  settingDom,
                  tableActionsRef,
                  clsPrefix,
                  highlightTag,
                  renderActions,
                  renderConsumers,
                }}
              ></ActionsPanel>
              {drawerDom}
              <PrioritizedComponentSizeContext.Provider value={prioritizedComSize}>
                <Form
                  /** ???????????? cell ???????????? */
                  size="small"
                  form={tableWrapForm}
                  className={cls(clsPrefix, props.className)}
                  ref={tableWrapFormRef}
                  onValuesChange={(changedValues, values) => {
                    latestUserInputValueRef.current = changedValues;
                    latestIntervalUserInputValueRef.current = changedValues;

                    handleValueChange(changedValues, values);

                    /** ?????? core api ?????????????????? */
                    tableCoreActionsRef.current.emit('tableFormValuesEdited', values);
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
                    <Table
                      tableLayout="fixed"
                      loading={{
                        indicator: <LoadingOutlined />,
                        spinning: loading,
                      }}
                      rowSelection={antdSelectionConfigs}
                      rowKey={rowKey}
                      columns={mergedColumns}
                      dataSource={visualDataSource ?? dataSource}
                      onChange={handleTableChange}
                      onRow={(row, index) => {
                        return {
                          className: getRowClassName(row, index),
                          rowId: row[rowKey],
                          rowSelectionType: rowSelection?.type,
                        } as TableBodyRowProps;
                      }}
                      expandable={{
                        expandedRowKeys,
                        onExpandedRowsChange: (_expandedRowKeys) => {
                          setExpandedRowKeys(_expandedRowKeys);
                        },
                      }}
                      pagination={finalPagination}
                      scroll={{
                        x: totalTableWidth,
                        y: settings?.tableHeight ?? DEFAULT_TABLE_HEIGHT,
                      }}
                      components={components}
                    />
                    {searchTimestampDom}
                  </div>
                </Form>
              </PrioritizedComponentSizeContext.Provider>
            </div>
          </TableWrapperContext.Provider>
        </RowSelectionModel.Provider>
      </TableFormValueStateModel.Provider>
    </TableAPIContext.Provider>
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
