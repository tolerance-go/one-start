import { Row, Typography } from '@ty/antd';
import cls from 'classnames';
import qs from 'qs';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import store from 'store2';
import type {
  OSFormAPI,
  OSFormFieldItems,
  OSTableType,
  RecordType,
  RequiredRecursion,
  TableCoreActions,
} from '../../typings';
import OSForm from '../form';
import { DEFAULT_LABEL_COL, DEFAULT_WRAPPER_COL } from '../form/constants';
import { useActionsRef } from '../hooks/use-actions-ref';
import {
  DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW,
  searchFormVisibleLocalField,
} from './constants';
import type { SearchFormActions } from './typings';
import type { SnapshotOfCurrentSearchParametersType } from './use-snapshot-of-current-search-parameters';

export const useSearchForm = ({
  dataSource,
  snapshotOfCurrentSearchParametersRef,
  searchFormFieldItems,
  tableCoreActionsRef,
  ref,
  enable,
  searchFormSettings,
  serachFormCurrentValuesRef: propSerachFormCurrentValuesRef,
  __localkey,
  tableKey,
  clsPrefix,
  searchFormItemChunkSize,
}: {
  dataSource?: RecordType[];
  clsPrefix: string;
  __localkey?: string;
  tableKey?: string;
  snapshotOfCurrentSearchParametersRef: React.MutableRefObject<SnapshotOfCurrentSearchParametersType>;
  searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
  searchFormSettings?: RequiredRecursion<OSTableType>['settings']['searchFormSettings'];
  searchFormFieldItems?: OSFormFieldItems;
  ref?: React.MutableRefObject<Partial<SearchFormActions>>;
  tableCoreActionsRef: React.MutableRefObject<TableCoreActions>;
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

    if (options?.updateOverlay !== false) {
      tableCoreActionsRef.current.setSearchHeadFormOverlayValues(values);
    }
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

  const singleLineFieldItemSize =
    searchFormItemChunkSize ?? DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW;

  const searchFormIsOneLine = searchFormFieldItems
    ? searchFormFieldItems.length <= singleLineFieldItemSize
    : false;

  const groupedSearchFormFieldItems = useMemo(() => {
    const shownLatestIndex =
      (searchFormFieldItems?.length ?? 0) > singleLineFieldItemSize * 2
        ? singleLineFieldItemSize * 2 - 2
        : (searchFormFieldItems?.length ?? 0) - 1;
    return [
      {
        type: 'group',
        settings: {
          key: `${tableKey}-search-group`,
        },
        children: (
          searchFormFieldItems?.map((item, index) => {
            const injectSearchFormItemSettings = {
              dataSource,
            };

            return {
              ...item,
              dependencies: ['showMore'],
              settings: (options) => {
                let { settings } = item;
                if (typeof item.settings === 'function') {
                  settings = item.settings({ ...options, ...injectSearchFormItemSettings });
                }

                const showMore = options.form.getFieldValue('showMore');

                return {
                  maxWidth: (() => {
                    /** 单行搜索表单 */
                    if (searchFormIsOneLine) {
                      return item.type === 'select' ? 400 : undefined;
                    }
                    return undefined;
                  })(),
                  ...settings,
                  colSpan: Math.round(24 / singleLineFieldItemSize),
                  hide: !showMore && index > shownLatestIndex,
                };
              },
            };
          }) as OSFormFieldItems
        ).concat(
          (searchFormFieldItems?.length ?? 0) - 1 > shownLatestIndex
            ? {
                type: 'custom',
                dependencies: ['showMore'],
                settings: ({ form }) => {
                  return {
                    dataIndex: 'showMore',
                    element: (
                      <Row justify="start">
                        <Typography.Link
                          onClick={() => {
                            form.setFieldsValue({
                              showMore: !form.getFieldValue('showMore'),
                            });
                          }}
                        >
                          {form.getFieldValue('showMore') ? '收起更多' : '展开更多'}
                        </Typography.Link>
                      </Row>
                    ),
                    colSpan: Math.round(24 / singleLineFieldItemSize),
                    wrapperCol: {
                      span:
                        searchFormSettings?.fieldItemSettings?.wrapperCol?.span ??
                        searchFormSettings?.wrapperCol?.span ??
                        DEFAULT_WRAPPER_COL.span,
                      offset:
                        searchFormSettings?.fieldItemSettings?.labelCol?.span ??
                        searchFormSettings?.labelCol?.span ??
                        DEFAULT_LABEL_COL.span,
                    },
                  };
                },
              }
            : [],
        ),
      },
    ] as OSFormFieldItems;
  }, [
    searchFormFieldItems,
    singleLineFieldItemSize,
    tableKey,
    dataSource,
    searchFormIsOneLine,
    searchFormSettings?.wrapperCol?.span,
    searchFormSettings?.fieldItemSettings?.wrapperCol?.span,
    searchFormSettings?.fieldItemSettings?.labelCol?.span,
    searchFormSettings?.labelCol?.span,
  ]);

  const dom = searchFormVisible ? (
    <div
      key="search"
      className={cls(`${clsPrefix}-search-form`, {
        inline: searchFormIsOneLine,
      })}
    >
      <OSForm
        ref={searchFormRef}
        onValuesChange={(changedValues, values) => {
          setSearchFormValues(values, { update: false });
        }}
        settings={{
          layout: searchFormIsOneLine ? 'inline' : 'horizontal',
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
