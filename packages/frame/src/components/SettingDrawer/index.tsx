import {
  CloseOutlined,
  CopyOutlined,
  NotificationOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { isBrowser, merge } from '@ty-one-start/utils';
import { Alert, Button, ConfigProvider, Divider, Drawer, List, message, Switch } from '@ty/antd';
import { disable as darkreaderDisable, enable as darkreaderEnable } from '@umijs/ssr-darkreader';
import { useUrlSearchParams } from '@umijs/use-params';
import omit from 'omit.js';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { useEffect, useRef, useState } from 'react';
import defaultSettings from '../../defaultSettings';
import { getLanguage } from '../../locales';
import type { BodyProps, MergerSettingsType, ProSettings, SettingDrawerProps } from '@ty-one-start/typings';
import { genStringToTheme } from '../../utils/utils';
import BlockCheckbox from './BlockCheckbox';
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange';
import RegionalSetting from './RegionalChange';
import ThemeColor from './ThemeColor';
import './index.less';
import { getFormatMessage } from './utils';

const Body: React.FC<BodyProps> = ({ children, prefixCls, title }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 className={`${prefixCls}-drawer-title`}>{title}</h3>
    {children}
  </div>
);

const getDifferentSetting = (state: Partial<ProSettings>): Record<string, any> => {
  const stateObj: Partial<ProSettings> = {};
  Object.keys(state).forEach((key) => {
    if (state[key] !== defaultSettings[key] && key !== 'collapse') {
      stateObj[key] = state[key];
    } else {
      stateObj[key] = undefined;
    }
    if (key.includes('Render')) stateObj[key] = state[key] === false ? false : undefined;
  });
  stateObj.menu = undefined;
  return stateObj;
};

const updateTheme = async (dark: boolean, color?: string) => {
  if (typeof window === 'undefined') return;
  if (typeof window.MutationObserver === 'undefined') return;

  if (!ConfigProvider.config) return;
  ConfigProvider.config({
    theme: {
      primaryColor: genStringToTheme(color) || '#1890ff',
    },
    /** @TODO: antd 升级版本以支持 theme */
  } as any);

  if (dark) {
    const defaultTheme = {
      brightness: 100,
      contrast: 90,
      sepia: 10,
    };

    const defaultFixes = {
      invert: [],
      css: '',
      ignoreInlineStyle: ['.react-switch-handle'],
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: true,
    };
    if (window.MutationObserver) darkreaderEnable(defaultTheme, defaultFixes);
  } else if (window.MutationObserver) darkreaderDisable();
};

/**
 * 初始化的时候需要做的工作
 *
 * @param param0
 */
const initState = (
  urlParams: Record<string, any>,
  settings: Partial<ProSettings>,
  onSettingChange: SettingDrawerProps['onSettingChange'],
) => {
  if (!isBrowser()) return;

  const replaceSetting = {};
  Object.keys(urlParams).forEach((key) => {
    if (defaultSettings[key] || defaultSettings[key] === undefined) {
      if (key === 'primaryColor') {
        replaceSetting[key] = genStringToTheme(urlParams[key]);
        return;
      }
      replaceSetting[key] = urlParams[key];
    }
  });
  const newSettings: MergerSettingsType<ProSettings> = merge({}, settings, replaceSetting);
  delete newSettings.menu;
  delete newSettings.title;
  delete newSettings.iconfontUrl;

  // 同步数据到外部
  onSettingChange?.(newSettings);

  // 如果 url 中设置主题，进行一次加载。
  if (defaultSettings.navTheme !== urlParams.navTheme && urlParams.navTheme) {
    updateTheme(settings.navTheme === 'realDark', urlParams.primaryColor);
  }
};

const getParamsFromUrl = (
  urlParams: Record<string, any>,
  settings?: MergerSettingsType<ProSettings>,
) => {
  if (!isBrowser()) return defaultSettings;

  return {
    ...defaultSettings,
    ...(settings || {}),
    ...urlParams,
  };
};

const genCopySettingJson = (settingState: MergerSettingsType<ProSettings>) =>
  JSON.stringify(
    omit(
      {
        ...settingState,
        primaryColor: settingState.primaryColor,
      },
      ['colorWeak'],
    ),
    null,
    2,
  );

/**
 * 可视化配置组件
 *
 * @param props
 */
const SettingDrawer: React.FC<SettingDrawerProps> = (props) => {
  const {
    defaultSettings: propsDefaultSettings = undefined,
    settings: propsSettings = undefined,
    hideHintAlert,
    hideCopyButton,
    colorList = [
      { key: 'daybreak', color: '#1890ff' },
      { key: 'dust', color: '#F5222D' },
      { key: 'volcano', color: '#FA541C' },
      { key: 'sunset', color: '#FAAD14' },
      { key: 'cyan', color: '#13C2C2' },
      { key: 'green', color: '#52C41A' },
      { key: 'geekblue', color: '#2F54EB' },
      { key: 'purple', color: '#722ED1' },
    ],
    getContainer,
    onSettingChange,
    enableDarkTheme,
    prefixCls = 'ant-pro',
    pathname = window.location.pathname,
    disableUrlParams = true,
    themeOnly,
  } = props;
  const firstRender = useRef<boolean>(true);

  const [show, setShow] = useMergedState(false, {
    value: props.collapse,
    onChange: props.onCollapseChange,
  });

  const [language, setLanguage] = useState<string>(getLanguage());
  const [urlParams, setUrlParams] = useUrlSearchParams(
    {},
    {
      disabled: disableUrlParams,
    },
  );

  const [settingState, setSettingState] = useMergedState<Partial<ProSettings>>(
    () => getParamsFromUrl(urlParams, propsSettings || propsDefaultSettings),
    {
      value: propsSettings,
      onChange: onSettingChange,
    },
  );

  const { navTheme, primaryColor, layout, colorWeak } = settingState || {};

  useEffect(() => {
    // 语言修改，这个是和 locale 是配置起来的
    const onLanguageChange = (): void => {
      if (language !== getLanguage()) {
        setLanguage(getLanguage());
      }
    };

    /** 如果不是浏览器 都没有必要做了 */
    if (!isBrowser()) return () => null;
    initState(getParamsFromUrl(urlParams, propsSettings), settingState, setSettingState);
    window.document.addEventListener('languagechange', onLanguageChange, {
      passive: true,
    });

    return () => window.document.removeEventListener('languagechange', onLanguageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateTheme(settingState.navTheme === 'realDark', settingState.primaryColor);
  }, [settingState.primaryColor, settingState.navTheme]);
  /**
   * 修改设置
   *
   * @param key
   * @param value
   */
  const changeSetting = (key: string, value: string | boolean) => {
    const nextState = {} as any;
    nextState[key] = value;

    if (key === 'layout') {
      nextState.contentWidth = value === 'top' ? 'Fixed' : 'Fluid';
    }
    if (key === 'layout' && value !== 'mix') {
      nextState.splitMenus = false;
    }
    if (key === 'layout' && value === 'mix') {
      nextState.navTheme = 'light';
    }
    if (key === 'colorWeak' && value === true) {
      const dom = document.querySelector('body');
      if (dom) {
        dom.dataset.prosettingdrawer = dom.style.filter;
        dom.style.filter = 'invert(80%)';
      }
    }
    if (key === 'colorWeak' && value === false) {
      const dom = document.querySelector('body');
      if (dom) {
        dom.style.filter = dom.dataset.prosettingdrawer || 'none';
        delete dom.dataset.prosettingdrawer;
      }
    }
    delete nextState.menu;
    delete nextState.title;
    delete nextState.iconfontUrl;
    delete nextState.logo;
    delete nextState.pwa;

    setSettingState({ ...settingState, ...nextState });
  };

  const formatMessage = getFormatMessage();

  useEffect(() => {
    /** 如果不是浏览器 都没有必要做了 */
    if (!isBrowser()) return;
    if (disableUrlParams) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    /** 每次从url拿最新的防止记忆 */
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const diffParams = getDifferentSetting({ ...params, ...settingState });

    delete diffParams.logo;
    delete diffParams.menu;
    delete diffParams.title;
    delete diffParams.iconfontUrl;
    delete diffParams.pwa;

    setUrlParams(diffParams);
  }, [setUrlParams, settingState, urlParams, pathname, disableUrlParams]);
  const baseClassName = `${prefixCls}-setting`;

  return (
    <Drawer
      visible={show}
      width={300}
      closable={false}
      onClose={() => setShow(false)}
      placement="right"
      getContainer={getContainer}
      handler={
        <div className={`${baseClassName}-drawer-handle`} onClick={() => setShow(!show)}>
          {show ? (
            <CloseOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          ) : (
            <SettingOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          )}
        </div>
      }
      style={{
        zIndex: 999,
      }}
    >
      <div className={`${baseClassName}-drawer-content`}>
        <Body
          title={formatMessage({
            id: 'app.setting.pagestyle',
            defaultMessage: 'Page style setting',
          })}
          prefixCls={baseClassName}
        >
          <BlockCheckbox
            prefixCls={baseClassName}
            list={[
              {
                key: 'light',
                title: formatMessage({
                  id: 'app.setting.pagestyle.light',
                  defaultMessage: '亮色菜单风格',
                }),
              },
              {
                key: 'dark',
                title: formatMessage({
                  id: 'app.setting.pagestyle.dark',
                  defaultMessage: '暗色菜单风格',
                }),
              },
              {
                key: 'realDark',
                title: formatMessage({
                  id: 'app.setting.pagestyle.realdark',
                  defaultMessage: '暗色菜单风格',
                }),
              },
            ].filter((item) => {
              if (item.key === 'dark' && settingState.layout === 'mix') return false;
              if (item.key === 'realDark' && !enableDarkTheme) return false;
              return true;
            })}
            value={navTheme!}
            configType="theme"
            key="navTheme"
            onChange={(value) => changeSetting('navTheme', value)}
          />
        </Body>
        {colorList !== false && (
          <Body
            title={formatMessage({
              id: 'app.setting.themecolor',
              defaultMessage: 'Theme color',
            })}
            prefixCls={baseClassName}
          >
            <ThemeColor
              colorList={colorList}
              value={genStringToTheme(primaryColor)!}
              formatMessage={formatMessage}
              onChange={(color) => changeSetting('primaryColor', color)}
            />
          </Body>
        )}
        {!themeOnly && (
          <>
            <Divider />
            <Body
              prefixCls={baseClassName}
              title={formatMessage({ id: 'app.setting.navigationmode' })}
            >
              <BlockCheckbox
                prefixCls={baseClassName}
                value={layout!}
                key="layout"
                configType="layout"
                list={[
                  {
                    key: 'side',
                    title: formatMessage({ id: 'app.setting.sidemenu' }),
                  },
                  {
                    key: 'top',
                    title: formatMessage({ id: 'app.setting.topmenu' }),
                  },
                  {
                    key: 'mix',
                    title: formatMessage({ id: 'app.setting.mixmenu' }),
                  },
                ]}
                onChange={(value) => changeSetting('layout', value)}
              />
            </Body>
            <LayoutSetting settings={settingState} changeSetting={changeSetting} />
            <Divider />

            <Body
              prefixCls={baseClassName}
              title={formatMessage({ id: 'app.setting.regionalsettings' })}
            >
              <RegionalSetting settings={settingState} changeSetting={changeSetting} />
            </Body>

            <Divider />

            <Body
              prefixCls={baseClassName}
              title={formatMessage({ id: 'app.setting.othersettings' })}
            >
              <List
                split={false}
                renderItem={renderLayoutSettingItem}
                dataSource={[
                  {
                    title: formatMessage({ id: 'app.setting.weakmode' }),
                    action: (
                      <Switch
                        size="small"
                        className="color-weak"
                        checked={!!colorWeak}
                        onChange={(checked) => {
                          changeSetting('colorWeak', checked);
                        }}
                      />
                    ),
                  },
                ]}
              />
            </Body>
            {hideHintAlert && hideCopyButton ? null : <Divider />}

            {hideHintAlert ? null : (
              <Alert
                type="warning"
                message={formatMessage({
                  id: 'app.setting.production.hint',
                })}
                icon={<NotificationOutlined />}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {hideCopyButton ? null : (
              <Button
                block
                icon={<CopyOutlined />}
                style={{ marginBottom: 24 }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(genCopySettingJson(settingState));
                    message.success(formatMessage({ id: 'app.setting.copyinfo' }));
                  } catch (error) {
                    // console.log(error);
                  }
                }}
              >
                {formatMessage({ id: 'app.setting.copy' })}
              </Button>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default SettingDrawer;
