import { ConfigProvider, Select, Spin } from '@ty/antd';
import type { SelectProps, SelectValue } from '@ty/antd/lib/select';
import cls from 'classnames';
import utl from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './styles.less';

type ProSelectOptions = {
  label: React.ReactNode;
  value: React.ReactText;
  [key: string]: any;
}[];

interface SearchableSelectProps<T extends SelectValue = SelectValue> extends SelectProps<T> {
  request?: (
    params: SearchableSelectProps<T> & {
      searchValue: string;
    },
  ) => Promise<ProSelectOptions>;
  /** 开启模糊查询 */
  searchable?: boolean;
}

const SearchableSelect = <T extends SelectValue = SelectValue>(props: SearchableSelectProps<T>) => {
  const lastFetchIdRef = useRef(0);

  const [asyncOptions, setAsyncOptions] = useState<ProSelectOptions>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const prefixCls = getPrefixCls('searchable-select');

  /** 是否开启模糊搜索 */
  const startSearchable = useMemo(() => {
    if (props.request) {
      return props.searchable ?? true;
    }
    return false;
  }, [props.request, props.searchable]);

  const handleDataSouce = (value: string) => {
    lastFetchIdRef.current += 1;
    const fetchId = lastFetchIdRef.current;
    setAsyncOptions([]);
    setFetchLoading(true);
    props
      ?.request?.({
        ...props,
        searchValue: value,
      })
      .then((result = []) => {
        if (fetchId !== lastFetchIdRef.current) {
          return;
        }
        setAsyncOptions(result);
        setFetchLoading(false);
      });
  };

  const handleSearch: SelectProps<T>['onSearch'] = useCallback(
    utl.debounce((value) => {
      props.onSearch?.(value);
      handleDataSouce(value);
    }, 450),
    [props.request, props.onSearch],
  );

  const handleChange: SelectProps<T>['onChange'] = useCallback(
    (value, option) => {
      props.onChange?.(value, option);
      /** 当搜索选择框为 多选时,每次触发onChange事件时都会 清空选项，导致多选选择框选择一个选项后就自动关闭 */
      // setAsyncOptions([]);
      setFetchLoading(false);
    },
    [props.onChange],
  );

  const handleClear: SelectProps<T>['onClear'] = useCallback(() => {
    props.onClear?.();
    handleDataSouce('');
  }, [props.request, props.onClear]);

  const finalOnChange = useMemo((): SelectProps<T>['onChange'] => {
    if (startSearchable) {
      return handleChange;
    }
    return props.onChange;
  }, [startSearchable, handleChange, props.onChange]);

  const finalOnSearch = useMemo((): SelectProps<T>['onSearch'] => {
    if (startSearchable) {
      return handleSearch;
    }
    return props.onSearch;
  }, [startSearchable, handleSearch, props.onSearch]);

  const finalOnClear = useMemo((): SelectProps<T>['onClear'] => {
    if (startSearchable) {
      return handleClear;
    }
    return props.onClear;
  }, [startSearchable, handleClear, props.onClear]);

  const finalOptions = useMemo(() => {
    if (startSearchable) {
      return asyncOptions;
    }
    return props.options;
  }, [startSearchable, asyncOptions, props.options]);

  const finalNotFoundContent = useMemo(() => {
    if (startSearchable) {
      return fetchLoading ? <Spin size="small" /> : null;
    }
    return props.notFoundContent;
  }, [startSearchable, fetchLoading, props.notFoundContent]);

  const finalFilterOption = useMemo(() => {
    if (startSearchable) {
      return false;
    }

    return props.filterOption;
  }, [startSearchable, props?.filterOption]);

  const { request, ...rest } = props;

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <Select
      {...rest}
      className={cls(props.className, prefixCls)}
      onChange={finalOnChange}
      options={finalOptions}
      notFoundContent={finalNotFoundContent}
      filterOption={finalFilterOption}
      onSearch={finalOnSearch}
      onClear={finalOnClear}
      showSearch={startSearchable ? true : props.showSearch}
      allowClear={startSearchable ? true : props.allowClear}
    />
  );
};

export { SearchableSelect };
