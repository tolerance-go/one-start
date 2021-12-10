/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AgGridReact } from '@ag-grid-community/react';
import type { Module } from '@ag-grid-enterprise/all-modules';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine-dark.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham-dark.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-material.css';
import 'ag-grid-enterprise';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { LoadingOutlined } from '@ant-design/icons';
import type { FormInstance } from '@ty/antd';
import { Col, Form, Row, Spin } from '@ty/antd';
import EventEmitter from 'eventemitter3';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import { ExtraValueTypesContext } from '../providers/extra-value-types';
import type {
  AgGridTableAPI,
  OSGridAPI,
  OSGridType,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableValueType,
  RecordType,
  TableCoreActions,
} from '../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import FieldRenderer from './components/field-renderer';
import { AgGridLocalZhCN, searchHeadFormSwitchIsOpenMarkId } from './constants';
import type {
  RequestDataSourceActions,
  SearchFormActions,
  SelectionsActions,
  TreeSpreadActions,
} from './typings';
import { useItems } from './use-items';
import { usePagination } from './use-pagination';
import { useRequestDataSource } from './use-request-data-source';
import { useRowActions } from './use-row-actions';
import { useSearchForm } from './use-search-form';
import { useSearchSwitch } from './use-search-switch';
import { useSearchTimestamp } from './use-search-timestamp';
import { useSelection } from './use-selection';
import { useSnapshotOfCurrentSearchParameters } from './use-snapshot-of-current-search-parameters';
import { useTableTopPanel } from './use-table-top-panel';
import utl from 'lodash';
import { mapTreeNode } from '../utils/tree-utils';

LicenseManager.setLicenseKey(
  'CompanyName=Tongyu,LicensedApplication=TongyuBCT,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-016360,ExpiryDate=11_June_2022_[v2]_MTY1NDkwMjAwMDAwMA==67644cc6f33508f232af922c7f70137f',
);

