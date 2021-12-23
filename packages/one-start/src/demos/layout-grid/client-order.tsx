import { OSGrid, OSGridLayout, OSProviderWrapper, OSForm } from '@ty-one-start/one-start';
import Mock, { Random } from 'mockjs';
import { Row, Col } from '@ty/antd';

const Order = () => {
  return (
    <OSProviderWrapper>
      <p>订单管理</p>
      <OSGrid
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
          height: 330,
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

const CannotSecuritiesList = () => {
  return (
    <OSProviderWrapper>
      <p>非可融券列表</p>
      <OSGrid
        settings={{
          searchFormItemChunkSize: 3,
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: '标的物',
                dataIndex: 'instrumentId',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '最新价格',
                dataIndex: 'last',
              },
            },
            {
              type: 'text',
              settings: {
                title: '固定利率',
                dataIndex: 'couponRate',
              },
            },
          ],
          height: 380,
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
                    last: '50',
                    couponRate: '5%',
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

const SecuritiesList = () => {
  return (
    <OSProviderWrapper>
      <p>可融券列表</p>
      <OSGrid
        settings={{
          searchFormItemChunkSize: 3,
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: '标的物',
                dataIndex: 'instrumentId',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: '标的来源',
                dataIndex: 'source',
              },
            },
            {
              type: 'text',
              settings: {
                title: '最新价格',
                dataIndex: 'last',
              },
            },
            {
              type: 'text',
              settings: {
                title: '可融期限',
                dataIndex: 'maxTerm',
              },
            },
            {
              type: 'text',
              settings: {
                title: '固定利率',
                dataIndex: 'couponRate',
              },
            },
          ],
          height: 380,
        }}
        requests={{
          requestDataSource: async () => {
            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    instrumentId: '000012.SZ',
                    last: '50',
                    couponRate: '5%',
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

const ApplyOrder = () => {
  return (
    <OSProviderWrapper>
      <p>新订单</p>
      <div style={{ marginBottom: 10 }}>
        <OSForm
          settings={{
            labelCol: { span: 2 },
            wrapperCol: { span: 3 },

            fieldItems: [
              {
                type: 'date',
                settings: {
                  title: '到期日',
                  dataIndex: '',
                },
              },
            ],
          }}
        />
      </div>
      <OSGrid
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: '标的物',
                dataIndex: 'instrumentId',
              },
            },
            {
              type: 'text',
              settings: {
                title: '最新价格',
                dataIndex: 'last',
              },
            },
            {
              type: 'text',
              settings: {
                title: '固定利率',
                dataIndex: 'couponRate',
              },
            },
          ],
          height: 400,
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

const DataShow = () => {
  return (
    <>
      <p>数据展示</p>
      <Row justify="space-between">
        <Col>可用资金</Col>
        <Col>￥1000000.00</Col>
      </Row>
    </>
  );
};
const ClientOrderDemo = () => {
  return (
    <div style={{ backgroundColor: '#fafafa', padding: 10 }}>
      <OSGridLayout
        settings={{
          type: 'simple',
          layout: [
            {
              i: 'cannotSecuritiesList',
              x: 0,
              y: 0,
              w: 6,
              h: 4,
            },
            {
              i: 'securitiesList',
              x: 7,
              y: 0,
              w: 6,
              h: 4,
            },
            {
              i: 'applyOrder',
              x: 0,
              y: 3,
              w: 9,
              h: 4,
            },
            {
              i: 'order',
              x: 0,
              y: 7,
              w: 9,
              h: 4,
            },
            {
              i: 'dataShow',
              x: 10,
              y: 4,
              w: 3,
              h: 8,
            },
          ],
          margin: [15, 15],
          isBounded: true,
          containerPadding: [10, 10],
          className: 'order',
          useCSSTransforms: true,
          rowHeight: 120,
          components: {
            order: Order(),
            cannotSecuritiesList: CannotSecuritiesList(),
            securitiesList: SecuritiesList(),
            applyOrder: ApplyOrder(),
            dataShow: DataShow(),
          },
        }}
      />
    </div>
  );
};

export default ClientOrderDemo;
