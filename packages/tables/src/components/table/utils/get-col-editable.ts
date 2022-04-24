import type {
  OSTableFormFieldItemExtra,
  OSTableType,
  RecordType,
  RequiredRecursion,
} from '@ty-one-start/typings';

/** 根据行编辑和列编辑共同计算单元格是否开启编辑 */
export const getColEditable = ({
  rowData,
  rowIndex,
  editable,
  editableRowKeys,
  rowKey,
}: {
  rowKey: string;
  rowData?: RecordType;
  rowIndex?: number;
  editable?: RequiredRecursion<OSTableFormFieldItemExtra>['settings']['editable'];
  editableRowKeys?: RequiredRecursion<OSTableType>['settings']['editableRowKeys'];
}) => {
  const colEditable = (() => {
    if (editable == null) {
      return false;
    }
    if (typeof editable === 'function') {
      return editable(rowData, rowIndex);
    }
    return !!editable;
  })();

  return colEditable && (editableRowKeys ? editableRowKeys.includes(rowData?.[rowKey]) : true);
};
