import {
  ProSchema,
  ProSchemaValueEnumMap,
  ProSchemaValueEnumObj,
} from '@ty-one-start/io-component';
// import { SwapDirectionOptionEnums } from '../typings';

enum SwapEnvEnums {
  /** 交易簿资源 */
  TradingBookResources = 'TradingBookResources',
  /** 持仓资源 */
  PositionResources = 'PositionResources',
  /** 约定浮动利率设置环境 */
  FloatRatesIOItem = 'FloatRatesIOItem',
  /** 观察事件资源 */
  SwapLifeCycleObservation = 'SwapLifeCycleObservation',
  /** 期间收支 */
  SwapLifeCycleInterestPayMent = 'SwapLifeCycleInterestPayMent',
  /** 限制生命周期事件 */
  SwapLifeCycleFreezeSource = 'SwapLifeCycleFreeze',
  /** 解除限制生命周期事件 */
  SwapLifeCycleUnFreezeSource = 'SwapLifeCycleUnFreeze',
  /** 公司行为生命周期事件 */
  SwapLifeCycleCorporateBehavior = 'SwapLifeCycleCorporateBehavior',
  /** 结算生命周期事件 */
  SwapLifeCycleSettleSource = 'SwapLifeCycleSettleSource',
  /** 平仓生命周期事件 */
  SwapLifeCycleUnwindSource = 'SwapLifeCycleUnwind',
  /** 标的估值 */
  SwapUnderlyingInstrumentValuation = 'SwapUnderlyingInstrumentValuation',
  /** 收益互换合约详情 */
  SwapContractDetails = 'SwapContractDetails',
  /** 修改交易要素资源 */
  SwapLifeCycleAmendSources = 'SwapLifeCycleAmendSources',
  /** 修改交易保障金 */
  SwapUpdateMargin = 'SwapUpdateMargin',
  /** 修改初始预付金 */
  SwapUpdateInitialMargin = 'SwapUpdateInitialMargin',

  /** 审批流程资源 */
  ApprovalProcessSources = 'ApprovalProcessSources',
  /** 保障金管理资源 */
  SwapMarginSettingSources = 'SwapMarginSettingSources',
}

enum SwapProductTypeEnums {
  /** 多头互换 */
  BullIndexSwap = 'BULL_INDEX_SWAP',
  /** 空头互换 */
  BearIndexSwap = 'BEAR_INDEX_SWAP',
  /** 基金互换 */
  SingleBullBearIndexSwap = 'SINGLE_BULL_BEAR_INDEX_SWAP',
  /** 多空互换 */
  BullBearIndexSwap = 'BULL_BEAR_INDEX_SWAP',
  /** 框架合约 */
  SimpleBullBearIndexABSwap = 'SIMPLE_BULL_BEAR_INDEX_AB_SWAP',
  /** 指数增强型收益互换 */
  EnhancedIndexSwap = 'ENHANCED_INDEX_SWAP',
  /** 指增互换 */
  InterestEnhancedIndexSwap = 'INTEREST_ENHANCED_INDEX_SWAP',
}

enum ContractStatusEnums {
  Open = 'OPEN',
  /** 部分平仓 */
  PartEarlyTermination = 'PART_EARLY_TERMINATION',
  /** 平仓 */
  EarlyTermination = 'EARLY_TERMINATION',
  /** 到期结算 */
  Termination = 'TERMINATION',
  /** 期间收支 */
  PeriodRatePayment = 'PERIOD_RATE_PAYMENT',
  /** 限制 */
  Restrict = 'RESTRICT',
  /** ("解除限制"), */
  Derestrict = 'DERESTRICT',
  /** ("观察") */
  Fixing = 'FIXING',
  /** ("公司行为") */
  CorporationAction = 'CORPORATION_ACTION',
  /** ("修改交易要素" */
  Modification = 'CORPORATION_ACTION',
}

enum PositionStatusEnums {
  Life = 'LIFE',
  Deaf = 'DEAF',
}

enum ContractCodeStatusEnums {
  Live = 'LIVE',
  Closed = 'CLOSED',
}

