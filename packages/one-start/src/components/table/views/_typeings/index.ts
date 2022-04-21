import type { OSSelectFieldType } from '../../@ty-one-start/typings';

export type SearchRequestOptionsMapColIdItemType = {
  dataIndexId: string;
  request: Required<Required<OSSelectFieldType>['requests']>['requestOptions'];
  showSearchType?: 'remote' | 'local';
  enableShowSearch: boolean;
};

export type SearchRequestOptionsMapColIdType = Record<string, SearchRequestOptionsMapColIdItemType>;
