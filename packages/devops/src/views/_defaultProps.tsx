import { CrownOutlined } from '@ant-design/icons';
import React from 'react';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/license',
        name: 'license 管理',
        icon: <CrownOutlined />,
        access: 'canAdmin',
        component: './Admin',
      },
      {
        path: '/license-approval',
        name: 'license 审批',
        icon: <CrownOutlined />,
        access: 'canAdmin',
        component: './Admin',
      },
      {
        path: '/user-manage',
        name: '用户管理',
        icon: <CrownOutlined />,
        access: 'canAdmin',
        component: './Admin',
      },
    ],
  },
};
