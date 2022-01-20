import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Col, Popover, Row, Select, Typography } from '@ty/antd';
import type { SelectProps } from '@ty/antd/lib/select';
import cls from 'classnames';
import utl from 'lodash';
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Highlighter from 'react-highlight-words';
import { useActionsRef } from '../hooks/use-actions-ref';
import { ExtraValueTypesContext } from '../providers/extra-value-types';
import type {
  OSFormType,
  OSSelectBaseAPI,
  OSSelectFieldAPI,
  OSSelectFieldType,
  OSSelectFieldValueArrayType,
  OSSelectFieldValueItemType,
  OSSelectFieldValueType,
  OSSelectOptionItem,
  RecordType,
} from '../../typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { convertEnumsToOptions } from './utils/convert-enum-to-options';

const OSSelectField: React.ForwardRefRenderFunction<OSSelectFieldAPI, OSSelectFieldType> = (
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
    tagRender,
    renderOnRead,
    autoFetchSelectOptions = true,
  } = props;

  const clsPrefix = useClsPrefix('field-select');

  const {
    disabled,
    bordered,
    autoFocus,
    valueEnums,
    params,
    mode: selectMode,
    showSearch,
    allowClear = true,
    dropdownMatchSelectWidth,
    labelInValue,
    showInfo,
    maxWidth,
  } = settings ?? {};

  const [loading, setLoading] = useState(false);

  const [asyncOptions, setAsyncOptions] = useState<OSSelectOptionItem[]>();

  const [searchValue, setSearchValue] = useState<string>();
  const dropWrapRef = useRef<HTMLDivElement>(null);

  const extraValueTypes = useContext(ExtraValueTypesContext);

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

  const options = useMemo(() => {
    return valueEnums ? convertEnumsToOptions(valueEnums) : undefined;
  }, [valueEnums]);

  const OSSelectRef = useRef<OSSelectFieldAPI>(null);

  const [open, setOpen] = useState<boolean>();

  const normalizedShowInfo = useMemo(() => {
    if (Array.isArray(showInfo)) {
      return {
        fieldItems: showInfo,
      };
    }
    return showInfo;
  }, [showInfo]);

  useImperativeHandle(ref, () => {
    return {
      ...OSSelectRef.current!,
      open: () => {
        setOpen(true);
      },
    };
  });

  if (mode === 'read') {
    const maps =
      valueEnums ?? utl.fromPairs(utl.map(asyncOptions, (item) => [item.value, item.label]));

    const getContent = () => {
      const text = _text ?? _value;

      if (renderOnRead) {
        return renderOnRead(text, maps);
      }
      if (Array.isArray(text)) {
        if (text.length === 0) {
          return null;
        }
        return text
          .map((item: OSSelectFieldValueItemType) => {
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
      <Select<OSSelectFieldValueType>
        labelInValue={labelInValue}
        ref={OSSelectRef}
        value={_value}
        className={cls(clsPrefix, {
          noborder: bordered === false,
        })}
        onChange={(value: OSSelectFieldValueType) => {
          /** 清空 searchValue，否则选择的项会高亮 */
          setSearchValue(undefined);

          const mergedDataInValue = (val: OSSelectFieldValueType) => {
            if (val == null || utl.isEmpty(valueToOptionMaps)) {
              return val;
            }
            if (labelInValue) {
              if (Array.isArray(val)) {
                return val.map((item: OSSelectFieldValueItemType) => {
                  if (typeof item === 'object') {
                    return {
                      ...item,
                      data: valueToOptionMaps[item.key ?? item.value].data,
                      label: valueToOptionMaps[item.key ?? item.value].label,
                    };
                  }
                  return item;
                }) as OSSelectFieldValueArrayType;
              }
              if (typeof val === 'object') {
                return {
                  ...val,
                  data: valueToOptionMaps[val.key ?? val.value].data,
                  label: valueToOptionMaps[val.key ?? val.value].label,
                };
              }
            }
            return val;
          };

          onChangeHook?.(mergedDataInValue(value));
          return _onChange?.(
            allowClear && Array.isArray(value) && value.length === 0
              ? undefined
              : mergedDataInValue(value),
          );
        }}
        mode={selectMode}
        onSearch={(() => {
          if (showSearch === 'local') {
            return ((value) => setSearchValue(value)) as SelectProps<RecordType>['onSearch'];
          }
          return showSearch
            ? (((value) => {
                requestOptions(value, params);
              }) as SelectProps<RecordType>['onSearch'])
            : undefined;
        })()}
        /**
         * 后端实现模糊搜索，应该返回所有 options
         * 前端实现，需要进行 label 设置
         */
        filterOption={(inputValue, option) => {
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
        tagRender={tagRender}
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
          maxWidth,
        }}
        placeholder="请选择选项"
        optionLabelProp="label"
        dropdownRender={(menuDom) => {
          return (
            <div ref={dropWrapRef} style={{ overflow: 'visible' }}>
              {menuDom}
            </div>
          );
        }}
        /** 损失虚拟滚动，配合后端显示更多内容 */
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        /** 显示 tooltip 内容 */
        dropdownStyle={
          normalizedShowInfo
            ? {
                overflow: 'visible',
              }
            : undefined
        }
      >
        {(options || asyncOptions)?.map((item: OSSelectOptionItem) => {
          const highlightDom = (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={searchValue == null ? [] : [searchValue]}
              autoEscape
              textToHighlight={item.label?.toString() ?? ''}
            />
          );
          return (
            <Select.Option key={item.key ?? item.value} value={item.value} label={highlightDom}>
              {normalizedShowInfo
                ? (() => {
                    return (
                      <Row gutter={5} justify="space-between" align="middle">
                        <Col>{highlightDom}</Col>
                        <Col>
                          <Popover
                            destroyTooltipOnHide
                            overlayStyle={{
                              minWidth: normalizedShowInfo.popoverWidth ?? 200,
                            }}
                            placement="right"
                            content={extraValueTypes.form({
                              mode: 'read',
                              type: 'form',
                              text: item.data,
                              fieldSettings: {
                                labelCol: { span: 12 },
                                wrapperCol: { span: 12 },
                                fieldItems: normalizedShowInfo.fieldItems?.map((it) => ({
                                  type: it.valueType,
                                  settings: {
                                    dataIndex: it.dataIndex,
                                    title: it.title,
                                  },
                                })),
                              } as OSFormType['settings'],
                            })}
                            getPopupContainer={() => dropWrapRef.current ?? document.body}
                          >
                            <InfoCircleOutlined
                              style={{
                                color: 'rgba(0, 0, 0, 0.45)',
                              }}
                            />
                          </Popover>
                        </Col>
                      </Row>
                    );
                  })()
                : highlightDom}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
  return null;
};

export default React.forwardRef(OSSelectField);

export const Settings: React.FC<OSSelectFieldType['settings']> = () => <></>;
export const Requests: React.FC<OSSelectFieldType['requests']> = () => <></>;
export const SelectBaseAPI: React.FC<OSSelectBaseAPI> = () => <></>;
