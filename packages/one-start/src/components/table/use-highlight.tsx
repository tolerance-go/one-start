import { Badge, Space, Tooltip } from '@ty/antd';
import { useMemo } from 'react';
import type { OSTableType } from '../typings';
import type { RequiredRecursion } from '../utils/typings';

const meta = {
  warning: {
    color: '#faad14',
    bgColor: '#ffd666',
    frontColor: '#000000',
    label: '预警',
  },
  error: {
    color: '#f5222d',
    bgColor: '#f5222d',
    frontColor: '#ffffff',
    label: '触发',
  },
  // success: {
  //   color: '#52c41a',
  //   bgColor: '#52c41a',
  //   frontColor: '#ffffff',
  //   label: '完成',
  //   tooltipTitle: '完成提示颜色',
  // },
};

export const useHighlight = ({
  enableHighlight,
  highlightBadge,
}: {
  enableHighlight: boolean;
  highlightBadge?: RequiredRecursion<OSTableType>['settings']['highlightBadge'];
}) => {
  const mergedMeta = useMemo(() => {
    return Object.keys(highlightBadge ?? meta).reduce((merged, key) => {
      return {
        ...merged,
        [key]: {
          ...meta[key],
          ...highlightBadge?.[key],
        },
      };
    }, {});
  }, [highlightBadge]);

  const highlightTag = enableHighlight ? (
    <Space size={5}>
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
