import { SwapFieldNameEnums } from './fields';

const SwapFieldNameZhEnums = {
  [SwapFieldNameEnums.TableAction]: 'tableAction',
  [SwapFieldNameEnums.TargetInfo]: '标的物信息',
  [SwapFieldNameEnums.ContractInfo]: {
    default: '合约详情',
    unwind: '平仓合约详情',
    settle: '到期结算合约详情',
  },
  [SwapFieldNameEnums.SettleAmountInfo]: {
    default: '结算金额',
    unwind: '平仓结算金额',
    settle: '到期结算金额',
  },
  [SwapFieldNameEnums.SettleCurrencyTotalEquityIncome]: {
    unwind: '平仓实现合约权益收益',
    settle: '结算实现合约权益收益',
  },
  [SwapFieldNameEnums.CounterPartyName]: '交易对手',
  [SwapFieldNameEnums.MasterAgreementId]: '交易对手SAC编号',
  [SwapFieldNameEnums.EarlyTerminationRate]: 'earlyTerminationRate',
  [SwapFieldNameEnums.AdvanceFeeReturnRate]: 'advanceFeeReturnRate',
  [SwapFieldNameEnums.BookName]: '交易簿',
  [SwapFieldNameEnums.ContractCode]: '合约编号',
  [SwapFieldNameEnums.TradeConfirmId]: '交易确认书编号',
  [SwapFieldNameEnums.ContractDirection]: 'contractDirection',
  [SwapFieldNameEnums.SwapProductType]: '互换类型',
  [SwapFieldNameEnums.ContractInitNotionalAmount]: 'contractInitNotionalAmount',
  [SwapFieldNameEnums.TradeDate]: '交易达成日',
  [SwapFieldNameEnums.EffectiveDate]: '起始日',
  [SwapFieldNameEnums.SettlementDate]: {
    default: '结算日',
    settle: '结算日期',
  },
  [SwapFieldNameEnums.ExpirationDate]: '期末观察日',
  [SwapFieldNameEnums.InterestPayFrequency]: '利率收益支付频率',
  [SwapFieldNameEnums.EnhancedPayFrequency]: '增强收益支付频率',
  [SwapFieldNameEnums.SettlementMethod]: 'settlementMethod',
  [SwapFieldNameEnums.DaysInYear]: '年化天数',
  [SwapFieldNameEnums.BaseRate]: '基本费率(%)',
  [SwapFieldNameEnums.ShortSideInterestAccrualReference]: '空头计息基准',
  [SwapFieldNameEnums.LongSideFixRate]: '多头约定固定利率(%)',
  [SwapFieldNameEnums.LongSideFloatIndex]: '多头约定浮动利率基准',
  [SwapFieldNameEnums.ShortSideFloatIndex]: 'shortSideFloatIndex',
  [SwapFieldNameEnums.SideTotalNotionalAmount]: 'SideTotalNotionalAmount',
  [SwapFieldNameEnums.UnderlyingInstrumentId]: '标的物代码',
  [SwapFieldNameEnums.UnderlyingInstrumentSimpleName]: 'underlyingInstrumentSimpleName',
  [SwapFieldNameEnums.ConversionRate]: '折算率(%)',
  [SwapFieldNameEnums.EquityDirection]: '标的方向',
  [SwapFieldNameEnums.TotalReturnIndex]: 'totalReturnIndex',
  [SwapFieldNameEnums.InitSpot]: {
    default: '期初价格',
    subject: '标的期初价格',
  },
  [SwapFieldNameEnums.InitAmount]: '标的期初名义数量(股/张/手)',
  [SwapFieldNameEnums.Multiplier]: '标的乘数',
  [SwapFieldNameEnums.CostSpot]: '成本价',
  [SwapFieldNameEnums.DividendRate]: 'dividendRate',
  [SwapFieldNameEnums.EvaluationQuoteType]: '标的估值价格类型',
  [SwapFieldNameEnums.EquityInitNotionalAmount]: 'equityInitNotionalAmount',
  [SwapFieldNameEnums.InitNotionalAmount]: {
    default: '期初名义本金额',
    leg: '标的期初名义本金额',
    contract: '合约期初名义本金额',
  },
  [SwapFieldNameEnums.LongSideFloatRates]: '多头约定浮动利率',
  [SwapFieldNameEnums.LongSideFloatRatesTable]: 'LongSideFloatRatesTable',
  [SwapFieldNameEnums.FixingFrequency]: 'fixingFrequency',
  [SwapFieldNameEnums.FixingDate]: '观察日',
  [SwapFieldNameEnums.Rate]: '利率(%)',
  [SwapFieldNameEnums.EnhancedRate]: 'enhancedRate',
  [SwapFieldNameEnums.Term]: '期限(月)',
  [SwapFieldNameEnums.LongSideInitialMarginRatio]: '多头初始保障比例参数(%)',
  [SwapFieldNameEnums.ShortSideInitialMarginRatio]: '空头初始保障比例参数(%)',
  [SwapFieldNameEnums.LongSideMaintenanceMarginRatio]: '多头维持保障比例参数(%)',
  [SwapFieldNameEnums.ShortSideMaintenanceMarginRatio]: '空头维持保障比例参数(%)',
  [SwapFieldNameEnums.AdditionalMarginRatio]: '追加后保障比例参数(%)',
  [SwapFieldNameEnums.LongSideMtmReference]: '多头盯市基准',
  [SwapFieldNameEnums.ShortSideMtmReference]: '空头盯市基准',
  [SwapFieldNameEnums.SideFloatRates]: 'SideFloatRates',
  [SwapFieldNameEnums.SideFixRate]: 'SideFixRate',
  [SwapFieldNameEnums.SideFloatIndex]: 'SideFloatIndex',
  [SwapFieldNameEnums.ActiveDate]: '作用起始日',
  [SwapFieldNameEnums.DurabilityDate]: '作用截止日',
  [SwapFieldNameEnums.Legs]: 'legs',
  [SwapFieldNameEnums.FixRate]: '约定固定利率(%)',
  [SwapFieldNameEnums.FloatIndex]: '约定浮动利率基准',
  [SwapFieldNameEnums.FloatRates]: '约定浮动利率',
  [SwapFieldNameEnums.EnhanceRates]: '增强收益率',
  [SwapFieldNameEnums.EnhanceRatesTable]: 'enhanceRatesTable',
  [SwapFieldNameEnums.FloatRatesTable]: 'floatRatesTable',
  [SwapFieldNameEnums.ContractNotionalAmount]: {
    contractNotionalAmount: '合约名义本金额',
    defalut: '合约期初名义本金',
  },
  [SwapFieldNameEnums.BeforeWithdrawalMarginRatio]: '多头提取前保障比例(%)',
  [SwapFieldNameEnums.AfterWithdrawalMarginRatio]: '多头提取后保障比例(%)',
  [SwapFieldNameEnums.NotionalAmount]: '名义本金额',
  [SwapFieldNameEnums.PeriodCountConvention]: '利率收益计息方式',
  [SwapFieldNameEnums.EnhancedPeriodCountConvention]: '增强收益计息方式',
  [SwapFieldNameEnums.SwapDirection]: '交易方向',
  [SwapFieldNameEnums.StartDate]: '计息起始日',
  [SwapFieldNameEnums.EndDate]: '计息截止日',
  [SwapFieldNameEnums.PaymentDate]: '支付日期',
  [SwapFieldNameEnums.Comment]: '备注',
  [SwapFieldNameEnums.Sale]: 'sale',
  [SwapFieldNameEnums.ContractStatus]: '合约状态',
  [SwapFieldNameEnums.PositionStatus]: '持仓状态',
  [SwapFieldNameEnums.AvailableDate]: {
    /** 生效日期 */
    effectiveDate: '生效日期',
    /** 修改日期 */
    modificationDate: '修改日期',
    /** 限制起始日 */
    startDateOfRestriction: '限制起始日',
    /** 解除限制日 */
    dayofLiftingRestrictions: '解除限制日',
    /** 除息日 */
    exDividendDate: '除息日',
  },
  [SwapFieldNameEnums.FreezeNotionalAmount]: {
    free: '新限制多头名义本金额',
    unFree: '解除限制多头名义本金额',
  },
  [SwapFieldNameEnums.UnfreezeNotionalAmount]: '解除限制多头名义本金额',
  [SwapFieldNameEnums.LongSideLimitNotionalAmount]: '多头限制期名义本金额',
  [SwapFieldNameEnums.Dividends]: {
    default: '待实现单位股息',
    valuation: '待实现权益收益.股息',
  },
  [SwapFieldNameEnums.TargetAmount]: '名义数量(股/张/手)',
  [SwapFieldNameEnums.TotalAmount]: '待实现股息',
  [SwapFieldNameEnums.SettlementTargetInfo]: '到期结算标的详情',
  [SwapFieldNameEnums.SettleAmount]: '结算数量(股/张/手)',
  [SwapFieldNameEnums.SettlePrice]: '期末价格',
  [SwapFieldNameEnums.EquityIncome]: {
    default: '权益收益',
    settlement: '结算实现权益收益.浮动',
    unwind: '平仓实现权益收益.浮动',
    leg: '待实现权益收益.浮动',
  },
  [SwapFieldNameEnums.RealizeUnitDividends]: {
    defalut: '单位股息',
    settlement: '结算单位股息',
    unwind: '平仓单位股息',
  },
  [SwapFieldNameEnums.RealizeDividends]: {
    settlement: '结算实现权益收益.股息',
    unwind: '平仓实现权益收益.股息',
  },
  [SwapFieldNameEnums.TotalEquityIncome]: {
    default: '总实现合约权益收益',
    settlement: '结算实现合约权益收益',
    unwind: '平仓实现合约权益收益',
    leg: '累计实现权益收益.浮动',
    contract: '累计实现合约权益收益.浮动',
  },
  [SwapFieldNameEnums.TotalRealizeDividends]: {
    default: '总合约股息',
    settlement: '结算实现合约权益收益.股息',
    unwind: '平仓实现合约权益收益.股息',
  },
  [SwapFieldNameEnums.TotalInterestIncome]: {
    default: '实现合约利率收益',
    unwind: '平仓实现合约利率收益',
    settlement: '结算实现合约利率收益',
    interestIncome: '期间收支实现合约利率收益',
  },
  [SwapFieldNameEnums.Cashflow]: {
    defalut: '现金流',
    interestPay: '支付金额',
    settlement: '到期结算金额',
    unwind: '平仓结算金额',
  },
  [SwapFieldNameEnums.UnwindDate]: '平仓日期',
  [SwapFieldNameEnums.UnwindAmount]: '平仓数量(股/张/手)',
  [SwapFieldNameEnums.UnwindPrice]: '平仓价格',
  [SwapFieldNameEnums.SettleNotionalAmount]: {
    unwind: '平仓名义本金额',
    settle: '结算名义本金额',
  },
  [SwapFieldNameEnums.LongNominalPrincipalAmount]: '多头名义本金额',
  [SwapFieldNameEnums.BeforeWithdrawalMarginRatio]: '提取前保障比例参数(%)',
  [SwapFieldNameEnums.AfterWithdrawalMarginRatio]: '提取后保障比例参数(%)',
  [SwapFieldNameEnums.LongSideLimitRates]: '多头限制约定费率(%)',
  [SwapFieldNameEnums.LongSideTotalRates]: '多头约定费率(%)',
  [SwapFieldNameEnums.Amount]: '标的名义数量(股/张/手)',
  [SwapFieldNameEnums.LongSideInterestAccrualReference]: '多头计息基准',
  [SwapFieldNameEnums.InitContractNotionalAmount]: '合约期初名义本金额',
  [SwapFieldNameEnums.LongSideInterestAccrualAmount]: '多头约定费率计息基准',
  [SwapFieldNameEnums.LongShort]: '标的方向',
  [SwapFieldNameEnums.UserName]: 'userName',
  [SwapFieldNameEnums.ExecutionTime]: 'executionTime',
  [SwapFieldNameEnums.EventType]: '生命周期事件',
  [SwapFieldNameEnums.Interval]: '观察日与作用起始日间隔',
  [SwapFieldNameEnums.RatesFrequency]: '利率作用频率',
  [SwapFieldNameEnums.InterestIncomeDeadLine]: '利率收益计息截止日',
  [SwapFieldNameEnums.EnhancedIncomeDeadLine]: '增强收益计息截止日',
  [SwapFieldNameEnums.ValuationDate]: {
    default: '估值日',
    margin: '日期',
  },
  [SwapFieldNameEnums.EvaluatePrice]: '估值价格',
  [SwapFieldNameEnums.AccumulateSettleAmount]: {
    settle: '结算累计数量(股/张/手)',
    unwind: '平仓累计数量(股/张/手)',
  },
  [SwapFieldNameEnums.CurrentNotionalAmount]: '名义本金额',
  [SwapFieldNameEnums.MarketValue]: '标的市值',
  [SwapFieldNameEnums.NewlyRealizedCashFlow]: {
    default: '当日实现权益收益',
    contract: '当日实现合约权益收益',
  },
  [SwapFieldNameEnums.EnhanceIndexIncome]: '待实现权益收益.增强',
  [SwapFieldNameEnums.UnrealizedCashFlow]: {
    default: '待实现权益收益',
    contract: '待实现合约权益收益',
  },
  [SwapFieldNameEnums.AgreedInterestRate]: '约定费率(%)',
  [SwapFieldNameEnums.AccrualReference]: '计息基准',
  [SwapFieldNameEnums.AccrualAmount]: '约定费率计息基准',
  [SwapFieldNameEnums.DailyInterestIncome]: {
    default: '当日利率收益',
    contract: '当日合约利率收益',
  },
  [SwapFieldNameEnums.ErrorMessage]: '报错信息',
  [SwapFieldNameEnums.ExecuteDateTime]: {
    form: '估值日',
    tabel: '更新时间',
  },
  [SwapFieldNameEnums.IsNew]: '是否最新',
  [SwapFieldNameEnums.Revert]: '已撤销',
  [SwapFieldNameEnums.ExecDate]: '操作时间',
  [SwapFieldNameEnums.ExecUser]: '操作用户',
  [SwapFieldNameEnums.LcmEventType]: '生命周期事件',
  [SwapFieldNameEnums.FieldName]: '',
  [SwapFieldNameEnums.NewValue]: '修改后',
  [SwapFieldNameEnums.OldValue]: '修改前',
  [SwapFieldNameEnums.Legs]: '标的信息',
  [SwapFieldNameEnums.LifeCycleComment]: {
    default: '修改交易要素备注',
  },
  [SwapFieldNameEnums.ProductType]: '互换类型',
  [SwapFieldNameEnums.CurrentAmount]: '标的名义数量(股/张/手)',
  [SwapFieldNameEnums.EquityProfitDirection]: '权益收益方向',
  [SwapFieldNameEnums.InterestProfitDirection]: '利率收益方向',
  [SwapFieldNameEnums.LongSideTotalNotAmt]: '多头组合名义本金额',
  [SwapFieldNameEnums.LongSideTotalMarketValue]: '多头组合市值',
  [SwapFieldNameEnums.ShortSideTotalNotAmt]: '空头组合名义本金额',
  [SwapFieldNameEnums.ShortSideTotalMarketValue]: '空头组合市值',
  [SwapFieldNameEnums.ShortSideDailyInterestIncome]: '当日空头年化利率收益',
  [SwapFieldNameEnums.AccumulateInterestIncome]: {
    default: '累计利率收益',
    contract: '累计合约利率收益',
  },
  [SwapFieldNameEnums.RealizedInterestIncome]: {
    default: '累计实现利率收益',
    contract: '累计实现合约利率收益',
  },
  [SwapFieldNameEnums.UnrealizedInterestIncome]: {
    default: '待实现利率收益',
    contract: '待实现合约利率收益',
  },
  [SwapFieldNameEnums.ContractPresentValue]: '合约价值',
  [SwapFieldNameEnums.TaskName]: '节点名称',
  [SwapFieldNameEnums.ApproveGroupList]: '审批组',
  [SwapFieldNameEnums.Credit]: '信用风险敞口限额',
  [SwapFieldNameEnums.CreditOccupy]: '信用风险敞口限额占用',
  [SwapFieldNameEnums.CreditSurplus]: '信用风险敞口限额剩余',
  [SwapFieldNameEnums.PrePaymentBalance]: '预付金余额',
  [SwapFieldNameEnums.ContractNetPresentValue]: '合约价值.合并',
  [SwapFieldNameEnums.MarkToMarketAmount]: '盯市金额',
  [SwapFieldNameEnums.MaintenanceMargin]: '维持保障金额',
  [SwapFieldNameEnums.AfterAdditionalMargin]: '追加后保障金额',
  [SwapFieldNameEnums.MarginStatus]: '保障金状态',
  [SwapFieldNameEnums.MarginCallAmount]: '应追加预付金金额',

  [SwapFieldNameEnums.ConvertedContractPresentValue]: {
    default: '折算后合约价值',
    margin: '折算后合约价值.合并',
  },
  [SwapFieldNameEnums.LongSideMtmAmount]: '多头盯市基准金额',
  [SwapFieldNameEnums.ShortSideMtmAmount]: '空头盯市基准金额',
  [SwapFieldNameEnums.InitialMargin]: '初始保障金额',
  [SwapFieldNameEnums.BeforeWithDrawalMargin]: '提取前保障金额',
  [SwapFieldNameEnums.AfterWithDrawalMargin]: '提取后保障金额',
  // [SwapFieldNameEnums.ContractInitialMarginAmount]: '期初合约初始保障金额',
  [SwapFieldNameEnums.Enhanced]: '是否指增',
  [SwapFieldNameEnums.ContractInitialMarginAmount]: '初始预付金金额',
  [SwapFieldNameEnums.MarginDirection]: '预付金支付方向',
  [SwapFieldNameEnums.LongSideInitialPrepaymentRate]: '多头初始预付金率(%)',
  [SwapFieldNameEnums.ShortSideInitialPrepaymentRate]: '空头初始预付金率(%)',
  [SwapFieldNameEnums.InterestIncome]: {
    default: '实现利率收益',
    interestPayMent: '期间收支实现利率收益',
    unwind: '平仓实现利率收益',
    settle: '结算实现利率收益',
  },
  [SwapFieldNameEnums.ContractBaseInterestIncome]: {
    default: '实现基本费用',
    interestPayMent: '期间收支实现基本费用',
    unwind: '平仓实现基本费用',
    settle: '结算实现基本费用',
  },
  [SwapFieldNameEnums.AfterUnwindAmount]: '平仓后名义数量(股/张/手)',
  [SwapFieldNameEnums.ContractSettleNotionalAmount]: {
    settle: '合约结算名义本金额',
    unwind: '合约平仓名义本金额',
  },
  [SwapFieldNameEnums.ContractAfterUnwindNotionalAmount]: '合约平仓后名义本金额',
  [SwapFieldNameEnums.EquityIncomeEnhance]: {
    settle: '结算实现增强收益',
    unwind: '平仓实现增强收益',
  },
  [SwapFieldNameEnums.ContractEquityIncomeEnhance]: {
    settle: '结算实现合约增强收益',
    unwind: '平仓实现合约增强收益',
  },
  [SwapFieldNameEnums.BusinessType]: '业务类型',
  [SwapFieldNameEnums.InitialMarginPaymentDate]: '初始预付金支付日',
  [SwapFieldNameEnums.ContractEquityIncomeFloat]: {
    settle: '结算实现合约权益收益.浮动',
    unwind: '平仓实现合约权益收益.浮动',
  },
  [SwapFieldNameEnums.PaymentMethod]: '支付方式',
  [SwapFieldNameEnums.OneDayEnhanceIndexIncome]: {
    default: '当日实现权益收益.增强',
    contract: '当日实现合约权益收益.增强',
  },
  [SwapFieldNameEnums.OneDayEquityIncome]: {
    default: '当日实现权益收益.浮动',
    contract: '当日实现合约权益收益.浮动',
  },
  [SwapFieldNameEnums.OneDayDividends]: {
    default: '当日实现权益收益.股息',
    contract: '当日实现合约权益收益.股息',
  },
  [SwapFieldNameEnums.UnrealizedDividends]: '待实现合约权益收益.股息',
  [SwapFieldNameEnums.UnrealizedEquityIncome]: '待实现合约权益收益.浮动',
  [SwapFieldNameEnums.UnrealizedEnhanceIndexIncome]: '待实现合约权益收益.增强',
  [SwapFieldNameEnums.RealizedDividends]: {
    default: '累计实现权益收益.股息',
    contract: '累计实现合约权益收益.股息',
  },
  [SwapFieldNameEnums.RealizedEnhanceIndexIncome]: {
    default: '累计实现权益收益.增强',
    contract: '累计实现合约权益收益.增强',
  },
  [SwapFieldNameEnums.RealizedCashFlow]: {
    default: '累计实现权益收益',
    contract: '累计实现合约权益收益',
  },
  [SwapFieldNameEnums.NewlyRealizedInterestIncome]: {
    default: '当日实现利率收益',
    contract: '当日实现合约利率收益',
  },
  [SwapFieldNameEnums.TemplateName]: '模板名称',
  [SwapFieldNameEnums.TemplateType]: '模板类型',
  [SwapFieldNameEnums.UpdateTime]: '最近保存时间',
  [SwapFieldNameEnums.TradingCurrency]: '交易货币',
  [SwapFieldNameEnums.SettleCurrency]: '结算货币',
  [SwapFieldNameEnums.InitExchangeRate]: '期初汇率',
  [SwapFieldNameEnums.ReferenceExchangeRate]: '参考汇率',
  [SwapFieldNameEnums.ExchangeRateType]: '汇率类型',
  [SwapFieldNameEnums.SettleExchangeRate]: '结算汇率',
  [SwapFieldNameEnums.TodayExchangeRate]: '当日汇率',
  /** 当日实现权益收益(结算货币) */
  [SwapFieldNameEnums.NewlyRealizedCashFlowSettle]: {
    default: '当日实现权益收益(结算货币)',
    contract: '当日实现合约权益收益(结算货币)',
  },
  /** 累计实现权益收益(结算货币) */
  [SwapFieldNameEnums.RealizedCashFlowSettle]: {
    default: '累计实现权益收益(结算货币)',
    contract: '累计实现合约权益收益(结算货币)',
  },
  /** 待实现权益收益(结算货币) */
  [SwapFieldNameEnums.UnrealizedCashFlowSettle]: {
    default: '待实现权益收益(结算货币)',
    contract: '待实现合约权益收益(结算货币)',
  },
  /** 当日实现利率收益(结算货币) */
  [SwapFieldNameEnums.NewlyRealizedInterestIncomeSettle]: {
    default: '当日实现利率收益(结算货币)',
    contract: '当日实现合约利率收益(结算货币)',
  },
  /** 累计实现利率收益(结算货币) */
  [SwapFieldNameEnums.RealizedInterestIncomeSettle]: {
    default: '累计实现利率收益(结算货币)',
    contract: '累计实现合约利率收益(结算货币)',
  },
  /** 待实现利率收益(结算货币) */
  [SwapFieldNameEnums.UnrealizedInterestIncomeSettle]: {
    default: '待实现利率收益(结算货币)',
    contract: '待实现合约利率收益(结算货币)',
  },
  /** 合约价值(结算货币) */
  [SwapFieldNameEnums.ContractPresentValueSettle]: '合约价值(结算货币)',
  /** 累计合约利率收益(结算货币) */
  [SwapFieldNameEnums.AccumulateInterestIncomeSettle]: '累计合约利率收益(结算货币)',
  /** 当日合约利率收益(结算货币) */
  [SwapFieldNameEnums.DailyInterestIncomeSettle]: '当日合约利率收益(结算货币)',
  [SwapFieldNameEnums.SwapRole]: '角色',
  [SwapFieldNameEnums.SwapEquityDirection]: '权益方向',
  [SwapFieldNameEnums.SwapInterestDirection]: '利率方向',

  [SwapFieldNameEnums.SettleCurrencyConvertedContractPresentValue]: {
    default: '折算后合约价值(结算货币)',
    margin: '折算后合约价值.合并(结算货币)',
  },
  [SwapFieldNameEnums.SettleCurrencyContractNetPresentValue]: '合约价值.合并(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyInitialMargin]: '初始保障金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyMaintenanceMargin]: '维持保障金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyAfterAdditionalMargin]: '追加后保障金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyBeforeWithDrawalMargin]: '提取前保障金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyAfterWithDrawalMargin]: '提取后保障金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyContractPresentValue]: '合约价值(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyLongSideMtmAmount]: '多头盯市基准金额(结算货币)',
  [SwapFieldNameEnums.SettleCurrencyShortSideMtmAmount]: '空头盯市基准金额(结算货币)',
  [SwapFieldNameEnums.ContractType]: '合约类型',
  [SwapFieldNameEnums.FwContractCode]: '框架合约编号',
  [SwapFieldNameEnums.ContractFixRate]: '合约固定收益率(%)',
  [SwapFieldNameEnums.ContractValueAdj]: '合约估值调整项',
  [SwapFieldNameEnums.MtmReference]: '盯市基准',
  [SwapFieldNameEnums.InitialMarginRatio]: '初始保障比例参数(%)',
  [SwapFieldNameEnums.MaintenanceMarginRatio]: '维持保障比例参数(%)',
  [SwapFieldNameEnums.InitialPrepaymentRate]: '初始预付金率(%)',
  [SwapFieldNameEnums.LockupPeriod]: '锁定期',
  [SwapFieldNameEnums.CapitalAccountId]: '资金账户',
  [SwapFieldNameEnums.CalendarId]: '交易日历',
  [SwapFieldNameEnums.UnderlyingInstrumentName]: '标的名称',
  [SwapFieldNameEnums.LongSideIrAccRefExp]: '多头计息基准表达式',
  [SwapFieldNameEnums.ShortSideIrAccRefExp]: '空头计息基准表达式',
  [SwapFieldNameEnums.IrAccRefExp]: '计息基准表达式',
  [SwapFieldNameEnums.ReservedField]: '预留字段',
  [SwapFieldNameEnums.ParticipationRate]: '参与率(%)',
  [SwapFieldNameEnums.UnwindLine]: '平仓线(%)',
  [SwapFieldNameEnums.LongSideUnwindLine]: '多头平仓线(%)',
  [SwapFieldNameEnums.ShortSideUnwindLine]: '空头平仓线(%)',
  [SwapFieldNameEnums.Customize]: '自定义字段',
  [SwapFieldNameEnums.UnwindRate]: '提前终止费率(%)',
};

export { SwapFieldNameZhEnums };
