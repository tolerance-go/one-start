import type { SelectProps } from '@ty/antd';
import utl from 'lodash';
import moment from 'moment';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSFormAPI,
  OSSelectFieldValueType,
  OSTableAPI,
  OSTableFormFieldItemSearchType,
  OSTableRequestDataSourceParams,
  OSTableType,
  RequestIO,
  RequestOptions,
  TableCoreActions,
} from '../../typings';
import { useActionsRef } from '../hooks/use-actions-ref';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { unstateHistory } from '../utils/unstate-history';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from './constants';
import type { RequestDataSourceActions, TreeSpreadActions } from './typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';

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
}: {
  afterSearch?: Required<OSTableType>['hooks']['afterSearch'];
  defaultCurrent?: number;
  setFieldItemsState: React.Dispatch<
    React.SetStateAction<Required<OSTableType>['settings']['fieldItems']>
  >;
  treeSpreadActionsRef: React.RefObject<TreeSpreadActions>;
  searchFormRef: React.MutableRefObject<OSFormAPI | null>;
  defaultPageSize?: number;
  loopRequest?: number;
  tableKey?: string;
  autoRequestWhenMounted?: boolean;
  snapshotOfCurrentSearchParametersRef: MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  requestDataSource?: Required<OSTableType>['requests']['requestDataSource'];
  requestVisualDataSource?: Required<OSTableType>['requests']['requestVisualDataSource'];
  searchTransfromMapDataIndexId: Record<
    string,
    Required<OSTableFormFieldItemSearchType>['transform']
  >;
  searchRequestOptionsMapDataIndexId: Record<
    string,
    RequestIO<{ searchValue?: string }, SelectProps<OSSelectFieldValueType>['options']>
  >;
  tableCoreActionsRef: React.MutableRefObject<TableCoreActions>;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  clearSelection: () => void;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  setSarchTimeStr: React.Dispatch<React.SetStateAction<string | undefined>>;
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

  const getSearch = useCallback(() => {
    const search = Object.keys(snapshotOfCurrentSearchParametersRef.current.search).reduce(
      (obj, next) => {
        const val = snapshotOfCurrentSearchParametersRef.current.search[next];

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
      },
      {},
    );
    return searchFormRef.current?.normalizeFieldsValue(search) ?? search;
  }, [searchFormRef, searchTransfromMapDataIndexId, snapshotOfCurrentSearchParametersRef]);

  const inlineAPIRef = useActionsRef({
    afterSearch,
  });

  const syncSearchTimestamp = useCallback(() => {
    setSarchTimeStr(moment().format('YYYY-MM-DD HH:mm:ss'));
  }, [setSarchTimeStr]);

  const requestVisualDataSource_ = useCallback(async () => {
    if (!requestVisualDataSource) return;
    const search = getSearch();
    const { error, data } = await requestVisualDataSource({
      search,
      actions: tableActionsRef.current,
      dataSource: tableActionsRef.current.getDataSource(),
    }).then(normalizeRequestOutputs);
    if (error) return;

    tableCoreActionsRef.current.setVisualDataSource(data);

    /** 同步表格头部的 search form  */
    tableCoreActionsRef.current.setHeaderFormValues(search);

    setCurrent(1);
    setTotalCount(data?.length);

    syncSearchTimestamp();
  }, [
    getSearch,
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
      const search = getSearch();

      const params: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
        {
          current: snapshotOfCurrentSearchParametersRef.current.current ?? 1,
          pageSize: snapshotOfCurrentSearchParametersRef.current.pageSize ?? defaultPageSize,
          ...seachOptions,
          search,
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
      setCurrent(params.current);

      /** table 的 requestDataSource 会触发 onChange */
      tableActionsRef.current.setDataSource(renderPages);
      /** 同步表格头部的 search form  */
      tableCoreActionsRef.current.setHeaderFormValues(search);

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

      if (manualInitiate && tableKey) {
        unstateHistory.push({
          pathname: window.location.pathname,
          query: {
            searchValues: params.search,
            tableKey,
          },
          merged: true,
        });
      }
    },
    [
      inlineAPIRef,
      setFieldItemsState,
      getSearch,
      syncSearchTimestamp,
      tableActionsRef,
      tableKey,
      requestDataSource,
      searchRequestOptionsMapDataIndexId,
      snapshotOfCurrentSearchParametersRef,
      tableCoreActionsRef,
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
