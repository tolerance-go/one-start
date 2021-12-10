import { NodeDataType } from '../typings';

export const defaultNodeTypeData: {
  layout: Omit<NodeDataType, 'elementType' | 'children' | 'id' | 'configs'>;
} = {
  layout: {
    wrapper: false,
  },
};
