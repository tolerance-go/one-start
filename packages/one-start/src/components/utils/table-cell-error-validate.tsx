import utl from 'lodash';
import type { FieldError } from 'rc-field-form/lib/interface';
import type { RecordType } from '../typings';

export const tableCellErrorValidate = ({
  errorFields,
  dataSource,
}: // title,
{
  errorFields: FieldError[];
  dataSource?: RecordType[];
  title?: string;
}) => {
  const groups = utl.groupBy(
    errorFields
      .filter((item) => item.errors.length)
      .map((item) => {
        const [id] = item.name;
        // const columnConfigs = api?.getColumnsStaticPureConfigsIdMaps();

        const rowIndex = dataSource?.findIndex((rowData) => rowData.id === id);

        return {
          rowIndex,
          errors: item.errors,
        };
      }),
    (item) => item.rowIndex,
  );
  const message = Object.keys(groups)
    .map((rowIndex) => {
      const errorsArr = groups[rowIndex].map((item) => item.errors);
      return `${rowIndex != null ? `第 ${Number(rowIndex) + 1} 行内` : ''}${utl
        .flatten(errorsArr)
        .join(', ')}`;
    })
    .join('; ');

  return message;
};
