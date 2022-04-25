import React, { useState } from 'react';

import type { MenuDataItem } from '@ty-one-start/frame';
import ProLayout, { PageContainer } from '@ty-one-start/frame';
import { Input } from 'antd';
import complexMenu from './complexMenu';

const filterByMenuDate = (data: MenuDataItem[], keyWord: string): MenuDataItem[] =>
  data
    .map((item) => {
      if (
        (item.name && item.name.includes(keyWord)) ||
        filterByMenuDate(item.routes || [], keyWord).length > 0
      ) {
        return {
          ...item,
          routes: filterByMenuDate(item.routes || [], keyWord),
        };
      }

      return undefined;
    })
    .filter((item) => item) as MenuDataItem[];

export default () => {
  const [keyWord, setKeyWord] = useState('');
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        location={{
          pathname: '/home/overview',
        }}
        menuExtraRender={({ collapsed }) =>
          !collapsed && (
            <Input.Search
              onSearch={(e) => {
                setKeyWord(e);
              }}
            />
          )
        }
        menuDataRender={() => complexMenu}
        postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
      >
        <PageContainer content="欢迎使用">
          <div>Hello World</div>
        </PageContainer>
      </ProLayout>
    </div>
  );
};
