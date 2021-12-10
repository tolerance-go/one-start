import type { ProSchema } from '@ty-one-start/io-component';
import { BusinessTypeOptionEnums, EndDateTypeOptionEnums } from '../typings';
import { exchangeRatePrecision, mktQuotesPrecision } from './constants';
import { SwapFieldNameEnums } from './fields';
import { LCMEventTypeValueEnums } from './life-cycle';
import {
  ContractCodeStatusValueEnums,
  ContractTypeValueEnums,
  DirectionMap,
  EquityDirectionValueEnums,
  EvaluationQuoteTypeValueEnums,
  ExchangeRateTypeOptionEnums,
  LongSideInterestAccrualReferenceValueMap,
  LongSideMtmReferenceValueMap,
  MarginDirectionValueMap,
  PeriodCountConventionValueMap,
  RatesFrequencyTypeValueEnums,
  RoleMap,
  SwapDirectionValueMap,
  SwapProductTypeValueEnums,
} from './swap';

const SwapFieldValueTypeEnums: {
  [x: string]: {
    valueType: ProSchema['valueType'];
    valueEnum?: ProSchema['valueEnum'];
    extraProps?: { [x: string]: any };
    render?: {
      currency?: string;
      precision?: number;
    };
  };
} = {
  [SwapFieldNameEnums.TableAction]: {
    valueType: 'option',
  },
  [SwapFieldNameEnums.TargetInfo]: {
    valueType: 'targetInfo' as any,
  },
  [SwapFieldNameEnums.CounterPartyName]: {
    valueType: 'select',
  },
  [SwapFieldNameEnums.MasterAgreementId]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.BookName]: {
    valueType: 'select',
  },
  [SwapFieldNameEnums.ContractCode]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.TradeConfirmId]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.SwapProductType]: {
    valueType: 'select',
    valueEnum: SwapProductTypeValueEnums,
  },
  [SwapFieldNameEnums.TradeDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.EffectiveDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.SettlementDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.ExpirationDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.InterestPayFrequency]: {
    valueType: 'select',
    valueEnum: {
      QUARTER: '季度',
      MATURITY: '到期',
    },
  },
  [SwapFieldNameEnums.DaysInYear]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.BaseRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.ShortSideInitialMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideFixRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideFloatIndex]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.UnderlyingInstrumentId]: {
    valueType: 'select',
  },
  [SwapFieldNameEnums.ConversionRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.EquityDirection]: {
    valueType: 'select',
    valueEnum: EquityDirectionValueEnums,
  },
  [SwapFieldNameEnums.CostSpot]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.InitSpot]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.InitAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.Multiplier]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.EvaluationQuoteType]: {
    valueType: 'select',
    valueEnum: EvaluationQuoteTypeValueEnums,
  },
  [SwapFieldNameEnums.InitNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.LongSideFixRate]: {
    valueType: 'longsideFixRate' as any,
  },
  [SwapFieldNameEnums.FixingDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.Rate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideInitialMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.ShortSideInitialMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideMaintenanceMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.ShortSideMaintenanceMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.AdditionalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.AdditionalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideMtmReference]: {
    valueType: 'select',
    valueEnum: LongSideMtmReferenceValueMap,
  },
  [SwapFieldNameEnums.ShortSideMtmReference]: {
    valueType: 'select',
    valueEnum: LongSideMtmReferenceValueMap,
  },
  [SwapFieldNameEnums.ActiveDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.DurabilityDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.DurabilityDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.FixRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.FloatIndex]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.FloatRates]: {
    valueType: 'floatRates' as any,
  },
  [SwapFieldNameEnums.EnhanceRates]: {
    valueType: 'enhanceRates' as any,
  },
  [SwapFieldNameEnums.ContractNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.BeforeWithdrawalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.BeforeWithdrawalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.AfterWithdrawalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.AfterWithdrawalMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.NotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.PeriodCountConvention]: {
    valueType: 'select',
    valueEnum: PeriodCountConventionValueMap,
  },
  [SwapFieldNameEnums.SwapDirection]: {
    valueType: 'select',
    valueEnum: SwapDirectionValueMap,
  },
  [SwapFieldNameEnums.StartDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.EndDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.PaymentDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.Comment]: {
    valueType: 'textarea',
  },
  [SwapFieldNameEnums.ContractStatus]: {
    valueType: 'select',
    valueEnum: ContractCodeStatusValueEnums,
  },
  [SwapFieldNameEnums.AvailableDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.FreezeNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.UnfreezeNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.LongSideLimitNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.Dividends]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.TargetAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.TotalAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.SettleAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.SettlePrice]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.EquityIncome]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.RealizeUnitDividends]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.RealizeDividends]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.TotalEquityIncome]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.TotalRealizeDividends]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.TotalInterestIncome]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.Cashflow]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.UnwindDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.UnwindAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.UnwindPrice]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.LongNominalPrincipalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.LongSideLimitRates]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.Amount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.LongSideInterestAccrualReference]: {
    valueType: 'select',
    valueEnum: LongSideInterestAccrualReferenceValueMap,
  },
  [SwapFieldNameEnums.ShortSideInterestAccrualReference]: {
    valueType: 'select',
    valueEnum: LongSideInterestAccrualReferenceValueMap,
  },
  [SwapFieldNameEnums.InitContractNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.LongShort]: {
    valueType: 'select',
    valueEnum: {
      LONG: '多头',
      SHORT: '空头',
    },
  },
  [SwapFieldNameEnums.UserName]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.EventType]: {
    valueType: 'select',
    valueEnum: LCMEventTypeValueEnums,
  },
  [SwapFieldNameEnums.Interval]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.RatesFrequency]: {
    valueType: 'select',
    valueEnum: RatesFrequencyTypeValueEnums,
  },
  [SwapFieldNameEnums.InterestIncomeDeadLine]: {
    valueType: 'select',
    valueEnum: EndDateTypeOptionEnums,
  },
  [SwapFieldNameEnums.ValuationDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.EvaluatePrice]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.AccumulateSettleAmount]: {
    valueType: 'digit',
  },
  [SwapFieldNameEnums.CurrentNotionalAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.MarketValue]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
      precision: mktQuotesPrecision,
    },
  },
  [SwapFieldNameEnums.NewlyRealizedCashFlow]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.EnhanceIndexIncome]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.UnrealizedCashFlow]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.AgreedInterestRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.AccrualReference]: {
    valueType: 'select',
    valueEnum: LongSideInterestAccrualReferenceValueMap,
  },
  [SwapFieldNameEnums.EnhancedPayFrequency]: {
    valueType: 'select',
    valueEnum: {
      QUARTER: '期间',
      MATURITY: '到期',
    },
  },
  [SwapFieldNameEnums.EnhancedPeriodCountConvention]: {
    valueType: 'select',
    valueEnum: {
      ONE_END: '含头不含尾',
      BOTH_END: '含头含尾',
    },
  },
  [SwapFieldNameEnums.EnhancedIncomeDeadLine]: {
    valueType: 'select',
    valueEnum: EndDateTypeOptionEnums,
  },
  [SwapFieldNameEnums.AccrualAmount]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.DailyInterestIncome]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.TradingCurrency,
    },
  },
  [SwapFieldNameEnums.ErrorMessage]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.ExecuteDateTime]: {
    valueType: 'dateTime',
  },
  [SwapFieldNameEnums.IsNew]: {
    valueType: 'select',
  },
  [SwapFieldNameEnums.Revert]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.ExecDate]: {
    valueType: 'date',
  },
  [SwapFieldNameEnums.ExecUser]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.LcmEventType]: {
    valueType: 'select',
    valueEnum: LCMEventTypeValueEnums,
  },
  [SwapFieldNameEnums.FieldName]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.ProductType]: {
    valueType: 'select',
    valueEnum: SwapProductTypeValueEnums,
  },
  [SwapFieldNameEnums.EquityProfitDirection]: {
    valueType: 'select',
    valueEnum: {
      PAY: '支付',
      RECEIVE: '收取',
    },
  },
  [SwapFieldNameEnums.InterestProfitDirection]: {
    valueType: 'select',
    valueEnum: {
      PAY: '支付',
      RECEIVE: '收取',
    },
  },
  [SwapFieldNameEnums.Enhanced]: {
    valueType: 'select',
    valueEnum: new Map<any, string>([
      [true, '是'],
      [false, '否'],
    ]),
  },
  [SwapFieldNameEnums.ContractInitialMarginAmount]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.SettleCurrency,
    },
  },
  [SwapFieldNameEnums.MarginDirection]: {
    valueType: 'select',
    valueEnum: MarginDirectionValueMap,
  },
  [SwapFieldNameEnums.LongSideInitialPrepaymentRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.ShortSideInitialPrepaymentRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.BusinessType]: {
    valueType: 'select',
    valueEnum: BusinessTypeOptionEnums,
  },
  [SwapFieldNameEnums.TradingCurrency]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.SettleCurrency]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.InitExchangeRate]: {
    valueType: 'digit',
    render: {
      precision: exchangeRatePrecision,
    },
  },
  [SwapFieldNameEnums.ReferenceExchangeRate]: {
    valueType: 'text',
  },
  [SwapFieldNameEnums.ExchangeRateType]: {
    valueType: 'select',
    valueEnum: ExchangeRateTypeOptionEnums,
  },
  [SwapFieldNameEnums.SwapRole]: {
    valueType: 'select',
    valueEnum: RoleMap,
  },
  [SwapFieldNameEnums.SwapEquityDirection]: {
    valueType: 'select',
    valueEnum: DirectionMap,
  },
  [SwapFieldNameEnums.SwapInterestDirection]: {
    valueType: 'select',
    valueEnum: DirectionMap,
  },
  /** 合约类型 */
  [SwapFieldNameEnums.ContractType]: {
    valueType: 'select',
    valueEnum: ContractTypeValueEnums,
  },
  /** 框架合约编号 */
  [SwapFieldNameEnums.FwContractCode]: {
    valueType: 'text',
  },
  /** 合约固定收益率 */
  [SwapFieldNameEnums.ContractFixRate]: {
    valueType: 'percent-raw' as any,
  },
  /** 合约估值调整项 */
  [SwapFieldNameEnums.ContractValueAdj]: {
    valueType: 'money',
    render: {
      currency: SwapFieldNameEnums.SettleCurrency,
    },
  },
  /** 盯市基准 */
  [SwapFieldNameEnums.MtmReference]: {
    valueType: 'select',
    valueEnum: LongSideMtmReferenceValueMap,
  },
  /** 初始保障比例参数 */
  [SwapFieldNameEnums.InitialMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  /** 维持保障比例参数 */
  [SwapFieldNameEnums.MaintenanceMarginRatio]: {
    valueType: 'percent-raw' as any,
  },
  /** 初始预付金率 */
  [SwapFieldNameEnums.InitialPrepaymentRate]: {
    valueType: 'percent-raw' as any,
  },
  /** 锁定期 */
  [SwapFieldNameEnums.LockupPeriod]: {
    valueType: 'digit',
  },
  /** 期限 */
  [SwapFieldNameEnums.Term]: {
    valueType: 'digit',
  },
  /** 参与率 */
  [SwapFieldNameEnums.ParticipationRate]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.UnwindLine]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.LongSideUnwindLine]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.ShortSideUnwindLine]: {
    valueType: 'percent-raw' as any,
  },
  [SwapFieldNameEnums.UnwindRate]: {
    valueType: 'percent-raw' as any,
  },
};

export { SwapFieldValueTypeEnums };
