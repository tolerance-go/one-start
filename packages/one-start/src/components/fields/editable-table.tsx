import React, { useContext, useMemo } from 'react';
import OSEditableTable from '../editable-table';
import { FormInstanceContext } from '../providers/form-context';
import type {
  OSEditableTableAPI,
  OSEditableTableFieldAPI,
  OSEditableTableFieldType,
  OSEditableTableType,
  OSTableType,
} from '../typings';
import { parseTableValue } from '../utils/parse-table-value';
import type { RequiredRecursion } from '../utils/typings';

const OSEditableTableField: React.ForwardRefRenderFunction<
  OSEditableTableFieldAPI,
  OSEditableTableFieldType
> = (props, ref) => {
  const {
    text,
    onChangeHook,
    settings,
    requests,
    mode = 'read',
    value: _value,
    onChange: _onChange,
  } = props;

  const { bordered, autoFocus, disabled, ...tableSettings } = settings ?? {};

  const mergedValue = useMemo(() => {
    return parseTableValue(text ?? _value)?.map((item, index) => ({
      ...item,
      id: item[tableSettings.rowKey ?? 'id'] ?? index.toString(),
    }));
  }, [_value, tableSettings.rowKey, text]);

  const formInstanceContext = useContext(FormInstanceContext);

  const wrapRequestNewRecordData:
    | RequiredRecursion<OSEditableTableType>['requests']['requestNewRecordData']
    | undefined =
    requests?.requestNewRecordData &&
    (async (options) => {
      return requests.requestNewRecordData!({
        ...options,
        form: formInstanceContext.current,
      });
    });

  const wrapRequestRemoveRecord:
    | RequiredRecursion<OSEditableTableType>['requests']['requestRemoveRecord']
    | undefined =
    requests?.requestRemoveRecord &&
    (async (options) => {
      return requests.requestRemoveRecord!({
        ...options,
        form: formInstanceContext.current,
      });
    });

  const requestsData: OSEditableTableType['requests'] = {
    ...requests,
    requestNewRecordData: wrapRequestNewRecordData,
    requestRemoveRecord: wrapRequestRemoveRecord,
  };

  if (mode === 'read') {
    return (
      <OSEditableTable
        settings={{
          ...tableSettings,
          addable: false,
          removeable: false,
          fieldItemSettings: {
            editable: false,
            ...tableSettings.fieldItemSettings,
          },
        }}
        requests={requestsData}
        ref={ref as React.MutableRefObject<OSEditableTableAPI>}
        value={mergedValue}
        onChange={_onChange}
        autoRequestWhenMounted={false}
      />
    );
  }

  if (mode === 'edit' || mode === 'update') {
    const onChange: OSTableType['onChange'] = (value) => {
      onChangeHook?.(parseTableValue(value));
      return _onChange?.(value);
    };

    return (
      <OSEditableTable
        settings={tableSettings}
        requests={requestsData}
        ref={ref as React.MutableRefObject<OSEditableTableAPI>}
        value={mergedValue}
        onChange={onChange}
        autoRequestWhenMounted={false}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSEditableTableField);
