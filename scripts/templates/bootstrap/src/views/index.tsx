import { PageContainer } from '@ty-ant-design/pro-layout';
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

const Page: React.FC<PageProps> = (props) => {
  return (
    <>
      <PageContainer
        ghost
        header={{
          title: '<%= title %>',
          breadcrumb: {
            routes: (
              props.breadcrumb?.map((item) => {
                return {
                  path: item.path ?? '',
                  breadcrumbName: item.name,
                };
              }) ?? []
            ).concat({
              path: '',
              breadcrumbName: '<%= breadcrumbName %>',
            }),
          },
        }}
      ></PageContainer>
    </>
  );
};

export default Page;
