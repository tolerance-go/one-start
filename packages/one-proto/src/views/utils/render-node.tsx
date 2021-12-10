import type React from 'react';
import type { NodeDataType } from '../typings';
import { renderNodeWrapper } from './render-node-wrapper';
import { RenderElementType } from './typings';

export const renderNode = (
  data: NodeDataType[],
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
  options: {
    clsPrefix: string;
    renderElementType: RenderElementType;
  },
): React.ReactNode[] | undefined => {
  const { clsPrefix } = options;
  return data?.map((item) => {
    const { children } = item ?? {};

    // if (children && children.length) {
    //   return renderApp(children);
    // }

    const node = options.renderElementType(item, setAppData, { children, clsPrefix });
    return renderNodeWrapper(node, item, setAppData, { clsPrefix });
  });
};