const OSGrid: React.ForwardRefRenderFunction<OSGridAPI, OSGridType> = (props, ref) => {
  const prefixCls = useClsPrefix('os-grid');
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const agGridRef = useRef<AgGridTableAPI>(null);
  const [tableWrapForm] = Form.useForm();
  const tableWrapFormRef = useRef<FormInstance>(null);

  const extraValueTypes = useContext(ExtraValueTypesContext);
  const searchFormActionsRef = useRef<Partial<SearchFormActions>>({});
  const { snapshotOfCurrentSearchParametersRef } = useSnapshotOfCurrentSearchParameters();
  const serachFormCurrentValuesRef = useRef<RecordType>();
  const selectionActionsRef = useActionsRef<Partial<SelectionsActions>>({});
  const requestDataSourceActionsRef = useRef<RequestDataSourceActions>(null);
  const treeSpreadActionsRef = useRef<TreeSpreadActions>(null);

  const [dataSource, setDataSource] = useState<OSTableValueType>();
  const [eventBus] = useState(new EventEmitter());

  const {
    settings,
    requests,
    autoRequestWhenMounted = true,
    getFieldItems,
    __localkey,
    extraActions,
    extraBatchOperation,
    extraRowActions,
  } = props;
  const {
    width,
    height = 570,
    theme = 'ag-theme-alpine',
    fieldItems: _fieldItems,
    editableRowKeys,
    pagination,
    actions,
    fieldItemSettings,
    singleSearchForm = true,
    tableKey,
    searchFormItemChunkSize,
    rowKey = 'id',
    searchFormSettings,
    batchOperation,
    rowActions,
    treeDatable,
  } = settings ?? {};

  const reload = () => {
    requestDataSourceActionsRef.current?.requestDataSource({});
  };

  /** 切换展开 */
  const switchHeaderFormSwitchMark = (open: boolean) => {
    tableWrapForm.setFieldsValue({
      [searchHeadFormSwitchIsOpenMarkId]: open,
    });
  };

  const tableCoreActionsRef = useActionsRef<TableCoreActions>({
    switchHeaderFormSwitchMark,
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
  } as TableCoreActions);

  const resetSearchForm = () => {
    searchFormActionsRef.current.resetSerachFormValues?.();
  };

  const setSearchFormCurrentValues = (values: RecordType) => {
    searchFormActionsRef.current.setSearchFormValues?.(values);
  };

  const tableActionsRef = useActionsRef<OSGridAPI>({
    reload,
    getSearchFormDataSource: () => {
      return searchFormActionsRef.current.getSearchFormDataSource?.();
    },
    setDataSource: (dataSource_?: RecordType[]) => {
      setDataSource(dataSource_);
    },
    resetSearchFormValues: resetSearchForm,
    setSearchFormCurrentValues,
    getColumnsSettingsVisibleMap: () => {
      return agGridRef.current?.columnApi.getColumnState().reduce((maps, next) => {
        if (next.colId) {
          return {
            ...maps,
            [next.colId]: !next.hide,
          };
        }
        return maps;
      }, {});
    },
    core: tableCoreActionsRef.current,
    gridRef: agGridRef,
  } as OSGridAPI);

  const allColumnsIdRef = useRef<string[]>([]);
  const columnsStaticPureConfigsIdMapsRef = useRef<
    Record<string, OSTableFormFieldItemWithStaticPureConfigs>
  >({});

  const {
    columnDefs,
    searchRequestOptionsMapDataIndexId,
    searchTransfromMapDataIndexId,
    searchFormFieldItems,
    enableSearchForm,
  } = useItems({
    tableKey,
    fieldItemSettings,
    fieldItems: _fieldItems,
    tableWrapForm,
    clsPrefix: prefixCls,
    editableRowKeys,
    allColumnsIdRef,
    columnsStaticPureConfigsIdMapsRef,
    rowKey,
    extraValueTypes,
    searchFormItemChunkSize,
    tableActionsRef,
    getFieldItems,
  });

  const {
    dom: searchFormDom,
    setSearchFormVisible,
    searchFormVisible,
    resetSerachFormValues,
    searchFormRef,
  } = useSearchForm({
    searchFormItemChunkSize,
    clsPrefix: prefixCls,
    __localkey,
    snapshotOfCurrentSearchParametersRef,
    searchFormFieldItems,
    ref: searchFormActionsRef,
    enable: enableSearchForm,
    searchFormSettings,
    serachFormCurrentValuesRef,
    tableKey,
  });

  const {
    dom: selectionDom,
    setSelectedRowKeys,
    setSelectedRows,
  } = useSelection({
    batchOperation,
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
  });

  const { loading, totalCount, current } = useRequestDataSource({
    tableKey,
    tableActionsRef,
    requestDataSource: requests?.requestDataSource,
    snapshotOfCurrentSearchParametersRef,
    searchTransfromMapDataIndexId,
    searchRequestOptionsMapDataIndexId,
    clearSelection,
    requestDataSourceActionsRef,
    setSarchTimeStr,
    autoRequestWhenMounted,
    searchFormRef,
    treeSpreadActionsRef,
  });

  const { dom: searchSwitchDom } = useSearchSwitch({
    searchFormVisible,
    resetSerachFormValues,
    setSearchFormVisible,
    requestDataSourceActionsRef,
    tableCoreActionsRef,
    enable: enableSearchForm,
    tableWrapRef,
  });

  const tableTopPanel = useTableTopPanel({
    selectionDom,
    singleSearchForm,
    searchFormFieldItems,
    searchFormItemChunkSize,
    searchFormDom,
    searchSwitchDom,
    actions,
    extraActions,
    tableActionsRef,
    clsPrefix: prefixCls,
  });

  const { columnDefs: mergedActionsColumnDefs } = useRowActions({
    columnDefs,
    rowKey,
    rowActions,
    clsPrefix: prefixCls,
    tableActionsRef,
    extraRowActions,
  });

  const { dom: paginationDom, pagination: paginationProps } = usePagination({
    current,
    pagination,
    totalCount,
    requestDataSourceActionsRef,
  });

  useImperativeHandle(ref, () => {
    return tableActionsRef.current;
  });

  const dataSourceWithTree = useMemo(() => {
    if (treeDatable && dataSource?.length) {
      const { valueKey, typeKey } = treeDatable;
      const spread = utl.flattenDeep(
        mapTreeNode(dataSource, (item, parent, parents) => {
          const getName = (it: RecordType) =>
            `${it[typeKey ?? ''] ?? '--'}: ${it[valueKey ?? ''] ?? '--'}`;
          if (item.children) {
            return [
              {
                ...item,
                paths: parents?.map(getName),
              },
              ...item.children,
            ];
          }
          return {
            ...item,
            paths: [...(parents ?? []), item]?.map(getName),
          };
        }),
      );
      return spread;
    }
    return dataSource;
  }, [dataSource, treeDatable]);

  return (
    <div ref={tableWrapRef} style={{ width }} className={prefixCls}>
      {tableTopPanel}
      <div style={{ height, width }}>
        {/* ag-grid 的编辑模式都为编辑后直接发送请求，这里的 form 的作用仅仅是为了编辑时，做 overlay 校验 */}
        <Form form={tableWrapForm} ref={tableWrapFormRef}>
          <Spin spinning={loading} indicator={<LoadingOutlined />}>
            <div className={theme} style={{ height, width }}>
              <AgGridReact
                // ag-grid 没有暴露 ref api
                ref={agGridRef as unknown as React.RefObject<AgGridReact>}
                defaultColDef={{
                  flex: 1,
                  minWidth: 100,
                  resizable: true,
                }}
                headerHeight={32}
                columnDefs={mergedActionsColumnDefs}
                pagination
                paginationPageSize={paginationProps.pageSize}
                suppressPaginationPanel
                frameworkComponents={{
                  'field-renderer': FieldRenderer,
                }}
                rowHeight={30}
                animateRows
                rowData={dataSourceWithTree}
                treeData={!!treeDatable}
                modules={AllModules as Module[]}
                localeText={AgGridLocalZhCN}
                sideBar={{
                  toolPanels: [
                    {
                      id: 'columns',
                      labelDefault: '列设置',
                      labelKey: 'columns',
                      iconKey: 'columns',
                      toolPanel: 'agColumnsToolPanel',
                      toolPanelParams: {
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressPivots: true,
                        suppressPivotMode: true,
                      },
                    },
                  ],
                }}
                autoGroupColumnDef={{
                  headerName: '分组',
                  minWidth: 250,
                }}
                allowDragFromColumnsToolPanel
                getDataPath={(data) => {
                  return data.paths;
                }}
              />
            </div>
          </Spin>
        </Form>
      </div>
      <Row justify="space-between" style={{ marginTop: 10 }}>
        <Col>{searchTimestampDom}</Col>
        <Col>{paginationDom}</Col>
      </Row>
    </div>
  );
};

export default React.forwardRef(OSGrid);

export const Settings: React.FC<OSGridType['settings']> = () => <></>;
