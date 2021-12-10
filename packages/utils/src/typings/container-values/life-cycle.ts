import { SwapFieldNameEnums } from '../../constants';

interface SwapLifeCycleObservationBearIndexSwapCViewModel {
  contractCode: string;
  targetInfo: {
    id: string;
    underlyingInstrumentId: string;
    equityDirection: string;
    fixRate: number;
    floatIndex: string;
    floatRates: {
      floatRatesTable: {
        id: string;
        fixingDate: string;
        activeDate: string;
        durabilityDate: string;
        rate: number;
        editable?: boolean;
      }[];
    };
  }[];
  comment: string;
}

interface SwapLifeCycleObservationBullBearIndexSwapCViewModel {
  contractCode: string;
  longSideFloatIndex: string;
  longSideFloatRates: {
    floatRatesTable: {
      id: string;
      fixingDate: string;
      activeDate: string;
      durabilityDate: string;
      rate: number;
    }[];
  };
  targetInfo: {
    underlyingInstrumentId: string;
    equityDirection: string;
    fixRate: number;
    floatIndex: string;
    floatRates: {
      floatRatesTable: {
        id: string;
        fixingDate: string;
        activeDate: string;
        durabilityDate: string;
        rate: number;
      }[];
    };
  }[];
  comment: string;
}

interface SwapLifeCycleObservationLongEnhancedCViewModel {
  contractCode: string;
  underlyingInstrumentId: string;
  underlyingInstrumentName: string;
  enhanceRates: {
    id: string;
    fixingDate: string;
    activeDate: string;
    durabilityDate: string;
    rate: number;
    editable?: boolean;
  }[];
  comment: string;
}

interface SwapLifeCycleObservationLongUnEnhancedCViewModel {
  contractCode: string;
  underlyingInstrumentIds: string[];
  longSideFloatIndex: string;
  longSideFloatRates: {
    id: string;
    fixingDate: string;
    activeDate: string;
    durabilityDate: string;
    rate?: number;
    editable?: boolean;
  }[];
  comment: string;
}

interface SwapLifeCycleObservationSingleBullBearIndexSwapCViewModel {
  contractCode: string;
  targetInfo: {
    id: string;
    underlyingInstrumentId: string;
    equityDirection: string;
    fixRate: number;
    floatIndex: string;
    floatRates: {
      floatRatesTable: {
        id: string;
        fixingDate: string;
        activeDate: string;
        durabilityDate: string;
        rate: number;
        editable?: boolean;
      }[];
    };
  }[];
  comment: string;
}
interface SwapUpdateMarginBearIndexSwapCViewModel {
  longSideMtmReference?: string;
  longSideInitialMarginRatio?: number;
  longSideMaintenanceMarginRatio?: number;
  additionalMarginRatio?: number;
  beforeWithdrawalMarginRatio?: number;
  afterWithdrawalMarginRatio?: number;
  conversionRate?: number;
}

interface SwapUpdateMarginBullIndexSwapCViewModel {
  shortSideMtmReference?: string;
  shortSideMaintenanceMarginRatio?: number;
  shortSideInitialMarginRatio?: number;
  additionalMarginRatio?: number;
  beforeWithdrawalMarginRatio?: number;
  afterWithdrawalMarginRatio?: number;
  conversionRate?: number;
}
interface SwapUpdateMarginBullBearIndexSwapCViewModel {
  longSideMtmReference?: string;
  longSideInitialMarginRatio?: number;
  longSideMaintenanceMarginRatio?: number;
  shortSideMtmReference?: string;
  shortSideMaintenanceMarginRatio?: number;
  shortSideInitialMarginRatio?: number;
  additionalMarginRatio?: number;
  beforeWithdrawalMarginRatio?: number;
  afterWithdrawalMarginRatio?: number;
  conversionRate?: number;
}
interface SwapUpdateMarginSingleBullBearIndexSwapCViewModel {
  longSideMtmReference?: string;
  longSideInitialMarginRatio?: number;
  longSideMaintenanceMarginRatio?: number;
  shortSideMtmReference?: string;
  shortSideMaintenanceMarginRatio?: number;
  shortSideInitialMarginRatio?: number;
  additionalMarginRatio?: number;
  beforeWithdrawalMarginRatio?: number;
  afterWithdrawalMarginRatio?: number;
  conversionRate?: number;
}

interface SwapUpdateMarginEnhancedBullBearIndexSwapCViewModel {
  mtmReference?: string;
  maintenanceMarginRatio?: number;
  initialMarginRatio?: number;
  additionalMarginRatio?: number;
  beforeWithdrawalMarginRatio?: number;
  afterWithdrawalMarginRatio?: number;
  conversionRate?: number;
}

/**
 * @description 生命周期类型
 * @author 高枫
 * @date 2021/01/13
 * @interface LifeCycleViewModel
 */
interface CorporateBehaviorLifeCycleViewModel {
  contractCode: string;
  availableDate: string;
  comment?: string;
  underlyingInstrumentId: string;
  dividends: number;
  targetAmount?: number;
  totalAmount?: number;
}

/** 期间付息 提交数据类型 */
interface InterestPaymentCViewModel {
  startDate: string;
  endDate: string;
  cashflow: number;
  paymentDate: string;
  comment?: string;
  contractCode: string;
}

interface TargetInfo {
  id: string;
  [SwapFieldNameEnums.InitSpot]: string;
  [SwapFieldNameEnums.UnderlyingInstrumentId]: string;
  [SwapFieldNameEnums.Multiplier]: number;
  [SwapFieldNameEnums.SettleAmount]?: number;
  [SwapFieldNameEnums.SettlePrice]?: number;
  [SwapFieldNameEnums.UnwindAmount]?: number;
  [SwapFieldNameEnums.UnwindPrice]?: number;
  [SwapFieldNameEnums.EquityDirection]?: string;
  [SwapFieldNameEnums.RealizeDividends]?: number;
  [SwapFieldNameEnums.RealizeUnitDividends]?: number;
}

interface ContractPreSettleValues {
  [SwapFieldNameEnums.UnwindDate]: Date;
  [SwapFieldNameEnums.SwapDirection]: string;
  [SwapFieldNameEnums.TotalEquityIncome]?: number;
  [SwapFieldNameEnums.TotalInterestIncome]?: number;
  [SwapFieldNameEnums.TotalRealizeDividends]?: number;
  [SwapFieldNameEnums.Comment]?: string;
  [SwapFieldNameEnums.Cashflow]?: number;
  [SwapFieldNameEnums.TargetInfo]: TargetInfo[];
}

export type {
  ContractPreSettleValues,
  InterestPaymentCViewModel,
  CorporateBehaviorLifeCycleViewModel,
  SwapLifeCycleObservationBearIndexSwapCViewModel,
  SwapLifeCycleObservationBullBearIndexSwapCViewModel,
  SwapLifeCycleObservationLongEnhancedCViewModel,
  SwapLifeCycleObservationLongUnEnhancedCViewModel,
  SwapLifeCycleObservationSingleBullBearIndexSwapCViewModel,
  SwapUpdateMarginBearIndexSwapCViewModel,
  SwapUpdateMarginBullBearIndexSwapCViewModel,
  SwapUpdateMarginBullIndexSwapCViewModel,
  SwapUpdateMarginSingleBullBearIndexSwapCViewModel,
  SwapUpdateMarginEnhancedBullBearIndexSwapCViewModel,
};
