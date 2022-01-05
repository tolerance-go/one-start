import { Space, Typography } from '@ty/antd';
import React, { useImperativeHandle, useState } from 'react';
import { normalizeRequestOutputs, OSTrigger } from '../../components';
import type { OSActionsCreateType, OSFormAPI, RequiredRecursion } from '../../typings';

type TemplateData = { id: string; name: string };

export type ApplyingTemplateProps = {
  createFormRef: React.RefObject<OSFormAPI>;
  onSaveTplSussecc?: () => void;
  requestUpdateTemplateValues?: RequiredRecursion<OSActionsCreateType>['requests']['requestUpdateTemplateValues'];
};

export type ApplyingTemplateAPI = {
  setApplyingTemplate: React.Dispatch<React.SetStateAction<TemplateData | undefined>>;
};

const ApplyingTemplate: React.ForwardRefRenderFunction<ApplyingTemplateAPI, ApplyingTemplateProps> =
  (props, ref) => {
    const { requestUpdateTemplateValues } = props;
    const [applyingTemplate, setApplyingTemplate] = useState<TemplateData>();

    useImperativeHandle(ref, () => {
      return {
        setApplyingTemplate,
      };
    });

    return applyingTemplate ? (
      <Space size={5}>
        <Typography.Text type="secondary">当前模板</Typography.Text>
        <Typography.Text>{applyingTemplate?.name}</Typography.Text>
        <OSTrigger
          type="button"
          settings={{
            text: '保存模板',
          }}
          requests={{
            requestAfterSync: async () => {
              if (!requestUpdateTemplateValues) return;

              if (!applyingTemplate) return;

              const { error } = await requestUpdateTemplateValues({
                values: props.createFormRef.current?.getDataSource() ?? {},
                templateId: applyingTemplate.id,
              }).then(normalizeRequestOutputs);

              if (error) return;

              props.onSaveTplSussecc?.();
            },
          }}
        ></OSTrigger>
      </Space>
    ) : null;
  };

export default React.forwardRef(ApplyingTemplate);
