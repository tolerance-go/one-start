import { ConfigProvider } from '@ty/antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import RouteContext from '../../RouteContext';
import type { GridContentProps } from '../../typings';
import './GridContent.less';

/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 *
 * @param props
 */
const GridContent: React.FC<GridContentProps> = (props) => {
  const value = useContext(RouteContext);
  const { children, contentWidth: propsContentWidth, className: propsClassName, style } = props;

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = props.prefixCls || getPrefixCls('pro');
  const contentWidth = propsContentWidth || value.contentWidth;
  const className = `${prefixCls}-grid-content`;

  return (
    <div
      className={classNames(className, propsClassName, {
        wide: contentWidth === 'Fixed',
      })}
      style={style}
    >
      <div className={`${prefixCls}-grid-content-children`}>{children}</div>
    </div>
  );
};

export default GridContent;
