import cls from 'classnames';
import qs from 'qs';
import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import type {
  OSFormAPI,
  OSFormFieldItems,
  OSTableType,
  RecordType,
  RequiredRecursion,
} from '../../../../typings';
import OSForm from '../../../form';
import { DEFAULT_LABEL_COL, DEFAULT_WRAPPER_COL } from '../../../form/constants';
import { useActionsRef } from '../../../hooks/use-actions-ref';
import { DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW } from '../../constants';
import type { SearchFormAPI } from '../../typings';
import { SearchCollapse } from './search-collapse';
import utl from 'lodash';

export const SHOW_MORE_FIELD_KEY = 'showMore';

const SearchForm: React.ForwardRefRenderFunction<
  SearchFormAPI,
  {
    clsPrefix: string;
    searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
    searchFormSettings?: RequiredRecursion<OSTableType>['settings']['searchFormSettings'];
    dataSource?: RecordType[];
    searchFormFieldItems?: OSFormFieldItems;
    tableKey?: string;
    searchFormVisible: boolean;
    formCurrentValuesRef: React.MutableRefObject<RecordType | undefined>;
    syncURLParams: boolean;
  }
> = (
  {
    /** plh */
    clsPrefix,
    searchFormSettings,
    searchFormItemChunkSize,
    dataSource,
    searchFormFieldItems,
    tableKey,
    searchFormVisible,
    formCurrentValuesRef,
    syncURLParams,
  },
  ref,
) => {
  /** 搜索表单的实例 */
  const formRef = useRef<OSFormAPI>(null);

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
              dependencies: [SHOW_MORE_FIELD_KEY, ...(item.dependencies ?? [])],
              settings: (options) => {
                let { settings } = item;
                if (typeof item.settings === 'function') {
                  settings = item.settings({ ...options, ...injectSearchFormItemSettings });
                }

                const showMore = options.form.getFieldValue(SHOW_MORE_FIELD_KEY);

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
                  visible: !(!showMore && index > shownLatestIndex),
                };
              },
            };
          }) as OSFormFieldItems
        ).concat(
          (searchFormFieldItems?.length ?? 0) - 1 > shownLatestIndex
            ? {
                type: 'custom',
                settings: {
                  dataIndex: SHOW_MORE_FIELD_KEY,
                  element: <SearchCollapse />,
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

  const setSearchFormValues = (values?: RecordType) => {
    return formRef.current?.setFieldsValue(values);
  };

  const resetSearchForm = () => {
    formRef.current?.resetFields?.();
  };

  /** 可能隐藏，获取全部字段 */
  const getSearchFormValues = () => formRef.current?.getFieldsValue();

  const getSearchFormDataSource = () => formRef.current?.getDataSource();

  const isValidate = () =>
    formRef.current
      ? formRef.current?.validate().then(({ error }) => !error)
      : /** 表单实例不存在时候，表示无效 */
        Promise.resolve(false);

  useImperativeHandle(ref, () => ({
    formRef,
    resetSearchForm,
    setSearchFormValues,
    getSearchFormValues,
    getSearchFormDataSource,
    isValidate,
  }));

  const inlineAPIRef = useActionsRef({
    getFormCurrentValues: () => formCurrentValuesRef.current,
  });

  /** 从 url 获取数据同步搜索表单 */
  useLayoutEffect(() => {
    if (syncURLParams) {
      const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

      if (query.tableKey === tableKey && typeof query.searchValues === 'object') {
        /** TODO: 根据表单类型进行转换 */
        formRef.current?.setFieldsValue(
          utl.mapValues(query.searchValues, (value) => {
            if (value === 'false') {
              return false;
            }
            if (value === 'true') {
              return true;
            }
            return value;
          }),
        );
      }
    }
  }, [tableKey, syncURLParams]);

  /** 切换隐藏表单，需要同步关闭前的数据 */
  useEffect(() => {
    if (searchFormVisible && inlineAPIRef.current.getFormCurrentValues()) {
      formRef.current?.setFieldsValue(inlineAPIRef.current.getFormCurrentValues());
    }
  }, [searchFormVisible, inlineAPIRef]);

  return (
    <div
      className={cls(`${clsPrefix}-search-form`, {
        inline: searchFormIsOneLine,
      })}
    >
      <OSForm
        ref={formRef}
        /** onValuesChange values 里面不包括 hide fields */
        onValuesChange={() => {
          // eslint-disable-next-line no-param-reassign
          formCurrentValuesRef.current = formRef.current?.getFieldsValue(true);
        }}
        settings={{
          changeDebounceTimestamp: 0,
          layout: searchFormIsOneLine ? 'inline' : 'horizontal',
          ...searchFormSettings,
          fieldItems: groupedSearchFormFieldItems,
        }}
      ></OSForm>
    </div>
  );
};

export default React.forwardRef(SearchForm);
