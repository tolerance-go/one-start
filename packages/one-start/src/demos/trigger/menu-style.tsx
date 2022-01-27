import { UploadOutlined } from '@ant-design/icons';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import delay from 'delay';
import React, { useState, useRef } from 'react';

export default () => {
  const [settings, setSettings] = useState({
    loop: false,
    disabled: false,
  });

  const timerRef = useRef<NodeJS.Timeout>();

  return (
    <OSProviderWrapper>
      <OSForm
        onValuesChange={(_, values) => {
          if (values.loop) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }

            timerRef.current = setInterval(() => {
              setSettings((prev) => ({ ...prev, disabled: !prev.disabled }));
            }, 2000);
          } else if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          setSettings(values);
        }}
        settings={{
          initialValues: settings,
          fieldItems: [
            {
              type: 'switch',
              settings: {
                dataIndex: 'loop',
                title: '2s 间隔不断 disabled',
              },
            },
          ],
        }}
      />
      <Divider />
      <OSTrigger
        type="dropdown"
        settings={{
          disabled: settings.disabled,
          text: '按钮1',
          plain: true,
          menu: [
            {
              text: 'menu1',
            },
            {
              text: 'menu1',
              tooltip: 'tooltip1',
            },
            {
              text: 'menu1',
              icon: <UploadOutlined />,
            },
            {
              text: 'menu1',
              tooltip: 'tooltip1',
              icon: <UploadOutlined />,
            },
            {
              text: 'menu1',
              disabled: true,
              tooltip: 'tooltip1',
              icon: <UploadOutlined />,
            },
            {
              text: 'menu1',
              danger: true,
              tooltip: 'tooltip1',
              icon: <UploadOutlined />,
            },
            {
              text: 'menu1-disabled-upload',
              disabled: true,
              tooltip: 'tooltip1',
              icon: <UploadOutlined />,
              upload: {
                multiple: true,
                suffixs: ['.xlsx'],
              },
            },
          ],
        }}
        requests={{
          requestAfterClick: async () => {
            await delay(1000);
          },
          requestAfterMenuClick: async () => {
            await delay(1000);
          },
        }}
      ></OSTrigger>
    </OSProviderWrapper>
  );
};
