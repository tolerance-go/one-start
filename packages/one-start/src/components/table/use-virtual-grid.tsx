/* eslint-disable no-param-reassign */
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button } from '@ty/antd';
import type { ColumnsType } from '@ty/antd/es/table';
import type { ColumnGroupType, ColumnType } from '@ty/antd/lib/table';
import produce from 'immer';
import utl from 'lodash';
import type { CustomizeScrollBody } from 'rc-table/lib/interface';
import type { MutableRefObject } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import type { OSFormFieldItemWithStaticPureConfigs, RecordType } from '../typings';
import { renderField } from '../utils/render-field';
import {
  DEFAULT_ROW_HEIGHT,
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_WIDTH,
  eventNames,
  headerCellWithKeyClsPrefix,
} from './constants';
import type { TableCoreActions } from '../typings';
import { getDataIndexId } from './utils';

export type TreeRecordType = {
  children?: TreeRecordType[];
  [key: string]: any;
};

export const useVirtualGrid = ({
  columns,
  tableHeight,
  dataSource,
  tableWidth,
  enable,
  tableWrapRef,
  columnsSettingsIdMaps,
  rowKey,
  getRowClassName,
  tableCoreActionsRef,
}: {
  rowKey: string;
  columns?: ColumnsType<RecordType>;
  dataSource?: TreeRecordType[];
  tableHeight?: number;
  tableWidth?: number;
  enable?: boolean;
  tableWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  columnsSettingsIdMaps: Record<string, OSFormFieldItemWithStaticPureConfigs>;
  getRowClassName: (
    row: {
      [key: string]: any;
      level?: number | undefined;
    },
    index?: number | undefined,
    options?: {
      suffix?: string;
    },
  ) => string | undefined;
  tableCoreActionsRef: React.MutableRefObject<TableCoreActions>;
}) => {
  const gridRef = useRef<Grid>(null);

  const speadColumns = useMemo<ColumnType<RecordType>[]>(() => {
    const mapDp = (
      cols?: ColumnsType<RecordType>,
    ): (ColumnType<RecordType> | ColumnType<RecordType>[])[] => {
      return (
        cols?.map((col) => {
          const colGroup = col as ColumnGroupType<RecordType>;
          if (colGroup.children) {
            // 类似不匹配
            return mapDp(colGroup.children) as ColumnType<RecordType>[];
          }

          return col as ColumnType<RecordType>;
        }) ?? []
      );
    };

    return utl.flattenDeep(mapDp(columns));
  }, [columns]);

  const [connectObject] = useState<{
    scrollLeft: number;
  }>(() => {
    const obj: { scrollLeft: number } = { scrollLeft: 0 };
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });

  const currentScrollTopRef = useRef<number>();

  const resetVirtualGridColumn = () => {
    gridRef.current?.resetAfterColumnIndex(0, true);
  };

  const [spreads, setSpreads] = useState<Record<string, boolean>>({});

  const allParents = useRef<string[]>([]);

  const rawData = useMemo(() => {
    const mapDp = (data?: TreeRecordType[], level = 0): TreeRecordType[] => {
      return (
        data?.map((item) => {
          if (item.children) {
            const children = mapDp(item.children, level + 1);

            allParents.current.push(item[rowKey]);

            if (spreads[item[rowKey]] === false) {
              return { ...item, level, children };
            }

            return [{ ...item, level, children }, ...children];
          }
          return { ...item, level };
        }) ?? []
      );
    };

    if (!enable) return [];

    return utl.flattenDeep(mapDp(dataSource));
  }, [enable, dataSource, spreads, rowKey]);

  const renderVirtualGrid: CustomizeScrollBody<RecordType> = (
    _,
    { scrollbarSize, ref, onScroll },
  ) => {
    if (ref) {
      (
        ref as MutableRefObject<{
          scrollLeft: number;
        }>
      ).current = connectObject;
    }

    const parseNum = (val?: string | null) => {
      if (val == null) {
        return val;
      }
      return window.parseFloat(val);
    };

    const totalHeight = rawData.length * DEFAULT_ROW_HEIGHT;
    const viewHeight = tableHeight ?? DEFAULT_TABLE_HEIGHT;
    const viewWidth = tableWidth ?? 0;

    return (
      <Grid
        ref={gridRef}
        columnCount={speadColumns.length}
        columnWidth={(index) => {
          const thDom = tableWrapRef.current?.querySelector(
            `.${headerCellWithKeyClsPrefix}-${getDataIndexId(speadColumns[index].dataIndex, '-')}`,
          ) as HTMLElement | null;
          if (!thDom) return DEFAULT_WIDTH;

          const width = parseNum(window.getComputedStyle(thDom).width) ?? DEFAULT_WIDTH;
          const dist =
            totalHeight > viewHeight && index === speadColumns.length - 1
              ? width - scrollbarSize - 1
              : width;

          return dist;
        }}
        height={viewHeight}
        rowCount={rawData.length}
        rowHeight={() => {
          return DEFAULT_ROW_HEIGHT;
        }}
        width={viewWidth}
        onScroll={({ scrollLeft, scrollTop }) => {
          currentScrollTopRef.current = scrollTop;
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          const rowData = rawData[rowIndex];
          const { level, children, [rowKey]: rowId } = rowData;
          const { dataIndex, align } = speadColumns[columnIndex];
          const {
            settings,
            type: valueType,
            requests,
          } = columnsSettingsIdMaps[getDataIndexId(dataIndex)];
          return (
            <div
              style={{
                ...style,
                paddingLeft: columnIndex === 0 ? level * 20 : undefined,
                textAlign: align,
              }}
              className={getRowClassName(rowData, rowIndex, {
                suffix: 'td',
              })}
            >
              {columnIndex === 0 && children ? (
                <span
                  onClick={() => {
                    setSpreads(
                      produce((draft) => {
                        if (draft[rowId] == null) {
                          draft[rowId] = false;
                        } else {
                          draft[rowId] = !draft[rowId];
                        }
                      }),
                    );
                  }}
                  style={{
                    cursor: 'pointer',
                    paddingRight: 10,
                  }}
                >
                  {(() => {
                    if (spreads[rowId] == null) {
                      return <MinusSquareOutlined />;
                    }
                    return spreads[rowId] ? <MinusSquareOutlined /> : <PlusSquareOutlined />;
                  })()}
                </span>
              ) : null}
              {renderField('read', valueType, settings, requests, {
                text: dataIndex ? utl.get(rowData, dataIndex) : undefined,
              })}
            </div>
          );
        }}
      </Grid>
    );
  };

  const [isSpreadAll, setIsSpreadAll] = useState(true);

  const spreadBtnDom = (
    <Button
      size="small"
      type="text"
      onClick={() => {
        setIsSpreadAll((prev) => !prev);
      }}
      icon={isSpreadAll ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
    >
      {isSpreadAll ? '收起全部' : '展开全部'}
    </Button>
  );

  useLayoutEffect(() => {
    if (isSpreadAll) {
      setSpreads(allParents.current.reduce((obj, next) => ({ ...obj, [next]: true }), {}));
    } else {
      setSpreads(allParents.current.reduce((obj, next) => ({ ...obj, [next]: false }), {}));
    }
  }, [isSpreadAll]);

  useEffect(() => resetVirtualGridColumn, [tableWidth, speadColumns]);

  useEffect(() => {
    const handler = () => {
      resetVirtualGridColumn();
    };
    tableCoreActionsRef.current.on(eventNames.columnsWidthResizing, handler);
    const cur = tableCoreActionsRef.current;
    return () => {
      cur.off(eventNames.columnsWidthResizing, handler);
    };
  });

  // useEffect(() => {
  //   gridRef.current?.scrollTo({
  //     scrollTop: currentScrollTopRef.current,
  //   });
  // }, [isSpread]);

  return {
    renderVirtualGrid: enable ? renderVirtualGrid : undefined,
    tableHeight: enable ? tableHeight : undefined,
    spreadBtnDom: enable ? spreadBtnDom : undefined,
  };
};
