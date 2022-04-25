import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import type { GlobalFooterProps } from '../../typings';
import './index.less';

export default ({ className, prefixCls, links, copyright, style }: GlobalFooterProps) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context.getPrefixCls(prefixCls || 'pro-global-footer');

  if (
    (links == null || links === false || (Array.isArray(links) && links.length === 0)) &&
    (copyright == null || copyright === false)
  ) {
    return null;
  }

  const clsString = classNames(baseClassName, className);
  return (
    <div className={clsString} style={style}>
      {links && (
        <div className={`${baseClassName}-links`}>
          {links.map((link) => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
              rel="noreferrer"
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={`${baseClassName}-copyright`}>{copyright}</div>}
    </div>
  );
};
