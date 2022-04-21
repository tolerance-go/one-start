import type { SelectProps } from '@ty/antd';
import type { SorterResult } from '@ty/antd/lib/table/interface';
import utl from 'lodash';
import moment from 'moment';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSFormAPI,
  OSSelectFieldValueType,
  OSGridAPI,
  OSTableFormFieldItemSearchType,
  OSTableRequestDataSourceParams,
  OSTableType,
  RecordType,
  RequestIO,
} from '@ty-one-start/typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { unstateHistory } from '../utils/unstate-history';
import { defaultPageSize } from './constants';
import type { RequestDataSourceActions, TreeSpreadActions } from './typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';

export const useRequestDataSource = ({
  requestDataSource,
  snapshotOfCurrentSearchParametersRef,
  searchTransfromMapDataIndexId,
  searchRequestOptionsMapDataIndexId,
  clearSelection,
  requestDataSourceActionsRef,
  setSarchTimeStr,
  autoRequestWhenMounted,
  tableKey,
  tableActionsRef,
  searchFormRef,
  treeSpreadActionsRef,
}: {
  treeSpreadActionsRef: React.RefObject<TreeSpreadActions>;
  searchFormRef: React.MutableRefObject<OSFormAPI | null>;
  tableKey?: string;
  autoRequestWhenMounted?: boolean;
  snapshotOfCurrentSearchParametersRef: MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  requestDataSource?: Required<OSTableType>['requests']['requestDataSource'];
  searchTransfromMapDataIndexId: Record<
    string,
    Required<OSTableFormFieldItemSearchType>['transform']
  >;
  searchRequestOptionsMapDataIndexId: Record<
    string,
    RequestIO<{ searchValue?: string }, SelectProps<OSSelectFieldValueType>['options']>
  >;
  tableActionsRef: React.MutableRefObject<OSGridAPI>;
  clearSelection: () => void;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  setSarchTimeStr: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>();
  const [current, setCurrent] = useState<number>();

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

  const syncSearchTimestamp = useCallback(() => {
    setSarchTimeStr(moment().format('YYYY-MM-DD HH:mm:ss'));
  }, [setSarchTimeStr]);

  const requestTableDataSource = useCallback(
    async (options: {
      current?: number;
      pageSize?: number;
      order?: SorterResult<RecordType>['order'];
      orderBy?: SorterResult<RecordType>['field'];
      /** 手动发起 */
      manualInitiate?: boolean;
    }) => {
      if (!requestDataSource) return;

      setLoading(true);

      const { manualInitiate, ...seachOptions } = options;
      const search = getSearch();

      const params: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
        {
          current: snapshotOfCurrentSearchParametersRef.current.current ?? 1,
          pageSize: snapshotOfCurrentSearchParametersRef.current.pageSize ?? defaultPageSize,
          params: {},
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

      setLoading(false);

      if (error) return;

      let renderPages = data?.page;

      fieldOptionsMapDataIndexRef.current = utl.fromPairs(dataIndexAndSelectOptions);

      /** 请求所有枚举，设置 dataSource 显示 */
      renderPages = renderPages?.map((item: [string, RecordType]) =>
        Object.keys(fieldOptionsMapDataIndexRef.current!).reduce((dist, key) => {
          return {
            ...dist,
            [key]: fieldOptionsMapDataIndexRef.current![key][dist[key]],
          };
        }, item),
      );

      setTotalCount(data?.total);
      setCurrent(params.current);

      /** table 的 requestDataSource 会触发 onChange */
      tableActionsRef.current.setDataSource(renderPages);
      /** 同步表格头部的 search form  */
      // tableCoreActionsRef.current.setHeaderFormValues(search);

      // eslint-disable-next-line no-param-reassign
      snapshotOfCurrentSearchParametersRef.current.current = params.current;
      // eslint-disable-next-line no-param-reassign
      snapshotOfCurrentSearchParametersRef.current.pageSize = params.pageSize;

      syncSearchTimestamp();
      clearSelection();
      treeSpreadActionsRef.current?.clearExpandedRowKeys();

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
      getSearch,
      syncSearchTimestamp,
      tableActionsRef,
      tableKey,
      requestDataSource,
      searchRequestOptionsMapDataIndexId,
      snapshotOfCurrentSearchParametersRef,
      clearSelection,
      treeSpreadActionsRef,
    ],
  );

  const actionsRef = useActionsRef(
    {
      requestDataSource: requestTableDataSource,
    },
    requestDataSourceActionsRef,
  );

  useEffect(() => {
    if (autoRequestWhenMounted) {
      requestTableDataSource({
        current: 1,
        pageSize: defaultPageSize,
      });
    }
  }, []);

  return {
    loading,
    totalCount,
    actionsRef,
    current,
  };
};
