import qs from 'qs';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import store from 'store2';
import {OSForm} from '@ty-one-start/forms';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSFormAPI, OSFormFieldItems, OSTableType, RecordType } from '@ty-one-start/typings';
import {
  DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW,
  searchFormVisibleLocalField,
} from './constants';
import type { SearchFormActions } from './typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';

export const useSearchForm = ({
  snapshotOfCurrentSearchParametersRef,
  searchFormFieldItems,
  ref,
  enable,
  searchFormSettings,
  serachFormCurrentValuesRef: propSerachFormCurrentValuesRef,
  __localkey,
  tableKey,
  clsPrefix,
  searchFormItemChunkSize,
}: {
  clsPrefix: string;
  __localkey?: string;
  tableKey?: string;
  snapshotOfCurrentSearchParametersRef: React.MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  searchFormItemChunkSize?: Required<OSTableType>['settings']['searchFormItemChunkSize'];
  searchFormSettings?: Required<OSTableType>['settings']['searchFormSettings'];
  searchFormFieldItems?: OSFormFieldItems;
  ref?: React.MutableRefObject<Partial<SearchFormActions>>;
  enable?: boolean;
  serachFormCurrentValuesRef: React.MutableRefObject<RecordType | undefined>;
}) => {
  const searchFormVisibleLocalFieldKey = `${__localkey}_${window.location.pathname}_${searchFormVisibleLocalField}`;

  const [searchFormVisible, setSearchFormVisible] = useState<boolean>(
    store.get(searchFormVisibleLocalFieldKey, true),
  );

  /** 搜索表单的实例 */
  const searchFormRef = useRef<OSFormAPI>(null);

  /** 搜索表单当前的值 */
  const serachFormCurrentValuesRef = useRef<RecordType>();

  const setSearchFormValues = (
    values: RecordType,
    options?: { update?: boolean; updateOverlay?: boolean },
  ) => {
    // eslint-disable-next-line no-multi-assign, no-param-reassign
    serachFormCurrentValuesRef.current = propSerachFormCurrentValuesRef.current = {
      ...serachFormCurrentValuesRef.current,
      ...values,
    };

    // eslint-disable-next-line no-param-reassign
    snapshotOfCurrentSearchParametersRef.current.search = {
      ...snapshotOfCurrentSearchParametersRef.current.search,
      ...values,
    };

    if (options?.update !== false) {
      searchFormRef.current?.setFieldsValue?.(values);
    }

    // if (options?.updateOverlay !== false) {
    //   tableCoreActionsRef.current.setSearchHeadFormOverlayValues(values);
    // }
  };

  const getSearchFormDataSource = () => {
    return searchFormRef.current?.getDataSource();
  };

  const resetSerachFormValues = () => {
    searchFormRef.current?.resetFields?.();
    setSearchFormValues(searchFormRef.current?.getFieldsValue?.() ?? {}, {
      update: false,
    });
  };

  const groupedSearchFormFieldItems = useMemo(() => {
    const size = searchFormItemChunkSize ?? DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW;
    return [
      {
        type: 'group',
        settings: {
          key: `${tableKey}-search-group`,
        },
        children: searchFormFieldItems?.map((item) => {
          return {
            ...item,
            settings: {
              ...item.settings,
              colSpan: Math.round(24 / size),
            },
          };
        }),
      },
    ] as OSFormFieldItems;
  }, [searchFormItemChunkSize, tableKey, searchFormFieldItems]);

  const dom = searchFormVisible ? (
    <div key="search" className={`${clsPrefix}-search-form`}>
      <OSForm
        ref={searchFormRef}
        onValuesChange={(changedValues, values) => {
          setSearchFormValues(values, { update: false });
        }}
        settings={{
          ...searchFormSettings,
          fieldItems: groupedSearchFormFieldItems,
        }}
      ></OSForm>
    </div>
  ) : null;

  useEffect(() => {
    store.set(searchFormVisibleLocalFieldKey, searchFormVisible);
  }, [searchFormVisibleLocalFieldKey, searchFormVisible]);

  /** 当切换搜索表单的时候，恢复当前值 */
  useEffect(() => {
    /** 保证拿到 ref */
    if (searchFormVisible) {
      setTimeout(() => {
        searchFormRef.current?.setFieldsValue?.(serachFormCurrentValuesRef.current);
      });
    }
  }, [searchFormVisible]);

  /** 从 url 初始化搜索表单 */
  useLayoutEffect(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (query.tableKey === tableKey && typeof query.searchValues === 'object') {
      searchFormRef.current?.setFieldsValue(query.searchValues);
    }
  }, [tableKey]);

  /** 设置一次搜索表单初始值 */
  useEffect(() => {
    setSearchFormValues(searchFormRef.current?.getFieldsValue() ?? {}, { update: false });
  }, []);

  const actionsRef = useActionsRef(
    {
      setSearchFormValues,
      resetSerachFormValues,
      getSearchFormDataSource,
      getCurrentSearchFormFieldItems: () => searchFormFieldItems,
    },
    ref,
  );

  return {
    dom: enable ? dom : undefined,
    setSearchFormVisible,
    searchFormVisible,
    resetSerachFormValues,
    setSearchFormValues,
    actionsRef,
    searchFormRef,
  };
};
