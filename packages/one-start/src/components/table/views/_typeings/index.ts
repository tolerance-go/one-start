import type { OSSelectFieldType } from '../../../../typings';

export type SearchRequestOptionsMapColIdItemType = {
  dataIndexId: string;
  request: Required<Required<OSSelectFieldType>['requests']>['requestOptions'];
  showSearchType?: 'remote' | 'local';
  enableShowSearch: boolean;
};

export type SearchRequestOptionsMapColIdType = Record<string, SearchRequestOptionsMapColIdItemType>;
