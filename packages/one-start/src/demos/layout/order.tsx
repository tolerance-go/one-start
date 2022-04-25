import { OSTable, OSLayout, OSProviderWrapper } from '@ty-one-start/one-start';
import Mock, { Random } from 'mockjs';

const Order = () => {
  return (
    <OSProviderWrapper>
      <p>订单</p>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: '订单编号',
                dataIndex: 'id',
                search: true,
                sorter: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '发起时间',
                dataIndex: 'applyTime',
                sorter: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '客户名称',
                dataIndex: 'customerName',
                search: true,
                sorter: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '互换类型',
                dataIndex: 'swapType',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '订单类型',
                dataIndex: 'orderType',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '标的物',
                dataIndex: 'instrumentId',
                search: true,
              },
            },
          ],
          tableHeight: 380,
        }}
        requests={{
          requestDataSource: async () => {
            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    applyTime: () => Random.datetime(),
                    customerName: Random.word(),
                    swapType: '多头',
                    orderType: '开仓',
                    instrumentId: '000012.SZ',
                  },
                ],
                total: 20,
              },
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};

const Position = () => {
  return (
    <OSProviderWrapper>
      <p>持仓</p>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: '合约编号',
                dataIndex: 'id',
                search: true,
                sorter: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '客户名称',
                dataIndex: 'customerName',
                search: true,
                sorter: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '互换类型',
                dataIndex: 'swapType',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '起始日',
                dataIndex: 'startDate',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '到期日',
                dataIndex: 'endDate',
                search: true,
              },
            },
          ],
          tableHeight: 380,
        }}
        requests={{
          requestDataSource: async () => {
            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    startDate: () => Random.date(),
                    endDate: () => Random.date(),
                    customerName: Random.word(),
                    swapType: '多头',
                  },
                ],
                total: 20,
              },
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};

const Demo = () => {
  return (
    <div style={{ backgroundColor: '#fafafa', padding: 10 }}>
      <OSLayout
        settings={{
          type: 'simple',
          layout: [
            {
              i: 'order',
              x: 0,
              y: 0,
              w: 10,
              h: 9,
              minH: 9,
            },
            {
              i: 'position',
              x: 0,
              y: 10,
              w: 10,
              h: 9,
              minH: 9,
            },
          ],
          margin: [15, 15],
          isBounded: true,
          containerPadding: [10, 10],
          className: 'order',
          useCSSTransforms: true,
          components: {
            order: Order(),
            position: Position(),
          },
        }}
      />
    </div>
  );
};

export default Demo;
