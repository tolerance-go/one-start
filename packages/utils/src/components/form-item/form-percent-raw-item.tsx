import React from 'react';
import PercentRaw from './form-percent-raw';
import type { PercentRawProps } from './form-percent-raw';
import { ratePrecison, generateNumberDigitsRule } from '../../constants';

type FormItemPercentRawProps = PercentRawProps;

/** 进行一些基础封装 */
const FormItemPercentRaw = (props: FormItemPercentRawProps) => {
  const { rules = [] } = props;
  return (
    <PercentRaw
      validateFirst
      {...props}
      rules={rules?.concat([
        /** 百分比 整数位 1位 小数位限制 6 位 */
        generateNumberDigitsRule({
          integersMaxLen: 1,
          floatsMaxLen: 6,
          percent: true,
        }),
      ])}
      fieldProps={{
        precision: ratePrecison,
        ...props.fieldProps,
      }}
    />
  );
};

export default FormItemPercentRaw;