const ContractCodeStatusValueEnums = {
  [ContractCodeStatusEnums.Live]: '存续',
  [ContractCodeStatusEnums.Closed]: '了结',
};

const PositionStatusValueEnums = {
  [PositionStatusEnums.Life]: '未了结',
  [PositionStatusEnums.Deaf]: '已了结',
};

const ContractStatusValueEnums = {
  [ContractStatusEnums.Open]: '开仓',
  [ContractStatusEnums.PartEarlyTermination]: '部分平仓',
  [ContractStatusEnums.EarlyTermination]: '平仓',
  [ContractStatusEnums.Termination]: '结算',
  [ContractStatusEnums.PeriodRatePayment]: '期间收支',
  [ContractStatusEnums.Restrict]: '限制',
  [ContractStatusEnums.Derestrict]: '解除限制',
  [ContractStatusEnums.Fixing]: '观察',
  [ContractStatusEnums.CorporationAction]: '公司行为',
  [ContractStatusEnums.Modification]: '修改交易要素',
};

/** 互换类型枚举常量 */
const SwapProductTypeValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [SwapProductTypeEnums.BullIndexSwap]: '多头互换',
  [SwapProductTypeEnums.BearIndexSwap]: '空头互换',
  [SwapProductTypeEnums.BullBearIndexSwap]: '多空互换',
  [SwapProductTypeEnums.SingleBullBearIndexSwap]: '基金互换',
  [SwapProductTypeEnums.EnhancedIndexSwap]: '指数增强型收益互换',
  [SwapProductTypeEnums.InterestEnhancedIndexSwap]: '指增互换',
};

/** 框架合约互换类型枚举 */
const SwapFWProductTypeValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [SwapProductTypeEnums.SimpleBullBearIndexABSwap]: '框架合约',
  BEAR_INDEX_SWAP: '空头互换',
  BULL_INDEX_SWAP: '多头互换',
};

/** 是否为指增值枚举 */
const RefersValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  YES: '是',
  NO: '否',
};

enum ContractDirectionEnums {
  PayEquityReceiveInterest = 'PAY_EQUITY_RECEIVE_INTEREST',
  PayInterestReceiveEquity = 'PAY_INTEREST_RECEIVE_EQUITY',
}
/** 交易方向值枚举 */
const ContractDirectionValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [ContractDirectionEnums.PayEquityReceiveInterest]: '支付权益-收取利率',
  [ContractDirectionEnums.PayInterestReceiveEquity]: '支付利率-收取权益',
};

/** 利率收益支付频率 */
const InterestPayFrequencyValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  QUARTER: '季度',
  MATURITY: '到期',
};

/** 利率收益计息方式枚举 */
const SettlementMethodValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  ONE_END: '含头不含尾',
  BOTH_END: '含头含尾',
};

/** 空头/多头计息基准枚举 */
const SideinterestAccrualReferenceValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  NOTIONAL_AMOUNT: '名义本金',
  MARKET_VALUE: '市值',
  MAX_ONE: '两者孰大',
};

enum EquityDirectionEnums {
  /** 多头 */
  Long = 'LONG',
  /** 空头 */
  Short = 'SHORT',
}

/** 标的方向枚举 */
const EquityDirectionValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [EquityDirectionEnums.Long]: '多头',
  [EquityDirectionEnums.Short]: '空头',
};

const EvaluationQuoteTypeEnums = {
  ClosePrice: 'CLOSE_PRICE',
  SettlePrice: 'SETTLE_PRICE',
  FundNettingPrice: 'FUND_NETTING_PRICE',
};

/** 标的估值价格类型枚举 */
const EvaluationQuoteTypeValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [EvaluationQuoteTypeEnums.ClosePrice]: '收盘价',
  [EvaluationQuoteTypeEnums.SettlePrice]: '结算价',
  [EvaluationQuoteTypeEnums.FundNettingPrice]: '基金净值',
};

