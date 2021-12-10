import { Button, ButtonProps, Popconfirm, Space } from '@ty/antd';
import React, { useState } from 'react';
import ActionTooltip from './action-tooltip';

export type AntdGridTableBaseActionType = {
  key?: string | number;
  text?: string;
  tooltip?: string | React.ReactNode;
  confirmtip?: string | React.ReactNode;
};

export type AntdGridTableAction<Params extends Record<string, any>> = Omit<
  ButtonProps,
  'onClick'
> & {
  onConfirm?: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define
    params: { event: React.MouseEvent } & Params,
  ) => Promise<void>;
  onCancel?: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define
    params: { event: React.MouseEvent } & Params,
  ) => Promise<void>;
  onClick?: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define
    params: { event: React.MouseEvent } & Params,
  ) => Promise<void>;
} & AntdGridTableBaseActionType;

export interface ActionBarProps<Params extends Record<string, any>> {
  actions?: (React.ReactNode | AntdGridTableAction<Params>)[];
  params?: Params;
}

const ActionBar = <Params extends Record<string, any>>(props: ActionBarProps<Params>) => {
  const [actionLoadings, setActionLoadings] = useState<Record<string, boolean>>({});

  return (
    <Space>
      {props.actions?.map((item, index) => {
        if (React.isValidElement(item)) {
          return item;
        }
        const {
          text,
          tooltip,
          confirmtip,
          onConfirm,
          onCancel,
          onClick,
          key = index,
          ...restButtonProps
        } = item as AntdGridTableAction<Params>;

        const wrap = (
          predicate: boolean,
          element: React.ReactElement,
          children: React.ReactElement,
        ) => {
          if (predicate) {
            return React.cloneElement(element, {
              ...element.props,
              children,
            });
          }
          return children;
        };

        const getHandler =
          (
            handle?: (
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              params: {
                event: React.MouseEvent<HTMLElement>;
              } & Params,
            ) => Promise<void>,
          ) =>
          async (event?: React.MouseEvent<HTMLElement>) => {
            if (handle) {
              setActionLoadings((prev) => ({ ...prev, [key]: true }));
              await handle?.({
                event: event as React.MouseEvent<HTMLElement>,
                ...props.params!,
              });
              setActionLoadings((prev) => ({ ...prev, [key]: false }));
            }
          };

        return wrap(
          !!confirmtip,
          <Popconfirm
            title={confirmtip}
            onCancel={getHandler(onCancel)}
            onConfirm={getHandler(onConfirm)}
          ></Popconfirm>,
          wrap(
            !!tooltip,
            <ActionTooltip title={tooltip} isCloseAfterClick={!!confirmtip} />,
            <Button
              loading={actionLoadings[key]}
              {...restButtonProps}
              key={key}
              onClick={getHandler(onClick)}
            >
              {text}
            </Button>,
          ),
        );
      })}
    </Space>
  );
};

export default ActionBar;
