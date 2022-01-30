import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Col, Popover, Row, Select, Spin, Typography } from '@ty/antd';
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
import type {
  OSFormType,
  OSSelectBaseAPI,
  OSSelectFieldAPI,
  OSSelectFieldShowInfo,
  OSSelectFieldType,
  OSSelectFieldValueArrayType,
  OSSelectFieldValueItemType,
  OSSelectFieldValueType,
  OSSelectOptionItem,
  RecordType,
} from '../../../typings';
import { ExtraValueTypesContext } from '../../providers/extra-value-types';
import { normalizeRequestOutputs } from '../../utils/normalize-request-outputs';
import { useClsPrefix } from '../../utils/use-cls-prefix';
import { convertEnumsToOptions } from '../utils/convert-enum-to-options';
import { ShowInfoLabel } from './show-info-label';

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
    requestExtra,
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
  const OSSelectRef = useRef<OSSelectFieldAPI>(null);
  const [open, setOpen] = useState<boolean>();

  /** 映射字符串的 label */
  const asyncValueEnums = useMemo(() => {
    return utl.fromPairs(asyncOptions?.map((item) => [item.key ?? item.value, item]));
  }, [asyncOptions]);

  const options = useMemo(() => {
    return valueEnums ? convertEnumsToOptions(valueEnums) : undefined;
  }, [valueEnums]);

  const requestOptions = async (searchValue_?: string, params_?: RecordType) => {
    if (!requests?.requestOptions) return;

    setLoading(true);
    const { error, data } = await requests
      .requestOptions({
        ...requestExtra?.(),
        searchValue: searchValue_,
        params: params_,
      })
      .then(normalizeRequestOutputs);
    setLoading(false);
    if (error) return;

    setAsyncOptions(data);
    setSearchValue(searchValue_);
  };

  const requestOptionsWithDebounce = utl.debounce(requestOptions, 400);

  const normalizedShowInfo = useMemo(() => {
    if (Array.isArray(showInfo)) {
      return {
        fieldItems: showInfo,
      };
    }
    return showInfo;
  }, [showInfo]);

  const mergedDataInValue = (val: OSSelectFieldValueType): OSSelectFieldValueType => {
    if (val == null || utl.isEmpty(asyncValueEnums)) {
      return val;
    }
    if (labelInValue) {
      if (Array.isArray(val)) {
        return val.map(mergedDataInValue) as OSSelectFieldValueArrayType;
      }
      if (typeof val === 'object') {
        return {
          ...val,
          data: asyncValueEnums[val.key ?? val.value].data,
          label: asyncValueEnums[val.key ?? val.value].label,
        };
      }
    }
    return val;
  };

  useImperativeHandle(ref, () => {
    return {
      ...OSSelectRef.current!,
      open: () => {
        setOpen(true);
      },
    };
  });

  useEffect(() => {
    if (autoFetchSelectOptions) {
      requestOptions(undefined, params);
    }
  }, []);

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
    const handleDropdownVisibleChange: SelectProps<OSSelectFieldValueType>['onDropdownVisibleChange'] =
      (visible) => {
        if (visible) {
          requestOptions(undefined, params);
        }
        setOpen(visible);
      };

    const handleDropdownRender: SelectProps<OSSelectFieldValueType>['dropdownRender'] = (
      menuDom,
    ) => {
      return (
        <Spin size="small" indicator={<LoadingOutlined />} spinning={loading}>
          <div ref={dropWrapRef} style={{ overflow: 'visible' }}>
            {menuDom}
          </div>
        </Spin>
      );
    };
    const handleSelect = (() => {
      if (showSearch === 'local') {
        return ((value) =>
          setSearchValue(value)) as SelectProps<OSSelectFieldValueType>['onSearch'];
      }
      return showSearch
        ? (((value) => {
            requestOptionsWithDebounce(value, params);
          }) as SelectProps<OSSelectFieldValueType>['onSearch'])
        : undefined;
    })();

    const handleFilterOption: SelectProps<OSSelectFieldValueType>['filterOption'] = (
      inputValue,
      option,
    ) => {
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
    };

    const handleChange: SelectProps<OSSelectFieldValueType>['onChange'] = (
      value: OSSelectFieldValueType,
    ) => {
      /** 清空 searchValue，否则选择的项会高亮 */
      setSearchValue(undefined);

      onChangeHook?.(mergedDataInValue(value));
      return _onChange?.(
        allowClear && Array.isArray(value) && value.length === 0
          ? undefined
          : mergedDataInValue(value),
      );
    };

    const renderNotFoundContent = () => {
      const renderWrapper = (text: string) => {
        return (
          <Row justify="center">
            <Col>
              <Typography.Text type="secondary">{text}</Typography.Text>
            </Col>
          </Row>
        );
      };

      if (loading) {
        return renderWrapper('选项请求中');
      }

      if (requests?.requestOptions) {
        return renderWrapper('未查询到匹配项');
      }

      return renderWrapper('暂无选项');
    };

    const renderOptions = () => {
      return (options || asyncOptions)?.map((item: OSSelectOptionItem) => {
        const labelStr = item.label?.toString();

        const highlightDom = (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchValue == null ? [] : [searchValue]}
            autoEscape
            textToHighlight={labelStr ?? ''}
          />
        );

        const renderInfoOption = (showInfoSetting: OSSelectFieldShowInfo) => {
          return (
            <Row gutter={5} justify="space-between" align="middle" wrap={false}>
              <ShowInfoLabel hoverTitle={labelStr}>{highlightDom}</ShowInfoLabel>
              <Col flex="none">
                <Popover
                  destroyTooltipOnHide
                  overlayStyle={{
                    minWidth: showInfoSetting.popoverWidth ?? 200,
                  }}
                  placement="right"
                  content={extraValueTypes.form({
                    mode: 'read',
                    type: 'form',
                    text: item.data,
                    fieldSettings: {
                      labelCol: { span: 12 },
                      wrapperCol: { span: 12 },
                      fieldItems: showInfoSetting.fieldItems?.map((it) => ({
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
        };

        return (
          <Select.Option
            key={item.key ?? item.value}
            value={item.value}
            label={highlightDom}
            /**
             * 鼠标持续悬停显示更多信息，当 showInfo 时，悬停位置在内部
             */
            title={normalizedShowInfo ? undefined : labelStr}
          >
            {normalizedShowInfo ? renderInfoOption(normalizedShowInfo) : highlightDom}
          </Select.Option>
        );
      });
    };

    return (
      <Select<OSSelectFieldValueType>
        labelInValue={labelInValue}
        ref={OSSelectRef}
        value={_value}
        className={cls(clsPrefix, {
          noborder: bordered === false,
        })}
        mode={selectMode}
        open={open}
        allowClear={allowClear}
        showSearch={showSearch == null ? undefined : !!showSearch}
        optionFilterProp={'label'}
        bordered={bordered}
        disabled={disabled}
        autoFocus={autoFocus}
        loading={loading}
        style={{
          width: '100%',
          minWidth: 125,
          maxWidth,
        }}
        placeholder={(() => {
          if (showSearch) {
            return '请搜索后选择';
          }

          return '请选择选项';
        })()}
        optionLabelProp="label"
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
        dropdownRender={handleDropdownRender}
        onSearch={handleSelect}
        onChange={handleChange}
        /**
         * 后端实现模糊搜索，应该返回所有 options
         * 前端实现，需要进行 label 设置
         */
        filterOption={handleFilterOption}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        notFoundContent={renderNotFoundContent()}
        tagRender={tagRender}
      >
        {renderOptions()}
      </Select>
    );
  }
  return null;
};

export default React.forwardRef(OSSelectField);

export const Settings: React.FC<OSSelectFieldType['settings']> = () => <></>;
export const Requests: React.FC<OSSelectFieldType['requests']> = () => <></>;
export const SelectBaseAPI: React.FC<OSSelectBaseAPI> = () => <></>;