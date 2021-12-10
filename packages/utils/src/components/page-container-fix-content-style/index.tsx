import React from 'react';
import { PageContainer, PageContainerProps } from '@ty-one-start/io-component';
import './styles.less';

const PageContainerFixContentStyle: React.FC<PageContainerProps> = (props) => {
  return <PageContainer {...props} />;
};

export { PageContainerFixContentStyle };
