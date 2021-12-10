import cls from 'classnames';
import React, { useImperativeHandle, useRef } from 'react';
import OSSourceTable from '../source-table';
import type {
  OSSearchTableAPI,
  OSSearchTableSelfType,
  OSSearchTableType,
  OSSourceTableAPI,
} from '../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useSearchTemplate } from './use-search-template';

const OSSearchTable: React.ForwardRefRenderFunction<OSSearchTableAPI, OSSearchTableType> = (
  props,
  ref,
) => {
  const { settings, requests, className } = props;
  const clsPrefix = useClsPrefix('search-table');

  const sourceTableRef = useRef<OSSourceTableAPI>(null);

  const { createOrUpdateTempldateDom } = useSearchTemplate({
    requestUpdateSearchTempldate: requests?.requestUpdateSearchTempldate,
    requestApplayTemplateSearchValues: requests?.requestApplayTemplateSearchValues,
    requestCreateTemplate: requests?.requestCreateTemplate,
    requestTemplateDataSource: requests?.requestTemplateDataSource,
    requestRowEditTemplate: requests?.requestRowEditTemplate,
    requestSaveRowTemplate: requests?.requestSaveRowTemplate,
    requestRemoveTemplate: requests?.requestRemoveTemplate,
    templateManagementTableFieldItems:
      settings?.searchTempldateable?.templateManagementTableFieldItems,
    createFormFieldItems: settings?.searchTempldateable?.createFormFieldItems,
    enable: !!settings?.searchTempldateable,
    templateNameKey: settings?.searchTempldateable?.templateNameKey,
    editFormFieldItems: settings?.searchTempldateable?.editFormFieldItems,
    sourceTableRef,
  });

  useImperativeHandle(ref, () => sourceTableRef.current!);

  return (
    <OSSourceTable
      {...props}
      ref={sourceTableRef}
      className={cls(clsPrefix, className)}
      extraActions={
        createOrUpdateTempldateDom
          ? () => {
              return [createOrUpdateTempldateDom];
            }
          : undefined
      }
    />
  );
};

export default React.forwardRef(OSSearchTable);
export const Settings: React.FC<OSSearchTableSelfType['settings']> = () => <></>;
export const Requests: React.FC<OSSearchTableSelfType['requests']> = () => <></>;
