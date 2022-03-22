import { Badge } from '@ty/antd';
import cls from 'classnames';
import React, { useContext, useEffect, useImperativeHandle, useRef } from 'react';
import type {
  OSTriggerAPI,
  OSTriggerButtonAPI,
  OSTriggerButtonType,
  OSTriggerDropdownAPI,
  OSTriggerDropdownType,
  OSTriggerIconAPI,
  OSTriggerIconType,
  OSTriggerType,
} from '../../typings';
import { PrioritizedComponentSizeContext } from '../providers/prioritized-component-size';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import { useClsPrefix } from '../utils/use-cls-prefix';
import OSTriggerButton from './trigger-button';
import OSTriggerDropdown from './trigger-dropdown';
import OSTriggerIcon from './trigger-icon';

const OSTrigger: React.ForwardRefRenderFunction<OSTriggerAPI, OSTriggerType> = (props, ref) => {
  const { type, refKey, ...rest } = props;

  const { badge, badgeWrapperStyle, size, ...resetSettings } = rest.settings ?? {};

  const inlineRef = useRef<OSTriggerAPI>(null);
  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  const clsPrefix = useClsPrefix('os-trigger');

  const pcs = useContext(PrioritizedComponentSizeContext);
  const accSize = size ?? pcs.size;

  const accSettings = {
    ...resetSettings,
    size: accSize,
  };

  useImperativeHandle(ref, () => {
    const apis: OSTriggerAPI = inlineRef.current!;

    return apis;
  });

  useEffect(() => {
    const apis: OSTriggerAPI = inlineRef.current!;
    if (refKey) {
      if (type === 'button') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'triggers.buttons',
            key: refKey,
            apis: apis as OSTriggerButtonAPI,
          },
        });
      }
      if (type === 'dropdown') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'triggers.dropdowns',
            key: refKey,
            apis: apis as OSTriggerDropdownAPI,
          },
        });
      }
    }
  });

  const renderTriggerWrapBadge = (trigger: React.ReactElement) => {
    if (badge) {
      const baseCls = `${clsPrefix}-badge`;
      if (badge.type === 'count') {
        return (
          <Badge
            {...badge.settings}
            className={cls(baseCls, badge.settings?.className, `${baseCls}-count`)}
          >
            {trigger}
          </Badge>
        );
      }
      if (badge.type === 'ribbon') {
        return (
          /** Ribbon 暂时不支持 wrapper style 参数 */
          <div
            style={{
              position: 'relative',
              ...badgeWrapperStyle,
            }}
          >
            <Badge.Ribbon
              {...badge.settings}
              className={cls(baseCls, badge.settings?.className, `${baseCls}-ribbon`)}
            >
              {trigger}
            </Badge.Ribbon>
          </div>
        );
      }
    }
    return trigger;
  };

  const className = badge ? cls('over-badge', `badge-type-${badge.type}`) : undefined;

  if (type === 'button') {
    return renderTriggerWrapBadge(
      <OSTriggerButton ref={inlineRef} {...rest} settings={accSettings} className={className} />,
    );
  }

  if (type === 'dropdown') {
    return renderTriggerWrapBadge(
      <OSTriggerDropdown ref={inlineRef} {...rest} settings={accSettings} className={className} />,
    );
  }

  if (type === 'icon') {
    return renderTriggerWrapBadge(
      <OSTriggerIcon ref={inlineRef} {...rest} settings={accSettings} className={className} />,
    );
  }

  return null;
};

export default React.forwardRef(OSTrigger);

export const TriggerButtonSettings: React.FC<OSTriggerButtonType['settings']> = () => <></>;
export const TriggerButtonAPI: React.FC<OSTriggerButtonAPI> = () => <></>;
export const TriggerButtonRequests: React.FC<OSTriggerButtonType['requests']> = () => <></>;

export const TriggerDropdownSettings: React.FC<OSTriggerDropdownType['settings']> = () => <></>;
export const TriggerDropdownAPI: React.FC<OSTriggerDropdownAPI> = () => <></>;
export const TriggerDropdownRequests: React.FC<OSTriggerDropdownType['requests']> = () => <></>;

export const TriggerIconSettings: React.FC<OSTriggerIconType['settings']> = () => <></>;
export const TriggerIconAPI: React.FC<OSTriggerIconAPI> = () => <></>;
export const TriggerIconRequests: React.FC<OSTriggerIconType['requests']> = () => <></>;
