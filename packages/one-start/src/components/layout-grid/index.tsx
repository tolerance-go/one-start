import type { FC } from 'react';
import type { ReactGridLayoutProps, ResponsiveProps } from 'react-grid-layout';
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout';
import type { OSGridLayoutType } from '../typings';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const OSGridLayout: FC<OSGridLayoutType> = ({ settings }) => {
  const { type, components, ...rest } = settings ?? {};

  const renderLayoutComponents = () =>
    Object.entries(components ?? {}).map(([key, component]) => <div key={key}>{component}</div>);

  if (type === 'simple') {
    return (
      <GridLayout
        className="layout"
        rowHeight={50}
        width={1500}
        {...(rest as ReactGridLayoutProps)}
      >
        {renderLayoutComponents()}
      </GridLayout>
    );
  }
  if (type === 'responsive') {
    return (
      <ResponsiveGridLayout className="layout" {...(rest as ResponsiveProps)}>
        {renderLayoutComponents()}
      </ResponsiveGridLayout>
    );
  }
  return <></>;
};

export default OSGridLayout;

export const Settings: React.FC<OSGridLayoutType['settings']> = () => <></>;
export const Layout: React.FC<ReactGridLayout.Layout> = () => <></>;
export const GridLayoutProps: React.FC<ReactGridLayoutProps> = () => <></>;
export const ResponsiveLayoutProps: React.FC<ResponsiveProps> = () => <></>;
