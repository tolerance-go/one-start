import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import React, { useState } from 'react';
import { useClsPrefix } from '@ty-one-start/utils';
import PlaygroundSettings from './playground-settings';
import { NodeDataType } from './typings';
import { renderNode } from './utils/render-node';
import { renderNodeSelectorModal } from './utils/render-node-selector-modal';
import { renderElementType } from './utils/render-element-type';

import './theme.less';

export interface OSProtoType {}

const Page: React.FC<OSProtoType> = () => {
  const [appData, setAppData] = useState<NodeDataType[]>([]);
  const clsPrefix = useClsPrefix('playground');

  return (
    <OSProviderWrapper>
      {renderNode(appData, setAppData, {
        clsPrefix,
        renderElementType,
      })}
      {appData.some((item) => item.elementType === 'layout')
        ? null
        : renderNodeSelectorModal(
            <OSTrigger
              type="button"
              settings={{
                type: 'dashed',
                text: '添加组件',
              }}
            ></OSTrigger>,
            setAppData,
          )}
      <PlaygroundSettings setAppData={setAppData} clsPrefix={clsPrefix} appData={appData} />
    </OSProviderWrapper>
  );
};

export default Page;
