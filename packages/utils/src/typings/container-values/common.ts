import type {
  SwapLifeCycleObservationLongEnhancedCViewModel,
  SwapLifeCycleObservationLongUnEnhancedCViewModel,
  SwapLifeCycleObservationBearIndexSwapCViewModel,
  SwapLifeCycleObservationBullBearIndexSwapCViewModel,
  SwapLifeCycleObservationSingleBullBearIndexSwapCViewModel,
} from './life-cycle';
import { EquityDirectionEnums, SwapFieldNameEnums, SwapProductTypeEnums } from '../../constants';

/**
 * @description 标的信息类型
 * @author 高枫
 * @date 2021/01/11
 * @interface TargetInfo
 */
interface TargetInfo {
  id: string;
  index: number;
  underlyingInstrumentId: string;
  equityDirection: string; // longShort
  initSpot: number;
  initAmount: number; // initAmount
  multiplier: number;
  evaluationQuoteType: string;
  fixRate?: number;
  floatIndex?: string;
  initNotionalAmount: number;
  floatRates?: {
    floatRatesTable: FloatRatesTable[];
  };
  enhanceRates?: {
    floatRatesTable: FloatRatesTable[];
  };
}
/**
 * @description 多头约定浮动利率/约定浮动利率/增强收益率 类型
 * @author 高枫
 * @date 2021/01/11
 * @interface FloatRatesTable
 */
interface FloatRatesTable {
  id: string;
  index: number;
  fixingDate: string;
  activeDate: string;
  durabilityDate: string;
  rate: number;
}

interface DirInfo {
  id: React.Key;
  title: string;
  swapEquityDirection?: string;
  swapInterestDirection?: string;
  swapRole?: string;
}

/**
 * @description 互换簿记类型
 * @author 高枫
 * @date 2021/01/11
 * @interface TradeCRUDViewModel
 */
interface TradeCRUDViewModel {
  swapProductType: string;
  interestIncomeDeadLine: string;
  enhancedIncomeDeadLine?: string;
  accrualReference?: string;
  irAccRefExp?: string;
  targetInfo: TargetInfo[];
  dirInfo: DirInfo[];
  contractCode: string;
  bookName: string;
  tradeConfirmId?: string;
  counterPartyName: string;
  masterAgreementId?: string;
  capitalAccountId?: string;
  calendarId?: string[];
  conversionRate: number;
  contractNotionalAmount?: number;
  initNotionalAmount?: number;
  tradeDate: string;
  effectiveDate: string;
  expirationDate: string;
  settlementDate: string;
  interestPayFrequency: string;
  enhancedPayFrequency?: string;
  periodCountConvention: string;
  enhancedPeriodCountConvention?: string;
  daysInYear: number;
  baseRate?: number;
  longSideinterestAccrualReference?: string;
  shortSideInterestAccrualReference?: string;
  longSideIrAccRefExp?: string;
  shortSideIrAccRefExp?: string;
  longSideFloatRates: {
    floatRatesTable: FloatRatesTable[];
  };
  longSideMtmReference?: string;
  longSideInitialMarginRatio?: number;
  longSideMaintenanceMarginRatio?: number;
  longSideAdditionalMarginRatio?: number;
  longSideBeforeWithdrawalMarginRatio?: number;
  longSideAfterWithdrawalMarginRatio?: number;
  shortSideMtmReference?: string;
  shortSideInitialMarginRatio?: number;
  shortSideMaintenanceMarginRatio?: number;
  shortSideAdditionalMarginRatio?: number;
  shortSideBeforeWithdrawalMarginRatio?: number;
  shortSideAfterWithdrawalMarginRatio?: number;
  longSideFixRate?: number;
  longSideFloatIndex?: number;
  contractInitialMarginAmount?: number;
  businessType: string;
  initialMarginPaymentDate: string;
  tradingCurrency: string;
  settleCurrency: string;
  initExchangeRate: number;
  referenceExchangeRate?: string;
  exchangeRateType?: string;
  term?: number;
  reservedField?: string;
  participationRate?: number;
  unwindRate?: number;
}

/**
 * @description 生命周期标的信息
 * @author 高枫
 * @date 2021/01/13
 * @interface LifeCycleTargetInfo
 */
interface LifeCycleTargetInfo {
  id: string;
  underlyingInstrumentId: string;
  unwindPrice?: number;
  unwindAmount?: number;
  afterUnwindAmount?: number;
  settlePrice?: number;
  settleAmount?: number;
  equityIncome: number;
  multiplier: number;
  realizeUnitDividends: number;
  realizeDividends: number;
  interestIncome: number;
  equityIncomeEnhance?: number;
}

