import React from 'react';

export interface PageProps {
  /**
   * 面包屑导航
   */
  breadcrumb?: {
    path?: string;
    name: string;
  }[];
  /**
   * 页面标题
   */
  title?: string;
}

const Page: React.FC<PageProps> = () => {
  return <></>;
};

export default Page;
