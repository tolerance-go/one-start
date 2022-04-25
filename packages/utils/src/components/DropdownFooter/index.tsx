import React, { useContext } from 'react';
import { Button, ConfigProvider } from 'antd';

import './index.less';

type LightFilterFooterRender =
  | ((
      onConfirm?: (e?: React.MouseEvent) => void,
      onClear?: (e?: React.MouseEvent) => void,
    ) => JSX.Element | false)
  | false;

type OnClick = (e?: React.MouseEvent) => void;

export type DropdownFooterProps = {
  onClear?: OnClick;
  onConfirm?: OnClick;
  disabled?: boolean;
  footerRender?: LightFilterFooterRender;
};

const DropdownFooter: React.FC<DropdownFooterProps> = (props) => {
  const { onClear, onConfirm, disabled, footerRender } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('pro-core-dropdown-footer');
  const defaultFooter = [
    <Button
      key="clear"
      style={{
        visibility: onClear ? 'visible' : 'hidden',
      }}
      type="link"
      size="small"
      disabled={disabled}
      onClick={(e) => {
        if (onClear) {
          onClear(e);
        }
        e.stopPropagation();
      }}
    >
      {'清除'}
    </Button>,
    <Button
      key="confirm"
      data-type="confirm"
      type="primary"
      size="small"
      onClick={onConfirm}
      disabled={disabled}
    >
      {'确认'}
    </Button>,
  ];

  if (footerRender === false || footerRender?.(onConfirm, onClear) === false) {
    return null;
  }

  const renderDom = footerRender?.(onConfirm, onClear) || defaultFooter;

  return (
    <div
      className={prefixCls}
      onClick={(e) =>
        (e.target as Element).getAttribute('data-type') !== 'confirm' && e.stopPropagation()
      }
    >
      {renderDom}
    </div>
  );
};

export default DropdownFooter;
