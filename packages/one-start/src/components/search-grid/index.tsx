import cls from 'classnames';
import React, { useImperativeHandle, useRef } from 'react';
import OSSourceGrid from '../source-grid';
import type { OSSearchGridAPI, OSSearchGridType, OSSourceGridAPI } from '../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useSearchTemplate } from './use-search-template';

const OSSearchGrid: React.ForwardRefRenderFunction<OSSearchGridAPI, OSSearchGridType> = (
  props,
  ref,
) => {
  const { settings, requests, className } = props;
  const clsPrefix = useClsPrefix('search-table');

  const sourceGridRef = useRef<OSSourceGridAPI>(null);

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
    sourceGridRef,
  });

  useImperativeHandle(ref, () => sourceGridRef.current!);

  return (
    <OSSourceGrid
      {...props}
      ref={sourceGridRef}
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

export default React.forwardRef(OSSearchGrid);
export const Settings: React.FC<OSSearchGridType['settings']> = () => <></>;
export const Requests: React.FC<OSSearchGridType['requests']> = () => <></>;
