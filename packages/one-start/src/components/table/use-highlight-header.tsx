import { useEffect, useRef } from 'react';
import {
  headerCellWithKeyClsPrefix,
  tdSelfClassTag,
  verticalRowCellWithKeyClsPrefix,
} from './constants';

const findCell = (
  item: HTMLElement,
  className: string,
  stoped: HTMLElement | null,
): HTMLElement | null => {
  if (item === stoped) {
    return null;
  }
  if (item.classList.contains(className)) {
    return item;
  }
  if (item.parentElement) {
    return findCell(item.parentElement, className, stoped);
  }
  return null;
};

const findCellIndex = (cell: HTMLElement) => {
  return Array.from(cell.parentElement?.childNodes ?? []).findIndex((item) => item === cell);
};

export const useHighLightHeader = ({
  highlightVerticalRow,
}: {
  highlightVerticalRow?: boolean;
}) => {
  const prevHighlightHeaderCellRef = useRef<Element | null | undefined>(null);
  const prevHighlightTargetCellRef = useRef<Element | null | undefined>(null);
  const prevHighlightTargetPrevCellRef = useRef<Element | null | undefined>(null);
  const prevHighlightTargetTopCellRef = useRef<Element | null | undefined>(null);
  const prevHighlightVerticalRowCellsRef = useRef<(Element | null | undefined)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlight = (event: MouseEvent) => {
      const targetCell = findCell(event.target as HTMLElement, tdSelfClassTag, wrapRef.current);

      const highlightHeader = () => {
        /** 高亮表头 */
        if (targetCell) {
          const { dataIndex } = targetCell.dataset;
          const headerCell = wrapRef.current?.querySelector(
            `.${headerCellWithKeyClsPrefix}-${dataIndex}`,
          );

          if (prevHighlightHeaderCellRef.current !== headerCell) {
            prevHighlightHeaderCellRef.current?.classList.remove('hight-header-cell');
          }
          prevHighlightHeaderCellRef.current = headerCell;

          if (headerCell?.classList.contains('hight-header-cell')) {
            return;
          }

          headerCell?.classList.add('hight-header-cell');
        } else {
          prevHighlightHeaderCellRef.current?.classList.remove('hight-header-cell');
        }
      };

      const highlightVerticalCells = () => {
        /** 高亮竖向行单元格 */
        if (targetCell) {
          const { dataIndex } = targetCell.dataset;
          const verticalCells = Array.from(
            wrapRef.current?.querySelectorAll(`.${verticalRowCellWithKeyClsPrefix}-${dataIndex}`) ??
              [],
          );

          verticalCells.forEach((itemCell, index) => {
            if (prevHighlightVerticalRowCellsRef.current[index] !== itemCell) {
              prevHighlightVerticalRowCellsRef.current[index]?.classList.remove(
                'hight-vertical-cell',
              );
            }
            prevHighlightVerticalRowCellsRef.current[index] = itemCell;

            if (itemCell?.classList.contains('hight-vertical-cell')) {
              return;
            }

            itemCell?.classList.add('hight-vertical-cell');
          });
        } else {
          prevHighlightVerticalRowCellsRef.current.forEach((itemCell) => {
            itemCell?.classList.remove('hight-vertical-cell');
          });
        }
      };

      const highlightTargetCell = () => {
        const highlightCell = (
          cell: Element | null | undefined,
          clss: string,
          cellRef: React.MutableRefObject<Element | null | undefined>,
        ) => {
          /** 高亮竖向行单元格 */
          if (cell) {
            if (cellRef.current !== cell) {
              cellRef.current?.classList.remove(clss);
            }
            // eslint-disable-next-line no-param-reassign
            cellRef.current = cell;

            if (cell?.classList.contains(clss)) {
              return;
            }

            cell?.classList.add(clss);
          } else {
            cellRef.current?.classList.remove(clss);
          }
        };

        highlightCell(targetCell, 'hight-target-cell', prevHighlightTargetCellRef);
        highlightCell(
          targetCell?.previousElementSibling,
          'hight-target-previous-cell',
          prevHighlightTargetPrevCellRef,
        );
        highlightCell(
          targetCell?.parentElement?.previousElementSibling?.childNodes?.[
            findCellIndex(targetCell)
          ] as Element | null | undefined,
          'hight-target-top-cell',
          prevHighlightTargetTopCellRef,
        );
      };

      highlightHeader();
      if (highlightVerticalRow) {
        highlightVerticalCells();
      }
      highlightTargetCell();
    };

    const hidelight = () => {
      prevHighlightHeaderCellRef.current?.classList.remove('hight-header-cell');
      prevHighlightTargetCellRef.current?.classList.remove('hight-target-cell');
      prevHighlightTargetPrevCellRef.current?.classList.remove('hight-target-previous-cell');
      prevHighlightTargetTopCellRef.current?.classList.remove('hight-target-top-cell');
      prevHighlightVerticalRowCellsRef.current.forEach((cell) =>
        cell?.classList.remove('hight-vertical-cell'),
      );
    };

    wrapRef.current?.addEventListener('mouseover', highlight);
    wrapRef.current?.addEventListener('mouseleave', hidelight);
    const cur = wrapRef.current;
    return () => {
      cur?.removeEventListener('mouseover', highlight);
      cur?.removeEventListener('mouseleave', hidelight);
    };
  }, []);

  return {
    wrapRef,
  };
};