enum LCMEventTypeEnums {
  /** 损益结转 */
  TRANSFER_PNL = 'TRANSFER_PNL',
  /** 调仓 */
  TRANSFER_POSITION = 'TRANSFER_POSITION',
  Observe = 'OBSERVE',
  Unwind = 'UNWIND',
  Amend = 'AMEND',
  CorporateBehavior = 'CORPORATE_BEHAVIOR',
  InterestPayment = 'INTEREST_PAYMENT',
  Freeze = 'FREEZE',
  Unfreeze = 'UNFREEZE',
  Settle = 'SETTLE',
  Live = 'LIVE',
  Open = 'OPEN',
  UnwindPartial = 'UNWIND_PARTIAL',
  CorporateBehaviorDividends = 'CORPORATE_BEHAVIOR_DIVIDENDS',
  CorporateBehaviorSendShares = 'CORPORATE_BEHAVIOR_SEND_SHARES',
  CorporateBehaviorSplitShrinkageShares = 'CORPORATE_BEHAVIOR_SPLIT_SHRINKAGE_SHARES',
  CorporateBehaviorIncreaseShares = 'CORPORATE_BEHAVIOR_INCREASE_SHARES',
  DividendsReinvestment = 'DIVIDENDS_REINVESTMENT',
  ExpandSize = 'EXPAND_SIZE',
  InterimPaymentEnhanced = 'INTERIM_PAYMENT_ENHANCED',
  DividendsSettle = 'DIVIDENDS_SETTLE',
}

enum RatesFrequencyTypeEnums {
  Quarter = 'QUARTER',
  Halfyear = 'HALFYEAR',
}

const RatesFrequencyTypeValueEnums = {
  [RatesFrequencyTypeEnums.Quarter]: '季度',
  [RatesFrequencyTypeEnums.Halfyear]: '半年度',
};

enum IsNewTypeEnums {
  Yes = 'YES',
  No = 'No',
}

const IsNewTypeValueEnums = {
  [IsNewTypeEnums.Yes]: '是',
  [IsNewTypeEnums.No]: '否',
};

enum MarginStatusTypeEnums {
  MarginCall = 'MARGIN_CALL',
  Normal = 'NORMAL',
}

const MarginStatusTypeValueEnums = {
  [MarginStatusTypeEnums.MarginCall]: '待追保',
  [MarginStatusTypeEnums.Normal]: '无需追保',
};

enum LongSideMtmReferenceEnums {
  NotionalAmount = 'NOTIONAL_AMOUNT',
  MarketValue = 'MARKET_VALUE',
  MaxOne = 'MAX_ONE',
}

const LongSideMtmReferenceValueMap: ProSchema['valueEnum'] = {
  [LongSideMtmReferenceEnums.NotionalAmount]: '名义本金',
  [LongSideMtmReferenceEnums.MarketValue]: '市值',
  [LongSideMtmReferenceEnums.MaxOne]: '两者孰大',
};

const PeriodCountConventionValueMap: ProSchema['valueEnum'] = {
  ONE_END: '含头不含尾',
  BOTH_END: '含头含尾',
};

enum SwapDirectionOptionEnums {
  PayEquityReceiveInterest = 'PAY_EQUITY_RECEIVE_INTEREST',
  PayInterestReceiveEquity = 'PAY_INTEREST_RECEIVE_EQUITY',
}

const SwapDirectionValueMap: ProSchema['valueEnum'] = {
  [SwapDirectionOptionEnums.PayEquityReceiveInterest]: '支付权益-收取利率',
  [SwapDirectionOptionEnums.PayInterestReceiveEquity]: '支付利率-收取权益',
};

enum LongSideInterestAccrualReferenceOptionEnums {
  NotionalAmount = 'NOTIONAL_AMOUNT',
  MarketValue = 'MARKET_VALUE',
  MaxOne = 'MAX_ONE',
  UserDefined = 'USER_DEFINED',
}

const LongSideInterestAccrualReferenceValueMap: ProSchema['valueEnum'] = {
  [LongSideInterestAccrualReferenceOptionEnums.NotionalAmount]: '名义本金',
  [LongSideInterestAccrualReferenceOptionEnums.MarketValue]: '市值',
  [LongSideInterestAccrualReferenceOptionEnums.MaxOne]: '两者孰大',
};

enum MarginDirectionOptionEnums {
  Receive = 'RECEIVE',
  Pay = 'PAY',
}

