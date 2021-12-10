import {
  IOProviderWrapper,
  IOProviderWrapperProps,
  PercentRawValueType,
  SearchableSelectValueType,
} from '@ty-one-start/io-component';
import React from 'react';

const IOSwapProviderWrapper: React.FC<IOProviderWrapperProps> = (props) => {
  return (
    <IOProviderWrapper
      {...props}
      valueTypeMap={[<SearchableSelectValueType />, <PercentRawValueType />]}
    />
  );
};

export { IOSwapProviderWrapper };
