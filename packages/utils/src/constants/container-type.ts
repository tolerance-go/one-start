// import type { Moment } from 'moment';
import type { SwapFieldNameEnums } from './fields';
import type { ContractCodeStatusEnums, SwapProductTypeEnums } from './swap';

type SwapPositionTypes = {
  parentContractCode?: string;
  [SwapFieldNameEnums.ContractCode]?: string;
  [SwapFieldNameEnums.BookName]?: string;
  [SwapFieldNameEnums.SwapDirection]?: string;
  [SwapFieldNameEnums.SwapProductType]?: SwapProductTypeEnums;
  [SwapFieldNameEnums.TradeDate]?: string;
  [SwapFieldNameEnums.EffectiveDate]?: string;
  [SwapFieldNameEnums.ExpirationDate]?: string;
  [SwapFieldNameEnums.SettlementDate]?: string;
  [SwapFieldNameEnums.ContractStatus]?: ContractCodeStatusEnums;
  [SwapFieldNameEnums.PositionStatus]?: string;
  [SwapFieldNameEnums.CounterPartyName]?: string;
  [SwapFieldNameEnums.Sale]?: string;
  [SwapFieldNameEnums.TradeConfirmId]?: string | number;
  counterPartyId?: string;
  swapEquityDirection: 'PAY' | 'RECEIVE';
  swapInterestDirection: 'PAY' | 'RECEIVE';
  tradingCurrency: string;
  settleCurrency: string;
  contractType: 'FRAMEWORK_CONTRACT' | 'NORMAL_CONTRACT' | 'FRAMEWORK_CONTRACT_FIFO';
  order?: 'DESC' | 'ASC';
  orderBy?: string;
  interestPayFrequency: string;
  productType: string;
};