interface UnwindLifeCycleViewModel {
  contractCode: string;
  cashFlow?: number;
  paymentDate?: string;
  contractBaseInterestIncome: number;
  totalEquityIncome?: number;
  totalRealizeDividends?: number;
  totalInterestIncome?: number;
  ContractNotionalAmount?: number;
  ContractSettleNotionalAmount?: number;
  ContractAfterUnwindNotionalAmount?: number;
  ContractEquityIncomeFloat?: number;
  ContractEquityIncomeEnhance?: number;
  paymentMethod: PaymentMethodOptionEnums;
  unwindDate: string;
  targetInfo?: LifeCycleTargetInfo[];
  comment?: string;
  tradingCurrency: string;
  settleCurrency: string;
  initExchangeRate?: number;
  settleExchangeRate?: number;
  settleCurrencyTotalEquityIncome: number;
  settleCurrencyTotalInterestIncome: number;
}
interface SettleLifeCycleViewModel {
  swapDirection: string;
  settlementDate: string;
  cashFlow?: number;
  paymentDate?: string;
  totalEquityIncome?: number;
  totalRealizeDividends?: number;
  totalInterestIncome?: number;
  contractBaseInterestIncome: number;
  contractSettleNotionalAmount: number;
  paymentMethod: PaymentMethodOptionEnums;
  targetInfo?: LifeCycleTargetInfo[];
  comment?: string;
}

interface UnwindData {
  swapDirection: string;
  targetInfo: {
    id: string;
    underlyingInstrumentId: string;
    multiplier: number;
    unwindAmount?: number;
  }[];
}
interface ContractCodeItem {
  targetAmount: number;
  underlyingInstrumentId: string;
  multiplier: number;
}

/** 期间付息 提交数据类型 */
interface InterestPaymentLifeCycleViewModel {
  contractCode: string;
  startDate: string;
  endDate: string;
  swapEquityDirection: string;
  swapInterestDirection: string;
  tradingCurrency: string;
  settleCurrency: string;
  initExchangeRate: number;
  settleExchangeRate: number;
  targetInfo: {
    id: string;
    underlyingInstrumentId: string;
    interestIncome: number;
    longShort: string;
    allUnwind: boolean;
  }[];
  paymentMethod: PaymentMethodOptionEnums;
  contractBaseInterestIncome: number;
  totalInterestIncome: number;
  paymentDate: string;
  comment?: string;
  enhancedDirection: string;
  lcmEventType: string;
  type: string;
  totalEnhancedIncome: number;
  settleCurrencyTotalEnhancedIncome: number;
}

export interface enhancedInterestPaymentViewModel {
  contractCode: string;
  startDate: string;
  endDate: string;
  enhancedDirection: string;
  totalInterestIncome: number;
  initExchangeRate: number;
  settleExchangeRate: number;
  settleCurrencyTotalInterestIncome: number;
  tradingCurrency: string;
  settleCurrency: string;
  paymentDate: string;
  paymentMethod: string;
  comment: string;
}

/** 观察 */
type ObserveLifeCycleViewModel =
  | SwapLifeCycleObservationBearIndexSwapCViewModel
  | SwapLifeCycleObservationBullBearIndexSwapCViewModel
  | SwapLifeCycleObservationLongEnhancedCViewModel
  | SwapLifeCycleObservationLongUnEnhancedCViewModel
  | SwapLifeCycleObservationSingleBullBearIndexSwapCViewModel;

enum SwapPayEnums {
  /** 支付 */
  Pay = 'PAY',
  /** 收取 */
  Receive = 'RECEIVE',
}

enum SwapDirectionOptionEnums {
  PayEquityReceiveInterest = 'PAY_EQUITY_RECEIVE_INTEREST',
  PayInterestReceiveEquity = 'PAY_INTEREST_RECEIVE_EQUITY',
}

enum RatesFrequencyValueEnums {
  Quarter = 'QUARTER',
  Halfyear = 'HALFYEAR',
}
const RatesFrequencyOptionEnums = {
  [RatesFrequencyValueEnums.Quarter]: '季度',
  [RatesFrequencyValueEnums.Halfyear]: '半年度',
};

enum EndDateTypeValueEnums {
  Experiationdate = 'EXPERIATION_DATE',
  Settlementdate = 'SETTLEMENT_DATE',
}
const EndDateTypeOptionEnums = {
  [EndDateTypeValueEnums.Experiationdate]: '期末观察日',
  [EndDateTypeValueEnums.Settlementdate]: '结算日',
};

