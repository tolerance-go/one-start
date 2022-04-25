import { Badge, Space, Tooltip } from 'antd';
import { useMemo } from 'react';
import type { OSTableType } from '@ty-one-start/typings';
import type { RequiredRecursion } from '@ty-one-start/typings';

const badgeMeta = {
  warning: {
    color: '#faad14',
    label: '预警',
  },
  error: {
    color: '#ff4d4f',
    label: '触发',
  },
  success: {
    color: '#52c41a',
    label: '完成',
  },
};

export const useHighlight = ({
  enableHighlight,
  highlightBadge,
}: {
  enableHighlight: boolean;
  highlightBadge?: RequiredRecursion<OSTableType>['settings']['highlightBadge'];
}) => {
  const mergedMeta = useMemo(() => {
    return Object.keys(highlightBadge ?? badgeMeta).reduce((merged, key) => {
      return {
        ...merged,
        [key]: {
          ...badgeMeta[key],
          ...highlightBadge?.[key],
        },
      };
    }, {});
  }, [highlightBadge]);

  const highlightTag = enableHighlight ? (
    <Space
      size={5}
      align="center"
      style={{
        height: '100%',
      }}
    >
      {Object.keys(mergedMeta).map((key) => {
        const config = mergedMeta[key];
        return (
          <Tooltip key={key} title={config.tooltipTitle ?? `${config.label}高亮提示颜色`}>
            <Badge color={config.color} text={config.label}></Badge>
          </Tooltip>
        );
      })}
    </Space>
  ) : null;

  return {
    highlightTag,
  };
};
