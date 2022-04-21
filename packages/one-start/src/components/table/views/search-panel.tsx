import React from 'react';
import type { OSFormFieldItem, OSTableType, RequiredRecursion } from '../@ty-one-start/typings';
import { DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW } from '../constants';

const SearchPanel: React.ForwardRefRenderFunction<
  {},
  React.PropsWithChildren<{
    searchFormFieldItems: OSFormFieldItem[];
    searchFormItemChunkSize?: RequiredRecursion<OSTableType>['settings']['searchFormItemChunkSize'];
    searchFormDom?: React.ReactNode;
  }>
> = ({ searchFormFieldItems, searchFormItemChunkSize, searchFormDom }) => {
  const searchFormIsInline =
    searchFormDom &&
    searchFormFieldItems.length <=
      (searchFormItemChunkSize ?? DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW);

  return <>{searchFormIsInline ? null : searchFormDom}</>;
};

export default React.forwardRef(SearchPanel);
