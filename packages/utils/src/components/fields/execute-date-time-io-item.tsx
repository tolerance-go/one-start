import {
  IOFormDatePickerItem,
  IOItemAPI,
  IOItemPropsOldVersion,
  IOTableItem,
} from '@ty-one-start/io-component';
import moment from 'moment';
import React, { useImperativeHandle } from 'react';
import { SwapFieldNameEnums, SwapFieldNameZhEnums } from '../../constants';
import { useSwapContext } from '../../hooks';

interface ExecuteDateTimeIOItemProps extends IOItemPropsOldVersion {}

const ExecuteDateTimeIOItem = React.forwardRef<IOItemAPI, ExecuteDateTimeIOItemProps>(
  (props, ref) => {
    const { type, mode } = useSwapContext();

    const label = SwapFieldNameZhEnums[SwapFieldNameEnums.ExecuteDateTime];

    const renderContent = () => {
      if (type === 'modal-form' || type === 'form') {
        if (mode === 'edit' || mode === 'update') {
          return (
            <IOFormDatePickerItem
              width="md"
              label={label.form}
              name={SwapFieldNameEnums.ExecuteDateTime}
              rules={[{ required: true, message: `${label.form}必填` }]}
              fieldProps={{ disabledDate: (current) => current && current.isAfter(moment(), 'd') }}
            />
          );
        }
      }
      if (type === 'table') {
        if (mode === 'read') {
          return (
            <IOTableItem<any>
              title={label.tabel}
              valueType="date"
              width={200}
              dataIndex={SwapFieldNameEnums.ExecuteDateTime}
              fieldProps={{
                disabledDate: (current: any) => current && current.isAfter(moment(), 'd'),
              }}
              sorter
              render={(dom, entity) => {
                if ((entity as any)[SwapFieldNameEnums.ExecuteDateTime]) {
                  return moment((entity as any)[SwapFieldNameEnums.ExecuteDateTime]).format(
                    'YYYY-MM-DD HH:mm:ss.SSS',
                  );
                }
                return '-';
              }}
              {...props.tableItemProps}
            />
          );
        }
      }
      return null;
    };

    useImperativeHandle(ref, () => ({
      renderContent,
    }));

    return renderContent();
  },
);

export default ExecuteDateTimeIOItem;
