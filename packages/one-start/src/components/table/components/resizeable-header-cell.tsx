import { useRef, useState, useMemo, useCallback } from 'react';
import { useClsPrefix } from '../../utils/use-cls-prefix';
import utl from 'lodash';
import cls from 'classnames';
import type { TableCoreAPI } from '../../../typings';
import { eventNames } from '../constants';

export type ResizeableHeaderCellProps = {
  minColumnWidth: number;
  columnKey: string;
  tableWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  colDefaultWidth: number;
  resizeable?: boolean;
  /** columns tree 的右侧边节点 */
  last?: boolean;
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
} & React.HTMLAttributes<HTMLTableCellElement>;

export const ResizeableHeaderCell: React.ForwardRefRenderFunction<
  HTMLTableCellElement,
  ResizeableHeaderCellProps
> = (props) => {
  const clsPrefix = useClsPrefix('resizeable-header-cell');
  const handlerRef = useRef<HTMLSpanElement>(null);
  const {
    children,
    tableCoreActionsRef,
    tableWrapRef,
    minColumnWidth,
    colDefaultWidth,
    resizeable,
    last,
    ...rest
  } = props;

  const thRef = useRef<HTMLTableCellElement>(null);

  const [active, setActive] = useState(false);

  const dispatchResizeEvent = () => {
    if (document.createEvent) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, true);
      window.dispatchEvent(event);
    }
  };

  const debounceDispatchResizeEvent = utl.debounce(() => {
    dispatchResizeEvent();
  }, 100);

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!handlerRef.current || !tableWrapRef.current || !thRef.current) return;

      const table = tableWrapRef.current.querySelector(`table`) as HTMLElement | null;

      if (!table) return;

      const getColGroupItem = () => {
        const thDoms = table?.querySelectorAll('thead tr th');
        const index = Array.from(thDoms ?? [])
          .filter((item) => !item.getAttribute('colspan'))
          .findIndex((item) => item === thRef.current);
        if (index > -1) {
          /** 有竖向滚动的状态下，表格 head 和 body 是在不同的 div 里 */
          const getColgroupParent = () => {
            if (table?.querySelector('.ty-ant-table-content')) {
              return '.ty-ant-table';
            }
            return '.ty-ant-table .ty-ant-table-body table >';
          };

          const colgroupItem = tableWrapRef.current!.querySelector(
            `${getColgroupParent()} colgroup col:nth-child(${index + 1})`,
          ) as HTMLElement | null;
          return colgroupItem;
        }
        return null;
      };

      const colgroupItem = getColGroupItem();

      if (!colgroupItem) return;

      handlerRef.current.setAttribute('data-start-x', e.pageX.toString());
      handlerRef.current.setAttribute('data-start-width', colgroupItem.style.width ?? '');
      handlerRef.current.setAttribute('data-start-table-width', table.style.width ?? '');

      const parseNum = (val?: string | null) => {
        if (val == null) {
          return val;
        }
        return window.parseFloat(val);
      };

      let distWidth;

      const handleMove = (event: MouseEvent) => {
        if (handlerRef.current == null || table == null || colgroupItem == null) return;

        const initX = parseNum(handlerRef.current?.getAttribute('data-start-x'));
        const initWidth = parseNum(handlerRef.current?.getAttribute('data-start-width'));
        const initTableWidth = parseNum(handlerRef.current?.getAttribute('data-start-table-width'));

        if (initX == null || initWidth == null || initTableWidth == null) return;
        const nextWidth = event.pageX - initX + initWidth;
        distWidth = nextWidth < minColumnWidth ? minColumnWidth : nextWidth;
        const diffWidth = distWidth - initWidth;

        table.style.width = `${initTableWidth + diffWidth}px`;
        colgroupItem.style.width = `${distWidth}px`;
        colgroupItem.style.minWidth = `${distWidth}px`;

        /** 保存本地 column 宽度 */
        tableCoreActionsRef.current.saveLocalColumnWidth(props.columnKey, distWidth);

        /** 派发内部 resizeing 事件 */
        tableCoreActionsRef.current.emit(eventNames.columnsWidthResizing);

        debounceDispatchResizeEvent();
      };

      const handleUp = () => {
        setActive(false);

        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      setActive(true);

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [
      debounceDispatchResizeEvent,
      tableCoreActionsRef,
      tableWrapRef,
      minColumnWidth,
      props.columnKey,
    ],
  );

  const resizebarDom = useMemo(() => {
    if (!resizeable) return null;

    return (
      <span
        ref={handlerRef}
        className={cls(`${clsPrefix}-handler`, {
          active,
          last,
        })}
        onClick={(e) => {
          /** 禁用框选文字 */
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={handleMouseMove}
      ></span>
    );
  }, [active, clsPrefix, handleMouseMove, last, resizeable]);

  if (rest.className?.match('ty-ant-table-selection-column')) {
    return <th {...rest}>{children} </th>;
  }

  return (
    <th {...rest} ref={thRef} className={cls(rest.className, clsPrefix)}>
      {props.children}
      {resizebarDom}
    </th>
  );
};
