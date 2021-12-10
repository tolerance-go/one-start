import type {
  OSLayoutType,
  OSTableType,
  OSTextFieldType,
  OSTriggerType,
} from '@ty-one-start/one-start';
import { OSTable } from '@ty-one-start/one-start';
import { OSLayout, OSTextField, OSTrigger } from '@ty-one-start/one-start';
import type { LayoutNodeChildren, NodeDataType } from '../typings';
import { renderNode } from './render-node';
import { renderNodeSelectorModal } from './render-node-selector-modal';
import { RenderElementType } from './typings';

export const renderElementType: RenderElementType = (
  item: NodeDataType,
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
  options: {
    children?: NodeDataType['children'];
    clsPrefix: string;
  },
) => {
  const { elementType: type, configs } = item ?? {};
  const { clsPrefix, children } = options;

  if (type === 'trigger') {
    return <OSTrigger {...(configs as OSTriggerType)}></OSTrigger>;
  }
  if (type === 'text-field') {
    return <OSTextField {...(configs as OSTextFieldType)}></OSTextField>;
  }
  if (type === 'table') {
    return <OSTable {...(configs as OSTableType)}></OSTable>;
  }
  if (type === 'layout') {
    const layoutConfigs = configs as OSLayoutType;
    const pageMaps = {
      ...(layoutConfigs?.settings?.navData?.reduce((obj, next) => {
        const key = next.key ?? next.title;
        if (!key) {
          return obj;
        }

        const childNodeData = (children as LayoutNodeChildren)?.find(
          (it) => it.data?.pageId === key,
        );

        return {
          ...obj,
          [key]: (
            <>
              {childNodeData
                ? renderNode([childNodeData], setAppData, {
                    clsPrefix,
                    renderElementType,
                  })
                : null}
              {renderNodeSelectorModal(
                <OSTrigger
                  type="button"
                  settings={{
                    type: 'dashed',
                    text: '添加组件',
                  }}
                ></OSTrigger>,
                setAppData,
                {
                  parentData: item,
                  data: {
                    pageId: key,
                  },
                },
              )}
            </>
          ),
        };
      }, {}) as Record<string, React.ReactElement>),
    };

    return (
      <OSLayout
        {...(layoutConfigs as OSLayoutType)}
        settings={{
          ...layoutConfigs?.settings,
          pageMaps,
        }}
      ></OSLayout>
    );
  }
  return null;
};
