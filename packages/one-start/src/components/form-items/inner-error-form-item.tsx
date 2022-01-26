/* eslint-disable no-bitwise */
import { Form, Popover } from '@ty/antd';
import type { FormItemProps } from '@ty/antd/lib/form';
import utl from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import type { RecordType } from '../../typings';
import { useActionsRef } from '../hooks/use-actions-ref';
import { TableWrapperContext } from '../providers/table-context';
import { useClsPrefix } from '../utils/use-cls-prefix';

/** 找到最近的父级元素 */
const findClosestParentElement = (
  target: HTMLElement | undefined,
  predicate: (current: HTMLElement | undefined) => boolean,
): HTMLElement | undefined => {
  if (target == null) return undefined;

  if (predicate(target) === true) {
    return target;
  }

  if (target.parentElement) {
    return findClosestParentElement(target.parentElement, predicate);
  }

  return undefined;
};

const InlineErrorFormItem: React.FC<FormItemProps> = (props) => {
  const clsPrefix = useClsPrefix('os-table-inline-error-form-item');

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

  const actionsRef = useActionsRef({
    updateCenterState,
    updateFixedState,
  });

  useEffect(() => {
    const tableScrollWrapperDom = getTableScrollWrapperDom();

    const handleTableScroll = utl.debounce(
      () => {
        unstable_batchedUpdates(() => {
          setIsScrolling((prev) => !prev);
          actionsRef.current.updateCenterState();
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
    actionsRef.current.updateCenterState();
    actionsRef.current.updateFixedState();
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
          const { errors } = inputProps;

          const visible = (() => {
            if (cellIsFixed) {
              return errors.length > 0;
            }
            return !isScrolling && cellIsInCenterView && errors.length > 0;
          })();

          return (
            <Popover
              overlayClassName={`${clsPrefix}-popover-overlay`}
              trigger={props.trigger}
              placement="topLeft"
              visible={visible}
              content={<div>{errorList}</div>}
              autoAdjustOverflow
              getPopupContainer={() => {
                /** 解决弹窗内的表格关闭时候无法隐藏的问题 */
                return tableWrapperRef.current ?? document.body;
              }}
            >
              <div ref={cellRef} className="asldfjalsdjflajsdf">
                {input}
                {extra}
              </div>
            </Popover>
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
