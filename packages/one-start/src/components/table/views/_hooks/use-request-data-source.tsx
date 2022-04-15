import { useUpdateEffect } from 'ahooks';
import utl from 'lodash';
import moment from 'moment';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActionsRef } from '../../../../components/hooks/use-actions-ref';
import { normalizeRequestOutputs } from '../../../../components/utils/normalize-request-outputs';
import { unstateHistory } from '../../../../components/utils/unstate-history';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSTableAPI,
  OSTableFormFieldItemSearchType,
  OSTableRequestDataSourceParams,
  OSTableType,
  RecordType,
  RequestOptions,
  TableCoreAPI,
  TableInlineAPI,
} from '../../../../typings';
import { SHOW_MORE_FIELD_KEY } from '../../components/search-form';
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants';
import type { RequestDataSourceActions, SearchFormAPI, TreeSpreadActions } from '../../typings';
import type { SearchRequestOptionsMapColIdType } from '../_typeings';
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
  searchRequestOptionsMapColIdRef,
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
  requestParamsWithRequestDataSource,
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
  searchRequestOptionsMapColIdRef: SearchRequestOptionsMapColIdType;
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
  requestDataSourceActionsRef: React.MutableRefObject<RequestDataSourceActions>;
  syncURLParams: boolean;
  tableInlineAPISRef: React.MutableRefObject<TableInlineAPI>;
  requestParamsWithRequestDataSource?: RecordType;
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
  const fieldOptionsMapColIdRef = useRef<Record<string, Record<string, string>>>();

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

  const requestTableDataSource = async (options: RequestOptions) => {
    if (!requestDataSource) return;

    if (searchFormRef.current) {
      if (searchFormRef.current.isExist()) {
        const searchFormIsValidate = await searchFormRef.current.isValidate();
        if (!searchFormIsValidate) return;
      }
    }

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
        params: {
          ...requestParamsWithRequestDataSource,
          ...seachOptions.params,
        },
        search: utl.omit(searchData, [SHOW_MORE_FIELD_KEY]),
        actions: tableActionsRef.current,
      };

    const [{ error, data }, ...dataIndexAndSelectOptions] = await Promise.all([
      requestDataSource(params).then(normalizeRequestOutputs),
      ...(Object.keys(searchRequestOptionsMapColIdRef)
        .filter((colId) => {
          const { enableShowSearch, showSearchType } = searchRequestOptionsMapColIdRef[colId];
          return enableShowSearch === false || (enableShowSearch && showSearchType === 'local');
        })
        .map((colId) => {
          const { request } = searchRequestOptionsMapColIdRef[colId];
          return request({
            searchValue: undefined,
          })
            .then(normalizeRequestOutputs)
            .then(({ error: error_, data: data_ }) => {
              if (error_) return [colId, {}];
              return [colId, utl.fromPairs(data_?.map((item) => [item.value, item.label]))];
            });
        }) as Promise<any>[]),
    ]);

    const remoteSearchColIds = Object.keys(searchRequestOptionsMapColIdRef).filter((colId) => {
      const { enableShowSearch, showSearchType } = searchRequestOptionsMapColIdRef[colId];
      return enableShowSearch && showSearchType === 'remote';
    });

    if (remoteSearchColIds.length) {
      const remoteDataIndexAndSelectOptions = await Promise.all([
        ...(remoteSearchColIds.map((colId) => {
          const { request, dataIndexId } = searchRequestOptionsMapColIdRef[colId];
          return request({
            searchValue: undefined,
            searchKeys: (() => {
              const keys = data?.page?.map((item: RecordType) => item[dataIndexId]);
              if (keys?.length) {
                return utl.union(keys);
              }
              return keys;
            })(),
          })
            .then(normalizeRequestOutputs)
            .then(({ error: error_, data: data_ }) => {
              if (error_) return [colId, {}];
              return [colId, utl.fromPairs(data_?.map((item) => [item.value, item.label]))];
            });
        }) as Promise<any>[]),
      ]);

      fieldOptionsMapColIdRef.current = utl.fromPairs(
        dataIndexAndSelectOptions.concat(remoteDataIndexAndSelectOptions),
      );
    } else {
      fieldOptionsMapColIdRef.current = utl.fromPairs(dataIndexAndSelectOptions);
    }

    if (loopRequest == null) {
      setLoading(false);
    }

    if (error) return;

    let renderPages = data?.page;
    renderPages = mapLevel(renderPages);

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

    /** 触发 core api 上相关的事件 */
    tableCoreActionsRef.current.emit('initedTableDataSource', renderPages);
  };

  const actionsRef = useActionsRef(
    {
      setCurrent,
      requestDataSource: requestTableDataSource,
      requestVisualDataSource: requestVisualDataSource_,
      getFieldOptionsMapColId: () => fieldOptionsMapColIdRef.current,
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

  useUpdateEffect(() => {
    requestTableDataSource({
      current: defaultCurrent,
      pageSize: defaultPageSize,
      mode: 'search',
    });
  }, [JSON.stringify(requestParamsWithRequestDataSource)]);

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
