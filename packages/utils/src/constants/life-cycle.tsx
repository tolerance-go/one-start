import type { ProSchemaValueEnumMap, ProSchemaValueEnumObj } from '@ty-one-start/io-component';

/** 生命周期类型枚举 */
enum LCMEventTypeOptionEnums {
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
  Open = 'OPEN',
  ExpandSize = 'EXPAND_SIZE',
  UnwindPartial = 'UNWIND_PARTIAL',
  CorporateBehaviorDividends = 'CORPORATE_BEHAVIOR_DIVIDENDS',
  CorporateBehaviorSendShares = 'CORPORATE_BEHAVIOR_SEND_SHARES',
  CorporateBehaviorSplitShrinkageShares = 'CORPORATE_BEHAVIOR_SPLIT_SHRINKAGE_SHARES',
  CorporateBehaviorIncreaseShares = 'CORPORATE_BEHAVIOR_INCREASE_SHARES',
  InterimPaymentEnhanced = 'INTERIM_PAYMENT_ENHANCED',
  DividendsReinvestment = 'DIVIDENDS_REINVESTMENT',
  DividendsSettle = 'DIVIDENDS_SETTLE',
}
/** 生命周期类型枚举 */
const LCMEventTypeValueEnums: ProSchemaValueEnumObj | ProSchemaValueEnumMap = {
  [LCMEventTypeOptionEnums.Open]: '开仓',
  [LCMEventTypeOptionEnums.UnwindPartial]: '部分平仓',
  [LCMEventTypeOptionEnums.Unwind]: '平仓',
  [LCMEventTypeOptionEnums.Settle]: '结算',
  [LCMEventTypeOptionEnums.Observe]: '观察',
  [LCMEventTypeOptionEnums.InterestPayment]: '期间收支',
  [LCMEventTypeOptionEnums.Amend]: '修改交易要素',
  [LCMEventTypeOptionEnums.CorporateBehaviorDividends]: '分红',
  [LCMEventTypeOptionEnums.CorporateBehaviorSendShares]: '转送',
  [LCMEventTypeOptionEnums.CorporateBehaviorSplitShrinkageShares]: '拆股缩股',
  [LCMEventTypeOptionEnums.DividendsReinvestment]: '红利再投资',
  [LCMEventTypeOptionEnums.InterimPaymentEnhanced]: '期间收支(指增)',
  [LCMEventTypeOptionEnums.DividendsSettle]: '分红结算',
};

export { LCMEventTypeOptionEnums, LCMEventTypeValueEnums };
