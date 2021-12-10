import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space, Typography, Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload';
import utl from 'lodash';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ReactNode } from 'react';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { OSDialogAPIContext } from '../dialog/contexts';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  OSMenuItem,
  OSTriggerDropdownAPI,
  OSTriggerDropdownType,
  OSTriggerTooltip,
  OSTriggerUpload,
} from '../typings';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { renderTooltip as renderTooltipUtl } from './utils/render-tooltip';

const OSTriggerDropdown: React.ForwardRefRenderFunction<
  OSTriggerDropdownAPI,
  OSTriggerDropdownType
> = (props, ref) => {
  const {
    settings,
    requests,
    actionsRef: propActionsRef,
    onClick,
    onMenuClick,
    __shouldPush,
    __disabled,
  } = props;

  const {
    text,
    danger,
    icon,
    menu,
    tooltip,
    manualPush = false,
    plain,
    block,
    trigger,
    upload,
    menuVisible,
  } = settings ?? {};

  const [requestAfterMenuClickLoading, setRequestAfterMenuClickLoading] = useState<
    Record<string, boolean>
  >({});
  const itemGroupItemsRef = useRef<Record<string, (string | number)[]>>({});

  const [requestMenuDataLoading, setRequestMenuDataLoading] = useState(false);
  const dialogApisRef = useContext(OSDialogAPIContext);

  const [menuData, setMenuData] = useState<OSMenuItem[]>();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useMergedState(settings?.initialDisabled, {
    value: settings?.disabled ?? __disabled,
  });
  const mouseOverRef = useRef(false);
  const [requestAfterClickLoading, setRequestAfterClickLoading] = useState(false);

  const requestMenuData = async () => {
    if (!requests?.requestMenuData) return;

    setRequestMenuDataLoading(true);
    const { error, data } = await requests.requestMenuData().then(normalizeRequestOutputs);
    setRequestMenuDataLoading(false);

    if (error) return;

    setMenuData(data);
    if (mouseOverRef.current) {
      setVisible(true);
    }
  };

  const pushDialog = async () => {
    if (!manualPush && __shouldPush) {
      setDisabled(true);
      await dialogApisRef.current?.push();
      setDisabled(false);
    }
  };

  const update = (settings_?: OSTriggerDropdownType['settings']) => {
    if (settings_?.disabled != null) {
      setDisabled(settings_.disabled);
    }
  };

  const actionsRef = useActionsRef<OSTriggerDropdownAPI>(
    {
      update,
      setLoading: setRequestAfterClickLoading,
      setDisabled,
    },
    propActionsRef,
  );

  const requestAfterClick = async () => {
    if (!requests?.requestAfterClick) {
      pushDialog();
      return;
    }

    setRequestAfterClickLoading(true);
    const { error } = await requests
      .requestAfterClick({
        actions: actionsRef.current,
      })
      .then(normalizeRequestOutputs);
    setRequestAfterClickLoading(false);
    if (!error) {
      pushDialog();
    }
  };

  const getMenuItemKey = (key: string, keyPath: string[]) => {
    let itemKey = keyPath.join('.');
    if (itemGroupItemsRef.current[key]) {
      itemKey = itemGroupItemsRef.current[key].concat(key).join('.');
    }
    return itemKey;
  };

  const showMenuItemLoading = (loading: boolean, itemKey: string) => {
    setRequestAfterMenuClickLoading((prev) => ({
      ...prev,
      [itemKey]: loading,
    }));
  };

  const requestAfterMenuClick = async (key: string, keyPath: string[]) => {
    if (!requests?.requestAfterMenuClick) return;

    const itemKey = getMenuItemKey(key, keyPath);
    showMenuItemLoading(true, itemKey);
    await requests.requestAfterMenuClick({
      key,
      keyPath,
    });
    showMenuItemLoading(false, itemKey);
  };

  const uploadFile = utl.debounce(async (files: RcFile[], key?: string, keyPath?: string[]) => {
    if (!requests?.requestBeforeUpload) return;

    const setLoading = (loading: boolean) => {
      if (key && keyPath) {
        const itemKey = getMenuItemKey(key, keyPath);
        showMenuItemLoading(loading, itemKey);
      } else {
        setRequestAfterClickLoading(loading);
      }
    };

    setLoading(true);
    await requests
      .requestBeforeUpload({
        files,
        key,
        keyPath,
      })
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());
    setLoading(false);
  }, 50);

  useImperativeHandle(ref, () => ({
    update,
    setLoading: setRequestAfterClickLoading,
    setDisabled,
  }));

  useEffect(() => {
    requestMenuData();
  }, []);

  const renderTooltip = (_tooltip?: OSTriggerTooltip, style?: React.CSSProperties) => {
    return renderTooltipUtl(_tooltip, style);
  };

  const renderText = ({
    text: _text,
    upload: _upload,
    key,
    keyPath,
    disabled: _disabled,
  }: {
    text: React.ReactNode;
    upload?: OSTriggerUpload;
    disabled?: boolean;
    key?: string;
    keyPath?: string[];
  }) => {
    if (_disabled) {
      return _text;
    }
    if (_upload) {
      const { suffixs, maxCount, multiple, directory } = _upload;
      return (
        <Upload
          name="file"
          showUploadList={false}
          accept={suffixs?.join(',')}
          maxCount={maxCount}
          multiple={multiple}
          directory={directory}
          beforeUpload={(file, fileList) => {
            uploadFile(fileList, key, keyPath);
            return false;
          }}
        >
          {_text}
        </Upload>
      );
    }
    return _text;
  };

  const renderDropdownIcon = (_loading: boolean, style?: React.CSSProperties) => {
    return _loading ? (
      <LoadingOutlined
        style={{ display: 'inline-flex', position: 'relative', top: -1, fontSize: 10, ...style }}
      />
    ) : (
      <DownOutlined style={{ display: 'inline-flex', fontSize: 10, ...style }} />
    );
  };

  const renderMenu = (menuItems?: JSX.Element[]) => {
    return <Menu>{utl.isEmpty(menuItems) ? <Menu.Item>数据请求中</Menu.Item> : menuItems}</Menu>;
  };

  const renderMenuItems = (
    menu_?: OSMenuItem[],
    parentItemType: 'item-group' | 'sub-menu' | 'item' = 'item',
    parentKeyPath: string[] = [],
    parentIndex: string[] = [],
  ) => {
    return menu_?.map((item, index) => {
      const stringIndex = index.toString();
      const key = item.key ?? parentIndex.concat(stringIndex).join('-');
      if (item.children) {
        if (item.type === 'sub-menu') {
          return (
            <Menu.SubMenu key={key} icon={item.icon} disabled={item.disabled} title={item.text}>
              {renderMenuItems(
                item.children,
                'sub-menu',
                parentKeyPath?.concat(key ?? []),
                parentIndex.concat(stringIndex),
              )}
            </Menu.SubMenu>
          );
        }
        if (item.type === 'item-group') {
          return (
            <Menu.ItemGroup key={key} title={item.text}>
              {renderMenuItems(
                item.children,
                'item-group',
                parentKeyPath?.concat(key ?? []),
                parentIndex.concat(stringIndex),
              )}
            </Menu.ItemGroup>
          );
        }
      }

      const keyPath = parentKeyPath.concat(key ?? []).reverse();
      const chinaKey = keyPath.join('.');
      const loading = requestAfterMenuClickLoading[chinaKey];

      if (parentItemType === 'item-group') {
        itemGroupItemsRef.current[key] = parentKeyPath;
      }

      return (
        <Menu.Item
          key={key}
          disabled={item.disabled}
          danger={item.danger}
          icon={loading ? <LoadingOutlined></LoadingOutlined> : item.icon}
          onClick={() => {
            if (loading) return;
            onMenuClick?.({
              key,
              keyPath,
            });
            if (item.upload) return;
            if (item.disabled) return;
            requestAfterMenuClick(key, keyPath);
          }}
        >
          {renderTooltip(item.tooltip, {
            marginRight: 5,
          })}
          {renderText({
            text: item.text,
            upload: item.upload,
            key,
            keyPath,
            disabled: item.disabled,
          })}
          {item.menu ? (
            <Dropdown overlay={renderMenu(renderMenuItems(item.menu))} disabled={item.danger}>
              {renderDropdownIcon(false)}
            </Dropdown>
          ) : null}
        </Menu.Item>
      );
    });
  };

  const renderIcon = (style?: React.CSSProperties) => {
    if (requestAfterClickLoading) return null;

    if (React.isValidElement(icon)) {
      const iconEl: React.ReactElement = icon;
      return React.cloneElement(icon, {
        ...iconEl.props,
        style: {
          ...iconEl.props.style,
          ...style,
          display: 'inline-flex',
        },
      });
    }

    return icon;
  };

  const renderButton = (content?: ReactNode) => {
    const handleMouseEnter = () => {
      mouseOverRef.current = true;
    };
    const handleMouseLeave = () => {
      mouseOverRef.current = false;
    };

    const dropdownIconStyle: React.CSSProperties = {
      marginLeft: 2,
    };

    if (plain) {
      const Component = settings?.type === 'link' ? Typography.Link : Typography.Text;
      return (
        <Component
          style={{
            display: block ? 'block' : undefined,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
        >
          {renderIcon({
            marginRight: 5,
          })}
          {renderTooltip(tooltip, {
            marginRight: 5,
          })}
          {renderText({
            text: content,
          })}
          {renderDropdownIcon(requestMenuDataLoading, dropdownIconStyle)}
        </Component>
      );
    }

    return (
      <Button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type={settings?.type}
        disabled={disabled}
        danger={danger}
        icon={renderIcon({
          marginRight: 5,
        })}
        block={block}
      >
        {renderTooltip(tooltip, {
          marginRight: 5,
        })}
        {renderText({
          text: content,
          upload,
        })}
        {renderDropdownIcon(requestMenuDataLoading, dropdownIconStyle)}
      </Button>
    );
  };

  const renderLoading = (style?: React.CSSProperties) => {
    return requestAfterClickLoading ? (
      <LoadingOutlined
        style={{
          display: 'inline-flex',
          ...style,
        }}
      />
    ) : null;
  };

  const renderContent = (_text: React.ReactNode) => {
    const menuItems = renderMenuItems(menu ?? menuData);

    if (settings?.split) {
      return (
        <Dropdown.Button
          trigger={trigger}
          onClick={(event) => {
            if (requestAfterClickLoading) return;
            if (disabled) return;
            onClick?.({ event, actions: actionsRef.current });
            requestAfterClick();
          }}
          type={settings?.type}
          disabled={disabled}
          overlay={renderMenu(menuItems)}
          visible={menuVisible ?? visible}
          onVisibleChange={setVisible}
        >
          <Space size={5}>
            {renderLoading()}
            {requestAfterClickLoading ? null : renderIcon()}
            {renderTooltip(tooltip)}
            {renderText({
              text: _text,
              upload,
            })}
          </Space>
        </Dropdown.Button>
      );
    }

    return (
      <Dropdown
        onVisibleChange={setVisible}
        visible={menuVisible ?? visible}
        overlay={renderMenu(menuItems)}
        trigger={trigger}
        disabled={disabled}
      >
        {renderButton(_text)}
      </Dropdown>
    );
  };

  return renderContent(text);
};

export default React.forwardRef(OSTriggerDropdown);
