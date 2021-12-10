import { NodeDataType } from '../typings';

export type RenderElementType = (
  item: NodeDataType,
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
  options: {
    children?: NodeDataType['children'];
    clsPrefix: string;
  },
) => React.ReactNode;
