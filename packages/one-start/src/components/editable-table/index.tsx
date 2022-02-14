import { PlusOutlined } from '@ant-design/icons';
import { Row } from '@ty/antd';
import utl from 'lodash';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import OSDialog from '../dialog';
import OSTable from '../table';
import OSTrigger from '../trigger';
import type {
  OSEditableTableAddable,
  OSEditableTableAPI,
  OSEditableTableSelfType,
  OSEditableTableType,
  OSTableAPI,
  OSTableFormFieldItemWithStaticPureConfigs,
  OSTableValueType,
  OSTriggerButtonType,
  OSTriggerDropdownType,
  OSTriggerType,
  RecordType,
} from '../../typings';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { parseTableValue } from '../utils/parse-table-value';

const OSEditableTable: React.ForwardRefRenderFunction<OSEditableTableAPI, OSEditableTableType> = (
  props,
  ref,
) => {
  const {
    settings,
    value,
    onChange,
    requests,
    extraAddable: defaultAddable,
    extraRowActions,
  } = props;
  const { addable, rowKey = 'id', removeable, requestParams } = settings ?? {};

  const [dataSource, setDataSource] = useMergedState(value, {
    value,
    onChange,
  });

  const tableRef = useRef<OSTableAPI>(null);

  useImperativeHandle(ref, () => tableRef.current!);

  const addableData = useMemo(() => {
    const common = {
      direction: 'bottom',
      addButtonText: '添加一行数据',
      ...defaultAddable,
    };

    if (addable === false || addable == null) {
      return null;
    }

    if (typeof addable === 'function') {
      return {
        ...common,
        ...addable({
          dataSource: parseTableValue(dataSource),
          actions: tableRef.current!,
        }),
      };
    }

    return {
      ...common,
      ...addable,
    };
  }, [addable, dataSource, defaultAddable]);

  const requestNewRecordDataJson = useMemo(() => {
    try {
      return JSON.stringify(requestParams?.requestNewRecordData ?? null);
    } catch {
      return 'null';
    }
  }, [requestParams?.requestNewRecordData]);

  const requestNewRecordData = useCallback(
    async (rowData: RecordType, menuItemKey?: string) => {
      if (!requests?.requestNewRecordData) return rowData;

      const { error, data } = await requests
        .requestNewRecordData({
          dataSource: parseTableValue(dataSource),
          rowData,
          menuItemKey,
          params: JSON.parse(requestNewRecordDataJson),
        })
        .then(normalizeRequestOutputs);

      if (error) return null;

      return data;
    },
    [dataSource, requestNewRecordDataJson, requests],
  );

  const recordCreateBtnDom = useMemo(() => {
    if (addableData == null) {
      return null;
    }

    const generateNewRowDataList = async (list: RecordType[], key?: string) => {
      return await Promise.all(
        list.map(async (item: RecordType) => {
          const rowId = uuid();
          const _rowData = {
            [rowKey]: rowId,
            ...utl.mapValues(
              tableRef.current?.getColumnsStaticPureConfigsIdMaps(),
              (configs: OSTableFormFieldItemWithStaticPureConfigs) => {
                return configs.settings?.initialValue;
              },
            ),
            ...item,
          };

          if (requests?.requestNewRecordData) {
            return await requestNewRecordData(_rowData, key);
          }

          return _rowData;
        }),
      ).then((data) => {
        return data.filter((item): item is RecordType => !!item);
      });
    };

    const addNewRowData = async (rowDataList: RecordType[]) => {
      if (rowDataList.length === 0) return;

      if (settings?.changedValueHasMeta) {
        if (addableData.direction === 'top') {
          setDataSource({
            target: [...rowDataList, ...(parseTableValue(dataSource) ?? [])],
            origin: parseTableValue(dataSource),
            changedMeta: {
              type: 'insert',
              data: rowDataList.map((rowData, index) => {
                return {
                  rowData,
                  rowId: rowData.id,
                  rowIndex: index,
                };
              }),
            },
          });
          return;
        }
        const len = parseTableValue(dataSource)?.length;
        setDataSource({
          target: [...(parseTableValue(dataSource) ?? []), ...rowDataList],
          origin: parseTableValue(dataSource),
          changedMeta: {
            type: 'insert',
            data: rowDataList.map((rowData, index) => {
              return {
                rowData,
                rowId: rowData.id,
                rowIndex: len != null ? len - 1 + index : 0,
              };
            }),
          },
        });
        return;
      }

      if (addableData.direction === 'top') {
        setDataSource([...rowDataList, ...(parseTableValue(dataSource) ?? [])]);
        return;
      }
      setDataSource((parseTableValue(dataSource) ?? []).concat(rowDataList));
    };

    const renderAddWrapper = (dom: React.ReactElement) => {
      return (
        <Row
          style={{
            width: '100%',
          }}
          justify="center"
        >
          {dom}
        </Row>
      );
    };

    if (addableData.menu) {
      return renderAddWrapper(
        <OSTrigger
          type="dropdown"
          settings={{
            type: 'link',
            icon: <PlusOutlined />,
            ...(addableData.addTriggerSettings as OSTriggerDropdownType['settings']),
            split: false,
            disabled: addableData?.addButtonDisabled,
            text: addableData.addButtonText,
            menu: addableData.menu,
            tooltip: addableData.tooltip,
          }}
          requests={{
            requestBeforeUpload: async ({ files, key }) => {
              const rowDataList = await generateNewRowDataList(
                files.map((file) => ({ file })),
                key,
              );
              return addNewRowData(rowDataList);
            },
            requestAfterMenuClick: async ({ key }) => {
              const rowDataList = await generateNewRowDataList([{}], key);
              return addNewRowData(rowDataList);
            },
          }}
        ></OSTrigger>,
      );
    }

    return renderAddWrapper(
      <OSTrigger
        type="button"
        settings={{
          type: 'link',
          icon: <PlusOutlined />,
          ...(addableData.addTriggerSettings as OSTriggerButtonType['settings']),
          disabled: addableData?.addButtonDisabled,
          text: addableData.addButtonText,
          upload: addableData.upload,
          tooltip: addableData.tooltip,
        }}
        requests={{
          requestAfterClick: async () => {
            const [rowData] = await generateNewRowDataList([{}]);
            return addNewRowData([rowData]);
          },
          requestBeforeUpload: async ({ files }) => {
            const rowDataList = await generateNewRowDataList(files.map((file) => ({ file })));
            return addNewRowData(rowDataList);
          },
        }}
      ></OSTrigger>,
    );
  }, [
    addableData,
    dataSource,
    requestNewRecordData,
    requests?.requestNewRecordData,
    rowKey,
    setDataSource,
    settings?.changedValueHasMeta,
  ]);

  const headerWrapper = useMemo(() => {
    if (addableData == null) {
      return undefined;
    }
    if (addableData.direction === 'top') {
      return (props_: { className: string; children: React.ReactNode }) => {
        const { className, children } = props_;
        return (
          <thead className={className}>
            {children}
            <tr>
              <td
                style={{
                  borderRight: '2px solid #f0f0f0',
                }}
                colSpan={props.settings?.fieldItems?.length}
              >
                {recordCreateBtnDom}
              </td>
            </tr>
          </thead>
        );
      };
    }
    return undefined;
  }, [addableData, props.settings?.fieldItems?.length, recordCreateBtnDom]);

  const bottomCreator = useMemo(() => {
    if (addableData == null) {
      return undefined;
    }
    if (addableData.direction === 'bottom') {
      return recordCreateBtnDom;
    }
    return undefined;
  }, [addableData, recordCreateBtnDom]);

  return (
    <div>
      <OSTable
        {...props}
        ref={tableRef}
        value={parseTableValue(dataSource)}
        settings={{
          highlightVerticalRow: true,
          ...settings,
          pagination: {
            defaultPageSize: 10,
            showSizeChanger: false,
            hideOnSinglePage: true,
            ...settings?.pagination,
          },
          fieldItemSettings: {
            editable: true,
            configable: false,
            align: 'left',
            ...settings?.fieldItemSettings,
          },
          rowKey,
        }}
        requests={{
          ...requests,
          /** requestDataSource 传了会触发自动请求 */
          requestDataSource: requests?.requestDataSource
            ? async (options) => {
                if (!requests?.requestDataSource) return;

                const { error, data } = await requests
                  .requestDataSource(options)
                  .then(normalizeRequestOutputs);

                /**
                 * 1. 用户事件才触发 onChange
                 * 2. 设置 dataSource，用来正确同步状态，比如动态设置新增按钮属性
                 */
                if (data?.page) {
                  setDataSource(data?.page);
                }

                // eslint-disable-next-line consistent-return
                return { error, data };
              }
            : undefined,
        }}
        className={'editable'}
        headerWrapper={headerWrapper}
        extraRowActions={
          removeable
            ? (options) => {
                const { actions, rowId, rowData, rowIndex } = options;
                const renderTrigger = (settingsWithTrigger?: OSTriggerType['settings']) => {
                  return (
                    <OSDialog
                      type="popconfirm"
                      settings={{
                        title: '确认删除此行数据吗？',
                      }}
                      requests={{
                        requestAfterConfirm: async () => {
                          const normalizedDataSource = parseTableValue(dataSource);

                          const remove = () => {
                            const removeItem = (dataSource_: OSTableValueType) => {
                              if (!dataSource_) return dataSource_;
                              const next = [...dataSource_];
                              next.splice(rowIndex, 1);
                              tableRef.current?.removeSelection(rowId);
                              return next;
                            };

                            if (settings?.changedValueHasMeta) {
                              setDataSource({
                                target: removeItem(normalizedDataSource),
                                origin: normalizedDataSource,
                                changedMeta: {
                                  type: 'remove',
                                  data: [
                                    {
                                      rowData: rowData!,
                                      rowId: rowId!,
                                      rowIndex: rowIndex!,
                                    },
                                  ],
                                },
                              });
                            } else {
                              setDataSource(removeItem(normalizedDataSource));
                            }
                          };

                          if (!requests?.requestRemoveRecord) {
                            remove();
                            return false;
                          }

                          const { error } = await requests
                            .requestRemoveRecord({
                              rowData,
                              rowId,
                              rowIndex,
                              actions,
                              dataSource: normalizedDataSource,
                            })
                            .then(normalizeRequestOutputs)
                            .then(logRequestMessage());

                          if (!error) {
                            remove();
                          }

                          return error;
                        },
                      }}
                    >
                      <OSTrigger
                        type="button"
                        settings={{
                          text: '删除',
                          danger: true,
                          type: 'link',
                          ...settingsWithTrigger,
                        }}
                      ></OSTrigger>
                    </OSDialog>
                  );
                };
                const removeActions = () => {
                  if (!removeable) {
                    return null;
                  }
                  if (typeof removeable === 'function') {
                    const { triggerSettings } = removeable({
                      rowData,
                      rowId,
                      rowIndex,
                      actions,
                    });
                    return renderTrigger(triggerSettings);
                  }

                  return renderTrigger();
                };
                return [...(extraRowActions?.(options) ?? []), removeActions()];
              }
            : extraRowActions
        }
      ></OSTable>
      {bottomCreator}
    </div>
  );
};

export default React.forwardRef(OSEditableTable);
export const Settings: React.FC<OSEditableTableSelfType['settings']> = () => <></>;
export const EditableTableAddable: React.FC<OSEditableTableAddable> = () => <></>;
