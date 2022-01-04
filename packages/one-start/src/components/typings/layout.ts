import type { ReactGridLayoutProps, ResponsiveProps } from 'react-grid-layout';

export interface OSLayoutType {
  settings?: {
    /** 组件配置 (key要对应layout中的 i)  */
    components: Record<string, React.ReactNode | React.ReactElement>;
  } & (
    | ({
        type: 'simple';
      } & ReactGridLayoutProps)
    | ({
        type: 'responsive';
      } & ResponsiveProps)
  );
}
