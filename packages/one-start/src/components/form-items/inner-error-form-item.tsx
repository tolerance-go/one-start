/* eslint-disable no-bitwise */
import { Form, Popover } from '@ty/antd';
import type { FormItemProps } from '@ty/antd/lib/form';
import utl from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import { TableWrapperContext } from '../providers/table-context';
import { useClsPrefix } from '../utils/use-cls-prefix';

const InlineErrorFormItem: React.FC<FormItemProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const clsPrefix = useClsPrefix('os-table-inline-error-form-item');
  const popoverRef = useRef<{
    /** 内部 api，强制调整位置 */
    forcePopupAlign: () => void;
  }>(null);

  const tableWrapperRef = useContext(TableWrapperContext);

  const cellRef = useRef<HTMLDivElement>(null);

  const getVisible = () => {
    return visible;
  };

  const actionsRef = useActionsRef({
    getVisible,
  });

  const [isIntersecting, setIsIntersecting] = useState(false);

  const setCellIntersecting = () => {
    const tableScrollWrapper =
      tableWrapperRef.current?.querySelector('.ty-ant-table-content') ??
      tableWrapperRef.current?.querySelector('.ty-ant-table-body');

    const cellEl = cellRef.current!;

    if (tableScrollWrapper) {
      const rootBounds = tableScrollWrapper.getBoundingClientRect();
      const change = cellEl.getBoundingClientRect();

      const fixRightWidth = utl.sumBy(
        Array.from(
          tableScrollWrapper.querySelectorAll('.ty-ant-table-thead th.ty-ant-table-cell-fix-right'),
        ) as HTMLElement[],
        (item) => item.offsetWidth,
      );

      const fixLeftWidth = utl.sumBy(
        Array.from(
          tableScrollWrapper.querySelectorAll('.ty-ant-table-thead th.ty-ant-table-cell-fix-left'),
        ) as HTMLElement[],
        (item) => item.offsetWidth,
      );

      const matchLeft = change.left > rootBounds.left + fixLeftWidth;
      const matchTop = change.top > rootBounds.top;
      const matchRight = change.right - change.width < rootBounds.right - fixRightWidth;
      const matchBottom = change.bottom < rootBounds.bottom;
      const isInner = matchLeft && matchTop && matchBottom && matchRight;

      /** 不能用 IntersectionObserver，他无法检测 fixed 的 table th */
      setIsIntersecting(isInner);
    }
  };

  useEffect(() => {
    const tableScrollWrapper =
      tableWrapperRef.current?.querySelector('.ty-ant-table-content') ??
      tableWrapperRef.current?.querySelector('.ty-ant-table-body');
    const handler = utl.debounce(() => {
      setCellIntersecting();

      if (actionsRef.current.getVisible()) {
        popoverRef.current?.forcePopupAlign();
      }
    }, 400);

    setCellIntersecting();

    tableScrollWrapper?.addEventListener('scroll', handler);

    return () => {
      tableScrollWrapper?.removeEventListener('scroll', handler);
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
            errors: any[];
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

          const visible_ = errors.length > 0;
          setTimeout(() => {
            setVisible(isIntersecting && visible_);
            /** 解决 tooltip 定位闪烁的问题 */
          }, 150);

          return (
            <Popover
              ref={popoverRef}
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
              zIndex={1}
            >
              <div ref={cellRef}>
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
