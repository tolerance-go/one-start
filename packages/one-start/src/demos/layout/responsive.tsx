import { OSLayout } from '@ty-one-start/one-start';
import './index.less';

export default () => (
  <OSLayout
    settings={{
      type: 'responsive',
      layouts: {
        lg: [
          { i: 'a', x: 0, y: 0, w: 1, h: 2 },
          { i: 'b', x: 1, y: 0, w: 5, h: 2, minW: 2, maxW: 4 },
          { i: 'c', x: 6, y: 0, w: 1, h: 2 },
        ],
        md: [
          { i: 'a', x: 0, y: 0, w: 1, h: 2 },
          { i: 'b', x: 3, y: 0, w: 3, h: 2 },
          { i: 'c', x: 8, y: 0, w: 3, h: 2 },
        ],
        sm: [
          { i: 'a', x: 0, y: 0, w: 7, h: 2 },
          { i: 'b', x: 0, y: 0, w: 7, h: 2 },
          { i: 'c', x: 0, y: 0, w: 7, h: 2 },
        ],
      },
      className: 'test',
      containerPadding: [10, 10],
      components: {
        a: 'a',
        b: 'b',
        c: 'c',
      },
    }}
  />
);
