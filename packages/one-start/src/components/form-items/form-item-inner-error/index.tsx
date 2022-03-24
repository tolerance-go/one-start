/* eslint-disable no-bitwise */
import { Form } from '@ty/antd';
import type { FormItemProps } from '@ty/antd/lib/form';
import utl from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import type { RecordType } from '../../../typings';
import { useActionsRef } from '../../hooks/use-actions-ref';
import {
  LayoutModalFormEventBusContext,
  LayoutTabsFormEventBusContext,
  LayoutTabsFormTabMetaContext,
} from '../../layout-form/layout-form-event-context';
import { TableAPIContext } from '../../providers/table-api-context';
import { TableWrapperContext } from '../../providers/table-context';
import { useClsPrefix } from '../../utils/use-cls-prefix';
import { ErrorPopover } from './error-popover';
import { findClosestParentElement } from './_utils';

const InlineErrorFormItem: React.FC<FormItemProps> = (props) => {
  const clsPrefix = useClsPrefix('os-table-inline-error-form-item');

  /** 是否手动关闭 */
  const [, setCount] = useState(0);

  const forceUpdate = () => {
    setCount((prev) => prev + 1);
  };

  const closeOnceRef = useRef<boolean>();

  const layoutModalFormEvent = useContext(LayoutModalFormEventBusContext);
  const layoutTabsFormEvent = useContext(LayoutTabsFormEventBusContext);
  const layoutTabsFormTabMeta = useContext(LayoutTabsFormTabMetaContext);

  const tableAPI = useContext(TableAPIContext);

  const tableWrapperRef = useContext(TableWrapperContext);

  const cellRef = useRef<HTMLDivElement>(null);

  /** cell 未被 fixed 列遮盖，注意遮盖定义 */
  const [cellIsInCenterView, setCellIsInCenterView] = useState(false);
  const [cellIsFixed, setCellIsFixed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const getTableScrollWrapperDom = () => {
    return (
      tableWrapperRef.current?.querySelector('.ty-ant-table-content') ??
      tableWrapperRef.current?.querySelector('.ty-ant-table-body')
    );
  };

  /** 判断 cell 是否在 fixed 列上 */
  const getCellIsFixed = (cellEl: HTMLElement) => {
    const tdEl = findClosestParentElement(cellEl, (item) => item?.tagName.toLowerCase() === 'td');

    if (
      tdEl?.classList.contains('ty-ant-table-cell-fix-left') ||
      tdEl?.classList.contains('ty-ant-table-cell-fix-right')
    ) {
      return true;
    }

    return false;
  };

  const getCellIsInCenterTableView = (cellEl: HTMLElement) => {
    const tableScrollWrapperDom = getTableScrollWrapperDom();

    const tableBodyDom = tableWrapperRef.current?.querySelector('.ty-ant-table-tbody');
    const tableHeadDom = tableWrapperRef.current?.querySelector('.ty-ant-table-thead');

    if (tableScrollWrapperDom && tableBodyDom && tableHeadDom) {
      const tableScrollWrapperRect = tableScrollWrapperDom.getBoundingClientRect();
      /** 单元格矩形 */
      const cellRect = cellEl.getBoundingClientRect();

      /** 右侧固定列宽度 */
      const fixRightColsWidth = utl.sumBy(
        Array.from(
          tableHeadDom.querySelectorAll('th.ty-ant-table-cell-fix-right'),
        ) as HTMLElement[],
        (item) => item.offsetWidth,
      );

      /** 左侧固定列宽度 */
      const fixLeftColsWidth = utl.sumBy(
        Array.from(tableHeadDom.querySelectorAll('th.ty-ant-table-cell-fix-left')) as HTMLElement[],
        (item) => item.offsetWidth,
      );

      /**
       * 表格减去左右固定列宽度，剩余的宽度称为中心宽度
       * 通过计算得到完整在中心区域内的 cell
       *
       * 不能用 IntersectionObserver，他无法检测 fixed 的 table th
       */
      const matchLeft = cellRect.left > tableScrollWrapperRect.left + fixLeftColsWidth;
      const matchTop = cellRect.top > tableScrollWrapperRect.top;
      const matchRight =
        cellRect.right - cellRect.width < tableScrollWrapperRect.right - fixRightColsWidth;
      const matchBottom = cellRect.bottom < tableScrollWrapperRect.bottom;

      return matchLeft && matchTop && matchBottom && matchRight;
    }

    return false;
  };

  const updateFixedState = () => {
    setCellIsFixed(getCellIsFixed(cellRef.current!));
  };

  const updateCenterState = () => {
    setCellIsInCenterView(getCellIsInCenterTableView(cellRef.current!));
  };

  const updatePositionState = () => {
    updateCenterState();
    updateFixedState();
  };

  const getCurrentActiveTabKey = () => {
    return layoutTabsFormTabMeta.formKey;
  };

  const apisRef = useActionsRef({
    updateCenterState,
    updateFixedState,
    updatePositionState,
    getCurrentActiveTabKey,
  });

  useEffect(() => {
    const tableScrollWrapperDom = getTableScrollWrapperDom();

    const handleTableScroll = utl.debounce(
      () => {
        unstable_batchedUpdates(() => {
          setIsScrolling((prev) => !prev);
          apisRef.current.updateCenterState();
        });
      },
      400,
      {
        leading: true,
      },
    );

    tableScrollWrapperDom?.addEventListener('scroll', handleTableScroll);

    return () => {
      tableScrollWrapperDom?.removeEventListener('scroll', handleTableScroll);
    };
  }, []);

  useEffect(() => {
    apisRef.current.updatePositionState();
  }, []);

  useEffect(() => {
    const handleLayoutFormAppear = () => {
      apisRef.current.updatePositionState();
    };

    const handleLayoutTabsFormAppear = (activeKey: string) => {
      if (activeKey === apisRef.current.getCurrentActiveTabKey()) {
        apisRef.current.updatePositionState();
      }
    };

    layoutModalFormEvent?.addListener('layout-modal-form-appear', handleLayoutFormAppear);
    layoutTabsFormEvent?.addListener('layout-tabs-form-appear', handleLayoutTabsFormAppear);
    return () => {
      layoutModalFormEvent?.removeListener('layout-modal-form-appear', handleLayoutFormAppear);
      layoutTabsFormEvent?.removeListener('layout-tabs-form-appear', handleLayoutTabsFormAppear);
    };
  }, []);

  return (
    <Form.Item
      style={{
        marginTop: -5,
        marginBottom: -5,
        marginLeft: 0,
        marginRight: 0,
      }}
      preserve={false}
      // @ts-ignore
      _internalItemRender={{
        mark: 'pro_table_render',
        render: (
          inputProps: FormItemProps & {
            errors: RecordType[];
          },
          {
            input,
            errorList,
            extra,
          }: {
            input: JSX.Element;
            errorList: JSX.Element;
            extra: JSX.Element;
          },
        ) => {
          const { errors, name } = inputProps;

          const visible = (() => {
            /** 当在 table 内时，支持关闭 */
            if (tableAPI.current) {
              const next = (() => {
                if (cellIsFixed) {
                  return errors.length > 0;
                }
                return !isScrolling && cellIsInCenterView && errors.length > 0;
              })();

              if (tableAPI.current.isChangeDebounce()) {
                /** 当用户输入当前单元格时，才将关闭的标记量关闭 */
                const inputs = tableAPI.current?.getIntervalLatestUserInputValue() ?? {};
                if (name && name[0] in inputs && name[1] in inputs[name[0]]) {
                  closeOnceRef.current = false;
                }
              }

              if (next === true) {
                if (closeOnceRef.current) {
                  if (tableAPI.current.isChangeDebounce() === false) {
                    closeOnceRef.current = false;
                  }
                  return false;
                }
              }

              return next;
            }

            return errors.length > 0;
          })();

          return (
            <ErrorPopover
              clsPrefix={clsPrefix}
              trigger={props.trigger}
              visible={visible}
              errorList={errorList}
              enableClose={!!tableAPI.current}
              getPopupContainer={() => {
                /** 解决弹窗内的表格关闭时候无法隐藏的问题 */
                return (
                  (cellRef.current
                    ? findClosestParentElement(
                        cellRef.current,
                        (item) =>
                          item.classList.contains('ty-ant-modal-content') ||
                          item.classList.contains('ty-ant-drawer-content'),
                      )
                    : null) ?? document.body
                );
              }}
              onClose={() => {
                closeOnceRef.current = true;
                forceUpdate();
              }}
            >
              <div ref={cellRef}>
                {input}
                {extra}
              </div>
            </ErrorPopover>
          );
        },
      }}
      {...props}
    >
      {props.children}
    </Form.Item>
  );
};

export default InlineErrorFormItem;
