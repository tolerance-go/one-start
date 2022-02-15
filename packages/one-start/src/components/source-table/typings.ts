import type { OSTableAPI, RecordType } from '../../typings';

export type RowMeta = {
  rowData: RecordType;
  rowIndex: number;
  rowId: string;
  actions: OSTableAPI;
  type: 'edit' | 'view';
};
