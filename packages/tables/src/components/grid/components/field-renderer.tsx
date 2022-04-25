import type { ColumnProps } from 'antd/es/table';
import type { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import type { RecordType } from '@ty-one-start/typings';

export type FieldRendererProps = ICellRendererParams & {
  columnConfigs?: ColumnProps<RecordType>;
};

const FieldRenderer = (props: FieldRendererProps) => {
  const { rowIndex, data: rowData, columnConfigs, getValue } = props;

  const { render } = columnConfigs ?? {};

  return render?.(getValue?.(), rowData, rowIndex);
};

export default FieldRenderer;