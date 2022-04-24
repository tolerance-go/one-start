export const normalizeDataIndex = (
  dataIndex: number | string | readonly (string | number)[] | undefined | null,
) => {
  if (Array.isArray(dataIndex)) {
    return dataIndex as (string | number)[];
  }
  if (dataIndex == null) {
    return [];
  }
  return [dataIndex];
};
