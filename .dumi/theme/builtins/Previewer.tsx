import React from 'react';
import LazyLoad from 'react-lazyload';
import PreView, { IPreviewerProps } from 'dumi-theme-default/src/builtins/Previewer';
import { Spin, Skeleton } from 'antd';

export default ({
  children,
  ...rest
}: IPreviewerProps & {
  height: string;
}) => {
  return (
    <LazyLoad
      height={`calc(${rest.height} + 128px)` || 500}
      offset={500}
      placeholder={
        parseInt(rest.height) > 300 ? (
          <div
            className="__dumi-default-previewer"
            style={{
              padding: 24,
              background: 'rgb(245, 245, 245)',
            }}
          >
            <Skeleton />
          </div>
        ) : (
          <div style={{ paddingTop: 100, textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        )
      }
      once
    >
      <PreView {...rest}>
        <div
          style={{
            minHeight: rest.height,
          }}
        >
          {children}
        </div>
      </PreView>
    </LazyLoad>
  );
};
