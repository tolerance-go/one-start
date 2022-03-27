import { LoadingOutlined } from '@ant-design/icons';
import type { TreeSelectProps } from '@ty/antd';
import { Col, Row, TreeSelect, Typography, Tree } from '@ty/antd';
import cls from 'classnames';
import utl from 'lodash';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  OSSelectBaseAPI,
  OSTreeSelectFieldAPI,
  OSTreeSelectFieldType,
  OSTreeSelectFieldValueType,
  OSTreeSelectFieldValueArrayType,
  OSTreeSelectOptionItem,
  RecordType,
  RawValue,
  OSSelectFieldLabelValueType,
} from '../../typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { mapTreeNode } from '../utils/tree-utils';
import { useClsPrefix } from '../utils/use-cls-prefix';
import type { DataNode } from '@ty/antd/lib/tree';
import { useUpdateEffect } from 'ahooks';

const OSSelectField: React.ForwardRefRenderFunction<OSTreeSelectFieldAPI, OSTreeSelectFieldType> = (
  props,
  ref,
) => {
  const {
    text: _text,
    onChangeHook,
    settings,
    mode = 'read',
    value: _value,
    onChange: _onChange,
    requests,
    autoFetchSelectOptions = true,
  } = props;

  const clsPrefix = useClsPrefix('field-tree-select');

  const {
    disabled,
    bordered,
    autoFocus,
    treeOptions,
    params,
    showSearch,
    allowClear = true,
    multiple,
    readonlyWithTree,
    labelInValue,
    showCheckedStrategy,
  } = settings ?? {};

  const [loading, setLoading] = useState(false);

  const [asyncOptions, setAsyncOptions] = useState<OSTreeSelectOptionItem[]>();

  const [searchValue, setSearchValue] = useState<string>();
  // const dropWrapRef = useRef<HTMLDivElement>(null);

  const flatedOptions = useMemo(() => {
    return utl.flattenDeep(
      mapTreeNode(asyncOptions ?? treeOptions ?? [], (item) => {
        if (item.children) {
          return [item, ...item.children];
        }
        return item;
      }),
    );
  }, [asyncOptions, treeOptions]);

  const valueItems = useMemo(() => {
    return utl.fromPairs(flatedOptions?.map((item) => [item.key ?? item.value, item]));
  }, [flatedOptions]);

  const mergedDataInValue = (val: OSTreeSelectFieldValueType): OSTreeSelectFieldValueType => {
    if (val == null || utl.isEmpty(valueItems)) {
      return val;
    }
    if (labelInValue) {
      if (Array.isArray(val)) {
        return val.map(mergedDataInValue) as OSTreeSelectFieldValueArrayType;
      }
      if (typeof val === 'object') {
        return {
          ...val,
          data: valueItems[val.key ?? val.value].data,
          label: valueItems[val.key ?? val.value].label,
        };
      }
    }
    return val;
  };

  const requestOptions = utl.debounce(async (searchValue_?: string, params_?: RecordType) => {
    if (!requests?.requestOptions) return;

    setLoading(true);
    const { error, data } = await requests
      .requestOptions({
        searchValue: searchValue_,
        params: params_,
      })
      .then(normalizeRequestOutputs);
    setLoading(false);
    if (error) return;

    setAsyncOptions(data);
    setSearchValue(searchValue_);
  }, 400);

  const actionsRef = useActionsRef({
    requestOptions,
  });

  useEffect(() => {
    if (autoFetchSelectOptions) {
      actionsRef.current.requestOptions(undefined, params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsRef, JSON.stringify(params), mode]);

  const OSSelectRef = useRef<OSTreeSelectFieldAPI>(null);

  const [open, setOpen] = useState<boolean>();

  useImperativeHandle(ref, () => {
    return {
      ...OSSelectRef.current!,
      open: () => {
        setOpen(true);
      },
    };
  });

  useUpdateEffect(() => {
    if (open === false) {
      /** 清空 searchValue，否则选择的项会高亮 */
      setSearchValue(undefined);
    }
  }, [open]);

  if (mode === 'read') {
    const maps = utl.fromPairs(
      utl.map(
        utl.flattenDeep(
          mapTreeNode(asyncOptions ?? treeOptions ?? [], (item, parent) => {
            if (item.children) {
              return item.children;
            }
            return {
              ...item,
              value: item.value,
              label: `${parent?.label ? `${parent?.label}-` : ''}${item.label}`,
            };
          }),
        ),
        (item) => [item.value, item.label],
      ),
    );

    const getContent = () => {
      const text = _text ?? _value;

      if (Array.isArray(text)) {
        if (text.length === 0) {
          return null;
        }
        return text
          .map((item: RawValue | OSSelectFieldLabelValueType) => {
            if (typeof item === 'object') {
              return item.label;
            }
            return maps[item] ?? item;
          })
          .join(', ');
      }

      if (typeof text === 'object') {
        return text.label;
      }

      return maps[text ?? ''] ?? text;
    };

    if (readonlyWithTree) {
      const arrayValue = (
        Array.isArray(_value)
          ? _value
          : (() => {
              return _value == null ? [] : [_value];
            })()
      ).map((item) => (typeof item === 'object' ? item.value : item));
      return (
        <div
          style={{
            maxHeight: 500,
            overflowY: 'auto',
          }}
        >
          <Tree
            showLine={{
              showLeafIcon: false,
            }}
            checkable
            defaultExpandAll
            checkedKeys={arrayValue}
            treeData={mapTreeNode(
              (asyncOptions || treeOptions) ?? [],
              (item: OSTreeSelectOptionItem) => {
                if (item.children) {
                  return {
                    title: `${item.label}(${
                      utl.intersection(
                        item.children.map((it) => it.key),
                        arrayValue
                          .concat(
                            showCheckedStrategy === 'SHOW_CHILD'
                              ? (
                                  item.children as (DataNode & {
                                    customChecked?: boolean;
                                  })[]
                                )
                                  .filter((it) => it.customChecked)
                                  .map((it) => it.key)
                              : [],
                          )
                          .map(String),
                      ).length
                    }/${item.children.length})`,
                    key: item.value,
                    children: item.children,
                    customChecked: (() => {
                      if (showCheckedStrategy === 'SHOW_CHILD') {
                        /** 父组件选择与否，根据所有子项目判断，因为 SHOW_CHILD 模式下 value 中不存在父节点 */
                        const customChecked = (item.children as DataNode[] | undefined)?.every(
                          (child) => arrayValue.includes(child.key),
                        );
                        return customChecked;
                      }
                      return undefined;
                    })(),
                  } as DataNode;
                }
                return {
                  title: item.label,
                  key: item.value,
                } as DataNode;
              },
            )}
          ></Tree>
        </div>
      );
    }

    return (
      <span ref={OSSelectRef as React.RefObject<HTMLSpanElement>}>
        {getContent() ?? (loading ? <LoadingOutlined style={{ fontSize: 12 }} /> : '--')}
      </span>
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const renderNotFoundContent = () => {
      if (loading) {
        return (
          <Row justify="center">
            <Col>
              <Typography.Text type="secondary">数据请求中</Typography.Text>
            </Col>
          </Row>
        );
      }

      if (requests?.requestOptions) {
        return (
          <Row justify="center">
            <Col>
              <Typography.Text type="secondary">未查询到匹配项</Typography.Text>
            </Col>
          </Row>
        );
      }
      return null;
    };

    return (
      <TreeSelect<OSTreeSelectFieldValueType>
        labelInValue={labelInValue}
        treeDefaultExpandAll
        treeCheckable={multiple}
        ref={OSSelectRef}
        maxTagCount={5}
        showCheckedStrategy={showCheckedStrategy ?? TreeSelect.SHOW_PARENT}
        multiple={multiple}
        value={_value}
        open={open}
        placeholder="请选择选项"
        allowClear={allowClear}
        dropdownClassName={`${clsPrefix}-dropdown`}
        optionFilterProp={'label'}
        className={cls(clsPrefix, {
          noborder: bordered === false,
        })}
        bordered={bordered}
        disabled={disabled}
        autoFocus={autoFocus}
        loading={loading}
        style={{
          width: '100%',
          minWidth: 120,
        }}
        showSearch={showSearch == null ? undefined : !!showSearch}
        searchValue={searchValue}
        onChange={(value: OSTreeSelectFieldValueType) => {
          const parseValue = (val: OSTreeSelectFieldValueType) => {
            if (val == null || utl.isEmpty(valueItems)) {
              return val;
            }
            return val;
          };

          const mergedValue = parseValue(value);
          onChangeHook?.(mergedDataInValue(mergedValue));
          return _onChange?.(
            allowClear && Array.isArray(value) && value.length === 0
              ? undefined
              : mergedDataInValue(mergedValue),
          );
        }}
        onSearch={(() => {
          if (showSearch === 'local') {
            return ((value) => setSearchValue(value)) as TreeSelectProps<RecordType>['onSearch'];
          }
          return showSearch
            ? (((value) => {
                requestOptions(value, params);
              }) as TreeSelectProps<RecordType>['onSearch'])
            : undefined;
        })()}
        /**
         * 后端实现模糊搜索，应该返回所有 options
         * 前端实现，需要进行 label 设置
         */
        filterTreeNode={(inputValue, option) => {
          if (showSearch === 'local') {
            const text =
              // eslint-disable-next-line no-nested-ternary
              typeof option?.label === 'string'
                ? option.label
                : typeof option?.value === 'string' || typeof option?.value === 'number'
                ? String(option.value)
                : '';
            return text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
          }
          return true;
        }}
        onDropdownVisibleChange={setOpen}
        notFoundContent={renderNotFoundContent()}
        // dropdownRender={(menuDom) => {
        //   return (
        //     <div ref={dropWrapRef} style={{ overflow: 'visible' }}>
        //       {menuDom}
        //     </div>
        //   );
        // }}
      >
        {mapTreeNode((treeOptions || asyncOptions) ?? [], (item: OSTreeSelectOptionItem) => {
          const highlightDom = (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={searchValue == null ? [] : [searchValue]}
              autoEscape
              textToHighlight={item.label?.toString() ?? ''}
            />
          );
          if (item.children) {
            return (
              <TreeSelect.TreeNode
                key={item.key ?? item.value}
                value={item.value}
                title={highlightDom}
                label={item.label}
              >
                {item.children}
              </TreeSelect.TreeNode>
            );
          }
          return (
            <TreeSelect.TreeNode
              key={item.key ?? item.value}
              value={item.value}
              title={highlightDom}
              label={item.label}
            ></TreeSelect.TreeNode>
          );
        })}
      </TreeSelect>
    );
  }
  return null;
};

export default React.forwardRef(OSSelectField);

export const Settings: React.FC<OSTreeSelectFieldType['settings']> = () => <></>;
export const Requests: React.FC<OSTreeSelectFieldType['requests']> = () => <></>;
export const SelectBaseAPI: React.FC<OSSelectBaseAPI> = () => <></>;
