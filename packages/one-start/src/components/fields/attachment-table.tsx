import React, { useContext, useMemo } from 'react';
import OSAttachmentTable from '../attachment-table';
import { FormInstanceContext } from '../providers/form-context';
import type {
  OSAttachmentTableAPI,
  OSAttachmentTableFieldAPI,
  OSAttachmentTableFieldType,
  OSAttachmentTableType,
  OSTableType,
  RequiredRecursion,
} from '../../typings';
import { parseTableValue } from '../utils/parse-table-value';

const OSAttachmentTableField: React.ForwardRefRenderFunction<
  OSAttachmentTableFieldAPI,
  OSAttachmentTableFieldType
> = (props, ref) => {
  const {
    text,
    onValueChange,
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
    | RequiredRecursion<OSAttachmentTableType>['requests']['requestNewRecordData']
    | undefined =
    requests?.requestNewRecordData &&
    (async (options) => {
      return requests.requestNewRecordData!({
        ...options,
        form: formInstanceContext.current,
      });
    });

  const wrapRequestRemoveRecord:
    | RequiredRecursion<OSAttachmentTableType>['requests']['requestRemoveRecord']
    | undefined =
    requests?.requestRemoveRecord &&
    (async (options) => {
      return requests.requestRemoveRecord!({
        ...options,
        form: formInstanceContext.current,
      });
    });

  const requestsData: OSAttachmentTableType['requests'] = {
    ...requests,
    requestNewRecordData: wrapRequestNewRecordData,
    requestRemoveRecord: wrapRequestRemoveRecord,
  };

  if (mode === 'read') {
    return (
      <OSAttachmentTable
        settings={{
          addable: false,
          removeable: false,
          downloadable: {},
          ...tableSettings,
          fieldItemSettings: {
            editable: false,
            ...tableSettings.fieldItemSettings,
          },
        }}
        requests={requestsData}
        ref={ref as React.MutableRefObject<OSAttachmentTableAPI>}
        value={mergedValue}
        onChange={_onChange}
        autoRequestWhenMounted={false}
      />
    );
  }

  if (mode === 'edit' || mode === 'update') {
    const onChange: OSTableType['onChange'] = (value) => {
      onValueChange?.(parseTableValue(value));
      return _onChange?.(value);
    };

    return (
      <OSAttachmentTable
        settings={{
          removeable: {},
          addable: {},
          ...tableSettings,
        }}
        requests={requestsData}
        ref={ref as React.MutableRefObject<OSAttachmentTableAPI>}
        value={mergedValue}
        onChange={onChange}
        autoRequestWhenMounted={false}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSAttachmentTableField);
