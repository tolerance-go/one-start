import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';
import type { TableCoreAPI } from '@ty-one-start/typings';
import { eventNames } from '../../constants';
import type { RequestDataSourceActions, SearchFormAPI } from '../../typings';

const SearchSwitcher: React.ForwardRefRenderFunction<
  {},
  {
    searchFormVisible?: boolean;
    searchFormRef: React.RefObject<SearchFormAPI>;
    isExistPropsRequestVisualDataSource: boolean;
    requestDataSourceActionsRef: React.RefObject<RequestDataSourceActions>;
    tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
    setSearchFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({
  searchFormVisible,
  searchFormRef,
  isExistPropsRequestVisualDataSource,
  requestDataSourceActionsRef,
  tableCoreActionsRef,
  setSearchFormVisible,
}) => {
  const resetButtonDom = searchFormVisible ? (
    <Button
      className="reset-button"
      key="reset-button"
      onClick={() => {
        searchFormRef.current?.resetSearchForm();

        /** reset 后立即 validate 会失效，所以添加到 loop 里面 */
        setTimeout(() => {
          if (isExistPropsRequestVisualDataSource) {
            requestDataSourceActionsRef.current?.requestVisualDataSource();
          } else {
            requestDataSourceActionsRef.current?.requestDataSource({
              current: 1,
              manualInitiate: true,
              mode: 'reset',
            });
          }

          tableCoreActionsRef.current.emit(eventNames.onSearchFormReset);
        });
      }}
    >
      重置
    </Button>
  ) : null;

  const searchButtonDom = searchFormVisible ? (
    <Button
      type="primary"
      key="search-button"
      className="search-button"
      onClick={() => {
        if (isExistPropsRequestVisualDataSource) {
          requestDataSourceActionsRef.current?.requestVisualDataSource();
        } else {
          requestDataSourceActionsRef.current?.requestDataSource({
            current: 1,
            manualInitiate: true,
            mode: 'search',
          });
        }
      }}
    >
      搜索
    </Button>
  ) : null;

  const switchDom = (
    <Button
      onClick={() =>
        setSearchFormVisible((prev) => {
          const val = !prev;
          tableCoreActionsRef.current.emit(eventNames.switchedSearchForm, {
            open: val,
          });
          return val;
        })
      }
      type="link"
    >
      <span>{searchFormVisible ? '收起' : '展开'}</span>
      {searchFormVisible ? (
        <DownOutlined style={{ fontSize: 12, marginLeft: 4 }} />
      ) : (
        <UpOutlined style={{ fontSize: 12, marginLeft: 4 }}></UpOutlined>
      )}
    </Button>
  );

  return (
    <Space size={5}>
      {resetButtonDom}
      {searchButtonDom}
      {switchDom}
    </Space>
  );
};

export default React.forwardRef(SearchSwitcher);
