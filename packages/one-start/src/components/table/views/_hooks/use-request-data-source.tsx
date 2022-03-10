import type { SelectProps } from '@ty/antd';
import utl from 'lodash';
import moment from 'moment';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSSelectFieldValueType,
  OSTableAPI,
  OSTableFormFieldItemSearchType,
  OSTableRequestDataSourceParams,
  OSTableType,
  RequestIO,
  RequestOptions,
  TableCoreAPI,
  TableInlineAPI,
} from '../../../../typings';
import { useActionsRef } from '../../../../components/hooks/use-actions-ref';
import { normalizeRequestOutputs } from '../../../../components/utils/normalize-request-outputs';
import { unstateHistory } from '../../../../components/utils/unstate-history';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants';
import type { RequestDataSourceActions, SearchFormAPI, TreeSpreadActions } from '../../typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';
import { SHOW_MORE_FIELD_KEY } from '../../components/search-form';

const mapLevel = (
  rowData?: Record<string, any>[],
  level: number = 0,
): Record<string, any>[] | undefined => {
  return rowData?.map((item) => {
    return {
      ...item,
      level,
      children: mapLevel(item.children, level + 1),
    };
  });
};

export const useRequestDataSource = ({
  afterSearch,
  setFieldItemsState,
  requestDataSource,
  snapshotOfCurrentSearchParametersRef,
  searchTransfromMapDataIndexId,
  searchRequestOptionsMapDataIndexId,
  tableCoreActionsRef,
  clearSelection,
  requestDataSourceActionsRef,
  setSarchTimeStr,
  autoRequestWhenMounted,
  tableKey,
  tableActionsRef,
  requestVisualDataSource,
  searchFormRef,
  treeSpreadActionsRef,
  loopRequest,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultCurrent = DEFAULT_CURRENT,
  syncURLParams,
  currentTotalCountRef,
  tableInlineAPISRef,
}: {
  currentTotalCountRef: React.MutableRefObject<number | undefined>;
  defaultCurrent?: number;
  treeSpreadActionsRef: React.RefObject<TreeSpreadActions>;
  searchFormRef: React.MutableRefObject<SearchFormAPI | null>;
  defaultPageSize?: number;
  loopRequest?: number;
  tableKey?: string;
  autoRequestWhenMounted?: boolean;
  snapshotOfCurrentSearchParametersRef: MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  searchTransfromMapDataIndexId: Record<
    string,
    Required<OSTableFormFieldItemSearchType>['transform']
  >;
  searchRequestOptionsMapDataIndexId: Record<
    string,
    RequestIO<{ searchValue?: string }, SelectProps<OSSelectFieldValueType>['options']>
  >;
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  syncURLParams: boolean;
  tableInlineAPISRef: React.MutableRefObject<TableInlineAPI>;
  setSarchTimeStr: React.Dispatch<React.SetStateAction<string | undefined>>;
  clearSelection: () => void;
  requestDataSource?: Required<OSTableType>['requests']['requestDataSource'];
  requestVisualDataSource?: Required<OSTableType>['requests']['requestVisualDataSource'];
  setFieldItemsState: React.Dispatch<
    React.SetStateAction<Required<OSTableType>['settings']['fieldItems']>
  >;
  afterSearch?: Required<OSTableType>['hooks']['afterSearch'];
}) => {
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>();
  const [current, setCurrent] = useState<number | undefined>(defaultCurrent);

  /**
   * {
   *   [dataIndex]: {
   *      [value]: label
   *    }
   * }
   */
  const fieldOptionsMapDataIndexRef = useRef<Record<string, Record<string, string>>>();

  const getSearchData = () => {
    const searchValues = searchFormRef.current?.getSearchFormValues() ?? {};
    const searchValuesByTransformed = Object.keys(searchValues).reduce((obj, next) => {
      const val = searchValues[next];
      /** 查询 transform 然后执行转换 */
      if (searchTransfromMapDataIndexId[next]) {
        return {
          ...obj,
          ...searchTransfromMapDataIndexId[next](val),
        };
      }
      return {
        ...obj,
        [next]: val,
      };
    }, {});

    const normalizedValues =
      searchFormRef.current?.formRef.current?.normalizeFieldsValue(searchValuesByTransformed) ??
      searchValuesByTransformed;

    return normalizedValues;
  };

  const inlineAPIRef = useActionsRef({
    afterSearch,
    getSearchData,
  });

  const syncSearchTimestamp = useCallback(() => {
    setSarchTimeStr(moment().format('YYYY-MM-DD HH:mm:ss'));
  }, [setSarchTimeStr]);

  const requestVisualDataSource_ = useCallback(async () => {
    if (!requestVisualDataSource) return;
    const searchData = inlineAPIRef.current.getSearchData();
    const { error, data } = await requestVisualDataSource({
      search: searchData,
      actions: tableActionsRef.current,
      dataSource: tableActionsRef.current.getDataSource(),
    }).then(normalizeRequestOutputs);
    if (error) return;

    tableCoreActionsRef.current.setVisualDataSource(data);

    setCurrent(1);

    setTotalCount(data?.length);
    // eslint-disable-next-line no-param-reassign
    currentTotalCountRef.current = data?.length;

    syncSearchTimestamp();
  }, [
    currentTotalCountRef,
    inlineAPIRef,
    requestVisualDataSource,
    syncSearchTimestamp,
    tableActionsRef,
    tableCoreActionsRef,
  ]);

  const requestTableDataSource = useCallback(
    async (options: RequestOptions) => {
      if (!requestDataSource) return;

      if (loopRequest == null) {
        setLoading(true);
      }

      const { manualInitiate, mode, ...seachOptions } = options;
      const searchData = inlineAPIRef.current.getSearchData();

      const params: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
        {
          current: snapshotOfCurrentSearchParametersRef.current.current ?? 1,
          pageSize: snapshotOfCurrentSearchParametersRef.current.pageSize ?? defaultPageSize,
          ...seachOptions,
          search: utl.omit(searchData, [SHOW_MORE_FIELD_KEY]),
          actions: tableActionsRef.current,
        };

      const [{ error, data }, ...dataIndexAndSelectOptions] = await Promise.all([
        requestDataSource(params).then(normalizeRequestOutputs),
        ...(Object.keys(searchRequestOptionsMapDataIndexId).map((dataIndex) => {
          return searchRequestOptionsMapDataIndexId[dataIndex]({
            searchValue: undefined,
          })
            .then(normalizeRequestOutputs)
            .then(({ error: error_, data: data_ }) => {
              if (error_) return [dataIndex, {}];
              return [dataIndex, utl.fromPairs(data_?.map((item) => [item.value, item.label]))];
            });
        }) as Promise<any>[]),
      ]);

      if (loopRequest == null) {
        setLoading(false);
      }

      if (error) return;

      let renderPages = data?.page;
      renderPages = mapLevel(renderPages);

      fieldOptionsMapDataIndexRef.current = utl.fromPairs(dataIndexAndSelectOptions);

      setFieldItemsState(data?.fieldItems);
      setTotalCount(data?.total);

      // eslint-disable-next-line no-param-reassign
      currentTotalCountRef.current = data?.total;

      setCurrent(params.current);

      /** table 的 requestDataSource 会触发 onChange */
      tableActionsRef.current.setDataSource(renderPages);

      // eslint-disable-next-line no-param-reassign
      snapshotOfCurrentSearchParametersRef.current.current = params.current;
      // eslint-disable-next-line no-param-reassign
      snapshotOfCurrentSearchParametersRef.current.pageSize = params.pageSize;

      syncSearchTimestamp();
      clearSelection();
      treeSpreadActionsRef.current?.clearExpandedRowKeys();

      /** 执行相关 hooks */
      inlineAPIRef.current.afterSearch?.({
        manualInitiate,
        mode,
      });

      /** 搜索后默认选中全部 */
      if (tableInlineAPISRef.current.getRowSelection()?.defaultSelectAllAfterSearch) {
        tableInlineAPISRef.current.setSelectedRowsAndKeys(renderPages ?? []);
      }

      if (syncURLParams && manualInitiate && tableKey) {
        unstateHistory.push({
          pathname: window.location.pathname,
          query: {
            /** 包括 showMore 按钮状态 */
            searchValues: searchData,
            tableKey,
          },
          merged: true,
        });
      }
    },
    [
      tableInlineAPISRef,
      currentTotalCountRef,
      syncURLParams,
      inlineAPIRef,
      setFieldItemsState,
      syncSearchTimestamp,
      tableActionsRef,
      tableKey,
      requestDataSource,
      searchRequestOptionsMapDataIndexId,
      snapshotOfCurrentSearchParametersRef,
      clearSelection,
      treeSpreadActionsRef,
      loopRequest,
      defaultPageSize,
    ],
  );

  const actionsRef = useActionsRef(
    {
      setCurrent,
      requestDataSource: requestTableDataSource,
      requestVisualDataSource: requestVisualDataSource_,
      getFieldOptionsMapDataIndex: () => fieldOptionsMapDataIndexRef.current,
      getPagination: () => ({ current, total: totalCount }),
    },
    requestDataSourceActionsRef,
  );

  useEffect(() => {
    if (autoRequestWhenMounted) {
      requestTableDataSource({
        current: defaultCurrent,
        pageSize: defaultPageSize,
        mode: 'search',
      });
    }
  }, []);

  useEffect(() => {
    if (loopRequest != null) {
      const st = setInterval(() => {
        requestTableDataSource({});
      }, loopRequest);

      return () => {
        clearInterval(st);
      };
    }
    return undefined;
  }, []);

  return {
    loading,
    totalCount,
    actionsRef,
    current,
  };
};