const MarginDirectionValueMap: ProSchema['valueEnum'] = {
  [MarginDirectionOptionEnums.Receive]: '我方收取',
  [MarginDirectionOptionEnums.Pay]: '我方支付',
};

enum TemplateTypeValue {
  Personal = 'PERSONAL',
  Public = 'PUBLIC',
}

const TemplateTypeValueEnums = {
  [TemplateTypeValue.Personal]: '个人',
  [TemplateTypeValue.Public]: '公共',
};

const CurrencyValueEnums = {
  CNY: 'CNY',
  USD: 'USD',
  EUR: 'EUR',
  HKD: 'HKD',
  GBP: 'GBP',
};

enum ExchangeRateTypeEnums {
  RateDomestic = 'RATE_DOMESTIC',
  RateCompo = 'RATE_COMPO',
  RateQuanto = 'RATE_QUANTO',
}

const ExchangeRateTypeOptionEnums = {
  [ExchangeRateTypeEnums.RateDomestic]: '境内',
  [ExchangeRateTypeEnums.RateCompo]: 'compo1',
  [ExchangeRateTypeEnums.RateQuanto]: 'quanto',
};

enum RoleValueMap {
  First = 'FIRST_PARTY_ROLE',
  Second = 'SECOND_PARTY_ROLE',
}

const RoleMap = {
  [RoleValueMap.First]: '甲方',
  [RoleValueMap.Second]: '乙方',
};

enum DirectionValueMap {
  Pay = 'PAY',
  Receive = 'RECEIVE',
}

const DirectionMap = {
  [DirectionValueMap.Pay]: '支付',
  [DirectionValueMap.Receive]: '收取',
};

enum ContractTypeEnums {
  NormalContract = 'NORMAL_CONTRACT',
  FrameworkContract = 'FRAMEWORK_CONTRACT',
}

const ContractTypeValueEnums = {
  [ContractTypeEnums.NormalContract]: '一般合约',
  [ContractTypeEnums.FrameworkContract]: '框架合约',
};

enum AttachmentTypeEnums {
  /** 单章 */
  SWAP_SINGLE_SEAL = '互换交易确认书-单章',
  /** 双章 */
  SWAP_DOUBLE_SEAL = '互换交易确认书-双章',
  /** 其他 */
  SWAP_OTHER = '互换交易确认书-其他',
}
const formatType = 'YYYY-MM-DD';

export {
  LongSideInterestAccrualReferenceOptionEnums,
  LongSideInterestAccrualReferenceValueMap,
  SwapDirectionValueMap,
  PeriodCountConventionValueMap,
  EvaluationQuoteTypeEnums,
  LongSideMtmReferenceEnums,
  LongSideMtmReferenceValueMap,
  SwapEnvEnums,
  SwapProductTypeEnums,
  SwapProductTypeValueEnums,
  SwapFWProductTypeValueEnums,
  ContractDirectionEnums,
  ContractDirectionValueEnums,
  RefersValueEnums,
  InterestPayFrequencyValueEnums,
  SettlementMethodValueEnums,
  SideinterestAccrualReferenceValueEnums,
  EquityDirectionValueEnums,
  EquityDirectionEnums,
  EvaluationQuoteTypeValueEnums,
  LCMEventTypeEnums,
  ContractStatusValueEnums,
  PositionStatusValueEnums,
  RatesFrequencyTypeValueEnums,
  RatesFrequencyTypeEnums,
  ContractCodeStatusValueEnums,
  ContractCodeStatusEnums,
  IsNewTypeValueEnums,
  IsNewTypeEnums,
  MarginStatusTypeValueEnums,
  formatType,
  MarginDirectionOptionEnums,
  MarginDirectionValueMap,
  TemplateTypeValue,
  TemplateTypeValueEnums,
  CurrencyValueEnums,
  ExchangeRateTypeEnums,
  ExchangeRateTypeOptionEnums,
  RoleValueMap,
  RoleMap,
  DirectionValueMap,
  DirectionMap,
  ContractTypeEnums,
  ContractTypeValueEnums,
  AttachmentTypeEnums,
};
