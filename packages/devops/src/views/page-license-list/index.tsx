import { OSPage, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';
import LicenseTable from './license-table';

export default () => {
  return (
    <OSProviderWrapper>
      <OSPage
        settings={{
          content: <LicenseTable />,
        }}
      />
    </OSProviderWrapper>
  );
};
