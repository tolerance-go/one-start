import { v4 as uuid } from 'uuid';

export const data = [
  {
    label: '定价簿记',
    value: uuid(),
    children: [
      {
        label: '场外期权-试定价',
        value: '场外期权-试定价',
      },
      {
        label: '场外期权-交易簿记',
        value: '场外期权-交易簿记',
      },
      {
        label: '收益互换-交易簿记',
        value: '收益互换-交易簿记',
      },
    ],
  },
  {
    label: '持仓管理',
    value: uuid(),
    children: [
      {
        label: '场内持仓',
        value: '场内持仓',
      },
      {
        label: '场外期权-交易列表',
        value: '场外期权-交易列表',
      },
      {
        label: '场外期权-生命周期概览',
        value: '场外期权-生命周期概览',
      },
      {
        label: '收益互换-生命周期概览',
        value: '收益互换-生命周期概览',
      },
      {
        label: '收益互换-合约列表',
        value: '收益互换-合约列表',
      },
      {
        label: '收益互换-框架合约列表',
        value: '收益互换-框架合约列表',
      },
      {
        label: '收益互换-框架合约成交流水',
        value: '收益互换-框架合约成交流水',
      },
    ],
  },
  {
    label: '客户管理',
    value: uuid(),
    children: [
      {
        label: '机构信息',
        value: '机构信息',
      },
      {
        label: '客户信息',
        value: '客户信息',
      },
      {
        label: '销售管理',
        value: '销售管理',
      },
      {
        label: '邮箱管理',
        value: '邮箱管理',
      },
      {
        label: '邮箱发送管理',
        value: '邮箱发送管理',
      },
      {
        label: '客户管理配置',
        value: '客户管理配置',
      },
      {
        label: '码表管理',
        value: '码表管理',
      },
      {
        label: '黑名单管理',
        value: '黑名单管理',
      },
      {
        label: '客户回访',
        value: '客户回访',
      },
    ],
  },
  {
    label: '资金/保证金管理',
    value: uuid(),
    children: [
      {
        label: '交易现金流明细',
        value: uuid(),
      },
      {
        label: '财务出入金',
        value: uuid(),
      },
      {
        label: '客户预付金管理',
        value: uuid(),
      },
      {
        label: '授信管理',
        value: uuid(),
      },
      {
        label: '场外期权-保证金参数',
        value: uuid(),
      },
      {
        label: '场外期权-保证金管理',
        value: uuid(),
      },
      {
        label: '收益互换-保证金管理',
        value: uuid(),
      },
      {
        label: '资金管理',
        value: uuid(),
      },
    ],
  },
  {
    label: '日终管理',
    value: uuid(),
    children: [
      {
        label: '场外期权-收盘操作',
        value: uuid(),
      },
      {
        label: '场外期权-分红管理',
        value: uuid(),
      },
      {
        label: '场外期权-敲入管理',
        value: uuid(),
      },
      {
        label: '场外期权-派息管理',
        value: uuid(),
      },
      {
        label: '场外期权-敲出管理',
        value: uuid(),
      },
      {
        label: '场外期权-观察管理',
        value: uuid(),
      },
      {
        label: '场外期权-结算管理',
        value: uuid(),
      },
      {
        label: '收益互换-日终清算',
        value: uuid(),
      },
      {
        label: '收益互换-分红管理',
        value: uuid(),
      },
    ],
  },
  {
    label: '报告中心',
    value: uuid(),
    children: [
      {
        label: '场外期权设置',
        value: uuid(),
        children: [
          {
            label: '场外期权-持仓明细',
            value: uuid(),
          },
          {
            label: '场外期权-自定义估值管理',
            value: uuid(),
          },
          {
            label: '场外期权-同一主体业务监测信息汇总表（一）',
            value: uuid(),
          },
          {
            label: '场外期权-同一主体业务监测信息汇总表（二）',
            value: uuid(),
          },
        ],
      },
      {
        label: '场外期权设置',
        value: uuid(),
        children: [
          {
            label: '收益互换-客户估值报告',
            value: uuid(),
          },
          {
            label: '收益互换-框架合约估值报告',
            value: uuid(),
          },
          {
            label: '收益互换-风控报告',
            value: uuid(),
          },
          {
            label: '收益互换-日终盈亏',
            value: uuid(),
          },
          {
            label: '收益互换-标的估值报告',
            value: uuid(),
          },
          {
            label: '收益互换-合约估值报告',
            value: uuid(),
          },
        ],
      },

      {
        label: '客户估值报告',
        value: uuid(),
      },
      {
        label: '自定义报表',
        value: uuid(),
      },
      {
        label: '报送状态',
        value: uuid(),
      },
      {
        label: '监管报送',
        value: uuid(),
      },
    ],
  },
  {
    label: '市场行情',
    value: uuid(),
    children: [
      {
        label: '行情管理',
        value: uuid(),
      },
      {
        label: '标的物管理',
        value: uuid(),
      },
      {
        label: '涨跌幅管理',
        value: uuid(),
      },
      {
        label: '权益管理',
        value: uuid(),
      },
      {
        label: '货币管理',
        value: uuid(),
      },
      {
        label: '汇率行情',
        value: uuid(),
      },
    ],
  },
  {
    label: '定价配置',
    value: uuid(),
    children: [
      {
        label: '定价分组',
        value: uuid(),
      },
      {
        label: '定价参数',
        value: uuid(),
      },
      {
        label: '定价环境',
        value: uuid(),
      },
      {
        label: '交易日历',
        value: uuid(),
      },
      {
        label: '报告环境管理',
        value: uuid(),
      },
    ],
  },
  {
    label: '系统设置',
    value: uuid(),
    children: [
      {
        label: '场外期权设置',
        value: uuid(),
        children: [
          {
            label: '风控设置',
            value: uuid(),
          },
        ],
      },
      {
        label: '收益互换设置',
        value: uuid(),
        children: [
          {
            label: '估值日与行情获取日配置',
            value: uuid(),
          },
          {
            label: '系统参数设置',
            value: uuid(),
          },
          {
            label: '风控设置',
            value: uuid(),
          },
        ],
      },
      {
        label: '交易簿管理',
        value: uuid(),
      },
      {
        label: '文档模版',
        value: uuid(),
      },
      {
        label: '系统日志',
        value: uuid(),
      },
      {
        label: '部门管理',
        value: uuid(),
      },
      {
        label: '用户权限管理',
        value: uuid(),
      },
      {
        label: '审批流程配置',
        value: uuid(),
      },
      {
        label: '审批组管理',
        value: uuid(),
      },
      {
        label: '自定义字段',
        value: uuid(),
      },
      {
        label: '任务管理',
        value: uuid(),
      },
    ],
  },
];