enum BusinessTypeValueEnums {
  SWAP = 'SWAP',
  INCOME_CERTIFICATE = 'INCOME_CERTIFICATE',
}

const BusinessTypeOptionEnums = {
  [BusinessTypeValueEnums.SWAP]: '收益互换',
  [BusinessTypeValueEnums.INCOME_CERTIFICATE]: '互换凭证',
};

/** 支付方式 */
enum PaymentMethodOptionEnums {
  DirectPay = 'DIRECT_PAY',
  Netting = 'NETTING',
}

const PaymentMethodValueMap = {
  [PaymentMethodOptionEnums.DirectPay]: '直接支付',
  [PaymentMethodOptionEnums.Netting]: '预付金净额结算',
};

/** 修改 生命周期 */
interface AmendLifeCycleViewModel {
  attachmentType: string | null;
  contractType: string;
  contractCode: string;
  longSideLimitNotionalAmount?: number;
  swapProductType: SwapProductTypeEnums;
  swapDirection: SwapDirectionOptionEnums;
  bookName: string;
  tradeConfirmId: string;
  counterPartyName: string;
  masterAgreementId: string;
  capitalAccountId: string;
  calendarId?: string[];
  conversionRate: number;
  tradeDate: string;
  effectiveDate: string;
  expirationDate: string;
  settlementDate: string;
  interestPayFrequency: string;
  interestIncomeDeadLine: string;
  periodCountConvention: string;
  daysInYear: number;
  baseRate: number;
  shortSideInterestAccrualReference: string;
  contractNotionalAmount: number;
  dirInfo: DirInfo[];
  targetInfo: {
    underlyingInstrumentId: string;
    longShort: EquityDirectionEnums;
    equityProfitDirection: string;
    interestProfitDirection: string;
    initSpot: number;
    initAmount: number;
    currentAmount: number;
    multiplier: number;
    notionalAmount: number;
    initNotionalAmount: number;
    evaluationQuoteType: string;
    fixRate: number;
    floatIndex: string;
    id: string;
    floatRates: {
      floatRatesTable: {
        fixingDate: string;
        activeDate: string;
        durabilityDate: string;
        rate: number;
        id: string;
      }[];
    };
    enhanceRates: {
      enhanceRatesTable: {
        fixingDate: string;
        activeDate: string;
        durabilityDate: string;
        rate: number;
        id: string;
      }[];
    };
  }[];
  shortSideMtmReference: string;
  shortSideInitialMarginRatio: number;
  shortSideMaintenanceMarginRatio: number;
  shortSideAdditionalMarginRatio: number;
  shortSideBeforeWithdrawalMarginRatio: number;
  ShortSideAfterWithdrawalMarginRatio: number;
  availableDate: string;
  comment: string;
  longSideInterestAccrualReference: string;
  longSideFixRate: number;
  longSideFloatIndex: string;
  longSideFloatRates: {
    floatRatesTable: {
      fixingDate: string;
      activeDate: string;
      durabilityDate: string;
      rate: number;
      id: string;
    }[];
  };
  longSideMtmReference: string;
  longSideInitialMarginRatio: number;
  longSideMaintenanceMarginRatio: number;
  longSideAdditionalMarginRatio: number;
  longSideBeforeWithdrawalMarginRatio: number;
  longSideAfterWithdrawalMarginRatio: number;
  [SwapFieldNameEnums.LifeCycleComment]?: string;
  initialMarginPaymentDate: string;
  businessType: string;
  tradingCurrency: string;
  settleCurrency: string;
  initExchangeRate: number;
  referenceExchangeRate?: string;
  exchangeRateType?: string;
  term?: number;
  reservedField?: string;
  participationRate?: number;
  unwindRate?: number;
}

export {
  SwapDirectionOptionEnums,
  SwapPayEnums,
  RatesFrequencyValueEnums,
  RatesFrequencyOptionEnums,
  EndDateTypeValueEnums,
  EndDateTypeOptionEnums,
  BusinessTypeValueEnums,
  BusinessTypeOptionEnums,
  PaymentMethodOptionEnums,
  PaymentMethodValueMap,
};

export type {
  TargetInfo,
  FloatRatesTable,
  TradeCRUDViewModel,
  LifeCycleTargetInfo,
  UnwindLifeCycleViewModel,
  // CorporateBehaviorLifeCycleViewModel,
  InterestPaymentLifeCycleViewModel,
  ObserveLifeCycleViewModel,
  SettleLifeCycleViewModel,
  ContractCodeItem,
  UnwindData,
  AmendLifeCycleViewModel,
};
