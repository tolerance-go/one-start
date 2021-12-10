import { IOContainerMetaContext } from '@ty-one-start/io-component';
import { useContext } from 'react';
import type { IOSwapContextMetaProps } from '../components/swap-container';

const useSwapContext = (custom?: IOSwapContextMetaProps) => {
  const context = useContext(IOContainerMetaContext);
  return {
    ...context,
    extra: context.extra ?? {},
    ...custom,
  } as Required<IOSwapContextMetaProps>;
};

export { useSwapContext };
