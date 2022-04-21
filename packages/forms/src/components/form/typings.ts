import type EventEmitter from 'eventemitter3';
import type { RecordType, ValueAsyncLinkage, ValueLinkage } from '@ty-one-start/typings';

export type FormCoreActions = {
  setFieldsValue: (dataSource_?: RecordType) => void;
  onChange?: (dataSource_?: RecordType) => void;
  onValuesLinkageChange?: (changedValues: RecordType, values: RecordType) => void;
  valueAsyncLinkage?: {
    // 串行
    serial?: ValueAsyncLinkage[];
    // 并行
    parallel?: Record<string, ValueAsyncLinkage>;
  };
  valueLinkage?: ValueLinkage[];
  onDataSourceLinkageChange: (dataSource: RecordType) => void;
  onDataSourceChange: (dataSource: RecordType) => void;
  once: EventEmitter['once'];
  on: EventEmitter['on'];
  off: EventEmitter['off'];
  emit: EventEmitter['emit'];
};
