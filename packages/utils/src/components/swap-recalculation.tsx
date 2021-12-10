import type { ActionType } from '@ty-one-start/io-component';
import { IOContainer } from '@ty-one-start/io-component';
import { Button } from '@ty/antd';
import React, { useCallback } from 'react';
import { SwapEnvEnums, SwapFieldNameEnums } from '../constants';
import { modalConfirmPromise } from '../utils';
import { ExecuteDateTimeIOItem } from './fields';

interface SwapRecalculationProps {
  actions?: ActionType;
  /** utils 处于 services 下层，使用动态调用，修复错误分层依赖 */
  reportDagRunService: (...args: any[]) => Promise<any>;
}

const SwapRecalculation: React.FC<SwapRecalculationProps> = (props) => {
  const handleFormFinish = useCallback(async (values) => {
    await modalConfirmPromise(
      props.reportDagRunService,
      values[SwapFieldNameEnums.ExecuteDateTime],
      '确定重跑收益互换标的估值报告，收益互换合约信息与收益互换保障金管理报告?',
    );
    return true;
  }, []);

  return (
    <IOContainer
      type="modal-form"
      mode="edit"
      env={SwapEnvEnums.SwapUnderlyingInstrumentValuation}
      containerProps={{
        trigger: <Button type="primary">重新计算</Button>,
        disableSubmitOnEnter: true,
        onFinish: handleFormFinish,
        modalProps: {
          width: 500,
        },
      }}
    >
      <ExecuteDateTimeIOItem />
    </IOContainer>
  );
};

export { SwapRecalculation };
