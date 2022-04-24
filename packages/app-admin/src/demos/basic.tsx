/* eslint-disable import/no-extraneous-dependencies */
import Page from '@ty-one-start/app-admin';
import React from 'react';

export default () => {
  return (
    <Page
      breadcrumb={[
        {
          path: '',
          name: '上级页面',
        },
      ]}
    />
  );
};
