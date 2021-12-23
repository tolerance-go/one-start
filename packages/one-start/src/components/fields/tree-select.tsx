import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row, TreeSelect, TreeSelectProps, Typography } from '@ty/antd';
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
  OSTreeSelectOptionItem,
  RecordType,
} from '../typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { mapTreeNode } from '../utils/tree-utils';
import { useClsPrefix } from '../utils/use-cls-prefix';

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
  } = settings ?? {};

  const [loading, setLoading] = useState(false);

  const [asyncOptions, setAsyncOptions] = useState<OSTreeSelectOptionItem[]>();

  const [searchValue, setSearchValue] = useState<string>();
  // const dropWrapRef = useRef<HTMLDivElement>(null);

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

  /** 映射字符串的 label */
  const valueToOptionMaps = useMemo(() => {
    return utl.fromPairs(asyncOptions?.map((item) => [item.key ?? item.value, item]));
  }, [asyncOptions]);

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

  if (mode === 'read') {
    const maps = utl.fromPairs(
      utl.map(
        utl.flattenDeep(
          mapTreeNode(treeOptions ?? asyncOptions ?? [], (item, parent) => {
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
          .map((item) => {
            return maps[item] ?? item;
          })
          .join(', ');
      }

      return maps[text ?? ''] ?? text;
    };

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
        ref={OSSelectRef}
        treeCheckable
        maxTagCount={5}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        multiple={multiple}
        value={_value}
        className={cls(clsPrefix, {
          noborder: bordered === false,
        })}
        treeDefaultExpandAll
        onChange={(value: OSTreeSelectFieldValueType) => {
          /** 清空 searchValue，否则选择的项会高亮 */
          setSearchValue(undefined);

          const parseValue = (val: OSTreeSelectFieldValueType) => {
            if (val == null || utl.isEmpty(valueToOptionMaps)) {
              return val;
            }
            return val;
          };

          const mergedValue = parseValue(value);
          onChangeHook?.(mergedValue);
          return _onChange?.(
            allowClear && Array.isArray(value) && value.length === 0 ? undefined : mergedValue,
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
        open={open}
        onDropdownVisibleChange={setOpen}
        notFoundContent={renderNotFoundContent()}
        allowClear={allowClear}
        showSearch={showSearch == null ? undefined : !!showSearch}
        optionFilterProp={'label'}
        {...{
          bordered,
          disabled,
          autoFocus,
          loading,
        }}
        style={{
          width: '100%',
          minWidth: 120,
        }}
        placeholder="请选择选项"
        dropdownClassName={`${clsPrefix}-dropdown`}
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
