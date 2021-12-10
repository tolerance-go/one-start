import { ProColumnType } from '@ty-one-start/io-component';

const strinifyTableDataIndex = <Record extends {} = any>(
  dataIndex: ProColumnType<Record>['dataIndex'],
) => {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join('-');
  }
  return dataIndex ?? '';
};

export { strinifyTableDataIndex };
