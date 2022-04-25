import { UserInfoModel } from './_models/user-info';
import React from 'react';
import type { Location } from 'umi';
import Content from './content';
import type { MenuDataItem } from '@ty-one-start/frame';

const Layout: React.FC<{
  location: Location;
  route?: { routes?: MenuDataItem[] };
}> = (props) => {
  return (
    <UserInfoModel.Provider>
      <Content location={props.location} route={props.route}>
        {props.children}
      </Content>
    </UserInfoModel.Provider>
  );
};

export default Layout;
