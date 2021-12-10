import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Space } from '@ty/antd';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { TableCoreActions } from '../typings';
import { eventNames, searchFixedIconCls } from './constants';
import type { RequestDataSourceActions } from './typings';

export const useSearchSwitch = ({
  searchFormVisible,
  resetSerachFormValues,
  setSearchFormVisible,
  requestDataSourceActionsRef,
  tableCoreActionsRef,
  enable,
  tableWrapRef,
}: {
  searchFormVisible?: boolean;
  resetSerachFormValues: () => void;
  setSearchFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  requestDataSourceActionsRef: MutableRefObject<RequestDataSourceActions>;
  tableCoreActionsRef: React.MutableRefObject<TableCoreActions>;
  enable?: boolean;
  tableWrapRef: React.RefObject<HTMLDivElement>;
}) => {
  const toggleTableHeaderSearchDom = useCallback(() => {
    setTimeout(() => {
      const searchFilterBtnDom = Array.from(
        tableWrapRef.current?.querySelectorAll(`.${searchFixedIconCls}`) ?? [],
      );
      if (searchFormVisible) {
        searchFilterBtnDom.forEach((item) => item.parentElement?.classList.add('os-hidden'));
      } else {
        searchFilterBtnDom.forEach((item) => item.parentElement?.classList.remove('os-hidden'));
      }
    });
  }, [searchFormVisible, tableWrapRef]);

  const actionsRef = useActionsRef({
    toggleTableHeaderSearchDom,
  });

  useEffect(() => {
    tableCoreActionsRef.current.switchHeaderFormSwitchMark(searchFormVisible || false);
  }, [tableCoreActionsRef, searchFormVisible]);

  useEffect(() => {
    /** 保证可以获取到 dom 存在 */
    toggleTableHeaderSearchDom();
  }, [searchFormVisible, tableWrapRef, toggleTableHeaderSearchDom]);

  const resetButtonDom = searchFormVisible ? (
    <Button
      size="small"
      key="reset-btn"
      onClick={() => {
        resetSerachFormValues();

        requestDataSourceActionsRef.current?.requestDataSource({
          current: 1,
          manualInitiate: true,
        });

        tableCoreActionsRef.current.emit(eventNames.onSearchFormReset);
      }}
    >
      重置
    </Button>
  ) : null;

  const searchButtonDom = searchFormVisible ? (
    <Button
      size="small"
      type="primary"
      key="search-btn"
      onClick={() => {
        requestDataSourceActionsRef.current?.requestDataSource({
          current: 1,
          manualInitiate: true,
        });
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
      size="small"
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

  return {
    dom: enable ? (
      <Space size={5}>
        {resetButtonDom}
        {searchButtonDom}
        {switchDom}
      </Space>
    ) : undefined,
    actionsRef,
  };
};