/** 结算详情数据 */
type SettlementModalVCTypes = {
  contractCode: string;
  swapDirection: string;
  settlementDate: string;
  settlementTargetInfo: {
    [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
    [SwapFieldNameEnums.SettleAmount]: number;
    [SwapFieldNameEnums.SettlePrice]: number;
    [SwapFieldNameEnums.RealizeUnitDividends]: number;
    [SwapFieldNameEnums.RealizeDividends]: number;
    [SwapFieldNameEnums.EquityIncome]: number;
  }[];
  [SwapFieldNameEnums.TotalRealizeDividends]: number;
  [SwapFieldNameEnums.TotalEquityIncome]: number;
  [SwapFieldNameEnums.TotalInterestIncome]: number;
  [SwapFieldNameEnums.Cashflow]: number;
  [SwapFieldNameEnums.PaymentDate]: string;
  [SwapFieldNameEnums.Comment]: string;
};

/** 平仓详情数据 */
interface UnwindModalVCTypes {
  [SwapFieldNameEnums.SwapDirection]: string;
  [SwapFieldNameEnums.UnwindDate]: string;
  [SwapFieldNameEnums.SettlementTargetInfo]: {
    [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
    [SwapFieldNameEnums.UnwindAmount]: number;
    [SwapFieldNameEnums.UnwindPrice]: number;
    [SwapFieldNameEnums.RealizeUnitDividends]: number;
    [SwapFieldNameEnums.RealizeDividends]: number;
    [SwapFieldNameEnums.EquityIncome]: number;
  }[];
  [SwapFieldNameEnums.TotalRealizeDividends]: number;
  [SwapFieldNameEnums.TotalEquityIncome]: number;
  [SwapFieldNameEnums.TotalInterestIncome]: number;
  [SwapFieldNameEnums.Cashflow]: number;
  [SwapFieldNameEnums.PaymentDate]: string;
  [SwapFieldNameEnums.Comment]: string;
}

/** 期间付息详情数据 */
interface InterestPaymentModalVCTypes {
  [SwapFieldNameEnums.StartDate]: string;
  [SwapFieldNameEnums.EndDate]: string;
  [SwapFieldNameEnums.Cashflow]: number;
  [SwapFieldNameEnums.PaymentDate]: string;
  [SwapFieldNameEnums.Comment]: string;
}

/** 公司行为详情数据  */
type CorporateBehaviorModalVCTypes = {
  [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
  [SwapFieldNameEnums.AvailableDate]: string;
  [SwapFieldNameEnums.Dividends]: number;
  [SwapFieldNameEnums.TargetAmount]: number;
  [SwapFieldNameEnums.TotalAmount]: number;
  [SwapFieldNameEnums.Comment]: string;
}[];

/** 多头指增 观察详情数据 */
type ObserveLongIncreaseModalVCTypes = {
  [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
  [SwapFieldNameEnums.EnhanceRates]: {
    [SwapFieldNameEnums.FixingDate]: string;
    [SwapFieldNameEnums.ActiveDate]: string;
    [SwapFieldNameEnums.DurabilityDate]: string;
    [SwapFieldNameEnums.Rate]: number;
  }[];
  [SwapFieldNameEnums.Comment]: string;
};

/** 多头非指增 观察详情数据 */
type ObserveLongUnModalVCTypes = {
  [SwapFieldNameEnums.LongSideFloatIndex]: string;
  [SwapFieldNameEnums.LongSideFloatRates]: {
    [SwapFieldNameEnums.FixingDate]: string;
    [SwapFieldNameEnums.ActiveDate]: string;
    [SwapFieldNameEnums.DurabilityDate]: string;
    [SwapFieldNameEnums.Rate]: number;
  }[];
  [SwapFieldNameEnums.Comment]: string;
};

/** 空头 观察详情数据 */
interface ObserveShortModalVCTypes {
  [SwapFieldNameEnums.TargetInfo]: {
    [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
    [SwapFieldNameEnums.EquityDirection]: string;
    [SwapFieldNameEnums.FixRate]: string;
    [SwapFieldNameEnums.FloatIndex]: string;
    [SwapFieldNameEnums.FloatRates]: {
      [SwapFieldNameEnums.FixingDate]: string;
      [SwapFieldNameEnums.ActiveDate]: string;
      [SwapFieldNameEnums.DurabilityDate]: string;
      [SwapFieldNameEnums.Rate]: number;
    }[];
  }[];
  [SwapFieldNameEnums.Comment]: string;
}

/** 多空 观察详情 */
interface ObserveBearIndexSwapModalVCTypes {
  [SwapFieldNameEnums.LongSideFloatIndex]: string;
  [SwapFieldNameEnums.LongSideFloatRates]: {
    [SwapFieldNameEnums.FixingDate]: string;
    [SwapFieldNameEnums.ActiveDate]: string;
    [SwapFieldNameEnums.DurabilityDate]: string;
    [SwapFieldNameEnums.Rate]: number;
  }[];
  [SwapFieldNameEnums.TargetInfo]: {
    [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
    [SwapFieldNameEnums.EquityDirection]: string;
    [SwapFieldNameEnums.FixRate]: string;
    [SwapFieldNameEnums.FloatIndex]: string;
    [SwapFieldNameEnums.FloatRates]: {
      [SwapFieldNameEnums.FixingDate]: string;
      [SwapFieldNameEnums.ActiveDate]: string;
      [SwapFieldNameEnums.DurabilityDate]: string;
      [SwapFieldNameEnums.Rate]: number;
    }[];
  }[];
  [SwapFieldNameEnums.Comment]: string;
}

/** 框架合约观察生命周期 */
interface ObserveSingleBullModalVCTypes {
  [SwapFieldNameEnums.TargetInfo]: {
    [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
    [SwapFieldNameEnums.EquityDirection]: string;
    [SwapFieldNameEnums.FixRate]: string;
    [SwapFieldNameEnums.FloatIndex]: string;
    [SwapFieldNameEnums.FloatRates]: {
      [SwapFieldNameEnums.FixingDate]: string;
      [SwapFieldNameEnums.ActiveDate]: string;
      [SwapFieldNameEnums.DurabilityDate]: string;
      [SwapFieldNameEnums.Rate]: number;
    }[];
  }[];
  [SwapFieldNameEnums.Comment]: string;
}
interface SwapUnderlyingInstrumentValuationTypes {
  [SwapFieldNameEnums.ValuationDate]?: string[];
  [SwapFieldNameEnums.IsNew]?: string;
  [SwapFieldNameEnums.BookName]?: string;
  [SwapFieldNameEnums.ContractCode]?: string[];
  [SwapFieldNameEnums.TradeConfirmId]?: string;
  [SwapFieldNameEnums.UnderlyingInstrumentId]?: string;
  [SwapFieldNameEnums.LongShort]?: string;
  [SwapFieldNameEnums.ContractStatus]?: string;
}

interface SwapContractDetailsTypes {
  [SwapFieldNameEnums.ValuationDate]?: string[];
  [SwapFieldNameEnums.IsNew]?: string;
  [SwapFieldNameEnums.BookName]?: string;
  [SwapFieldNameEnums.ContractCode]?: string[];
  [SwapFieldNameEnums.TradeConfirmId]?: string;
  [SwapFieldNameEnums.CounterPartyName]?: string;
  [SwapFieldNameEnums.SwapProductType]?: string;
  [SwapFieldNameEnums.SwapDirection]?: string;
  [SwapFieldNameEnums.EffectiveDate]?: string[];
  [SwapFieldNameEnums.ExpirationDate]?: string[];
  [SwapFieldNameEnums.ContractStatus]?: string;
}

/** 修改生命周期详情数据 */
type AmendModalTableVCTypes = {
  [SwapFieldNameEnums.FieldName]: string;
  [SwapFieldNameEnums.OldValue]: string;
  [SwapFieldNameEnums.NewValue]: string;
  children?: AmendModalTableVCTypes;
}[];

interface AmendModalVCTypes {
  [SwapFieldNameEnums.DiffTable]: AmendModalTableVCTypes;
  [SwapFieldNameEnums.Comment]: string;
}

interface SwapMarginSettingContractTypes {
  [SwapFieldNameEnums.ValuationDate]?: string;
  [SwapFieldNameEnums.IsNew]?: string;
  [SwapFieldNameEnums.CounterPartyName]?: string;
}

export type {
  SwapPositionTypes,
  SettlementModalVCTypes,
  UnwindModalVCTypes,
  InterestPaymentModalVCTypes,
  CorporateBehaviorModalVCTypes,
  ObserveLongIncreaseModalVCTypes,
  ObserveLongUnModalVCTypes,
  ObserveShortModalVCTypes,
  ObserveBearIndexSwapModalVCTypes,
  ObserveSingleBullModalVCTypes,
  SwapUnderlyingInstrumentValuationTypes,
  AmendModalTableVCTypes,
  AmendModalVCTypes,
  SwapContractDetailsTypes,
  SwapMarginSettingContractTypes,
};
