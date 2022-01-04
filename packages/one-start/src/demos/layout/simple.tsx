import { OSLayout } from '@ty-one-start/one-start';
import './index.less';

export default () => (
  <OSLayout
    settings={{
      type: 'simple',
      layout: [
        { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
        { i: 'b', x: 1, y: 0, w: 3, h: 2, isResizable: false },
        { i: 'c', x: 4, y: 0, w: 2, h: 2, minW: 2, maxW: 4 },
      ],
      className: 'test',
      containerPadding: [10, 10],
      components: {
        a: 'a 我是固定的 不可拖拽 不可缩放大小 ',
        b: 'b 我不可缩放大小',
        c: 'c 我有最小/最大缩放宽度',
      },
    }}
  />
);
