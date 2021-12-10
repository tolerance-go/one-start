import {
  IOContainer,
  IOContainerMetaContextProps,
  IOContainerProps,
} from '@ty-one-start/io-component';
import React from 'react';
import { SwapEnvEnums } from '../constants';

type SwapEnv = SwapEnvEnums | string;

type SwapExtra = { [key: string]: any };

type IOSwapContextMetaProps = IOContainerMetaContextProps<SwapEnv, SwapExtra>;

const SwapIOContainer = (props: IOContainerProps<SwapEnv, SwapExtra>) => {
  const { children, ...restProps } = props;
  return <IOContainer {...restProps}>{children}</IOContainer>;
};

export { SwapIOContainer };
export type { SwapEnv, SwapExtra, IOSwapContextMetaProps };
