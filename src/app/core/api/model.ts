/** Models of the Nexus REST API. */

export interface Balance {
    amount?: number;
  currency?: string;
}

export interface BtcPriceTick {
    timestamp?: string;
    pricePerShare?: number;
    open?: number;
    close?: number;
    high?: number;
    low?: number;
    volume?: number;
}

export interface ClientDeposit {
    clientDepositId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
  client?: FundClient;
    targetFundFundId?: number;
  targetFund?: Fund;
}

export interface ClientWithdrawal {
    clientWithdrawalId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
  client?: FundClient;
    targetFundFundId?: number;
  targetFund?: Fund;
}

export interface ConfigProperty {
  name?: string;
    type?: TypeConfigPropertyEnum;
  isArray?: boolean;
  children?: ConfigProperty[];
}

export type TypeConfigPropertyEnum =
  '0' |
  '1' |
  '2' |
  '3';

export interface Connector {
    connectorId?: number;
  exchangeName?: string;
  displayName?: string;
  configuration?: string;
  isDisabled?: boolean;
  isLendingEnabled?: boolean;
  isMarketMakingEnabled?: boolean;
    targetFundFundId?: number;
  targetFund?: Fund;
  balances?: PortfolioBalance[];
  totalBalances?: PortfolioTotalBalance[];
}

export interface ConnectorDefinitionDto {
  exchangeName?: string;
  configProperties?: ConfigProperty[];
}

export interface DepositDto {
    clientId?: number;
    targetFundId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
  preview?: boolean;
}

export interface Fund {
    fundId?: number;
  key?: string;
  displayName?: string;
  description?: string;
    ownerFundClientId?: number;
  owner?: FundClient;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  checkCronInterval?: string;
    ordering?: number;
  deposits?: ClientDeposit[];
  withdrawals?: ClientWithdrawal[];
  connectors?: Connector[];
}

export interface FundBalance {
    gathered?: string;
  exchangeName?: string;
    amount?: number;
  currency?: string;
}

export interface FundBalancePerExchange {
    connectorId?: number;
  exchangeName?: string;
  exchangeDisplayName?: string;
  balances?: FundBalance[];
    gathered?: string;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
    shares?: number;
}

export interface FundClient {
    fundClientId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
    registered?: string;
  isSystem?: boolean;
    commisionPerc?: number;
  username?: string;
  password?: string;
  roles?: string[];
  deposits?: ClientDeposit[];
  withdrawals?: ClientWithdrawal[];
}

export interface FundConnectorDto {
    connectorId?: number;
    targetFundId?: number;
  exchangeName?: string;
  displayName?: string;
  configuration?: object;
  isDisabled?: boolean;
  isLendingEnabled?: boolean;
  isMarketMakerEnabled?: boolean;
}

export interface FundInfo {
  pricePerShare?: FundPricePerShare;
  performance?: FundPerformance;
  ticks?: FundPriceTick[];
  btcTicks?: BtcPriceTick[];
  performanceYears?: FundPerformanceYear[];
    id?: number;
  key?: string;
  displayName?: string;
  description?: string;
    owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  checkCronInterval?: string;
    ordering?: number;
}

export interface FundPerformance {
    bigBang?: number;
    currentYear?: number;
    currentMonth?: number;
    currentWeek?: number;
    today?: number;
}

export interface FundPerformanceMonth {
    gathered?: string;
    change?: number;
    changeBtc?: number;
    readonly btcOutperform?: number;
}

export interface FundPerformanceYear {
    year?: number;
    yearChange?: number;
    yearChangeBtc?: number;
    readonly btcOutperform?: number;
  months?: FundPerformanceMonth[];
}

export interface FundPricePerShare {
    priceBtc?: number;
    priceUsd?: number;
    priceCzk?: number;
}

export interface FundPriceTick {
    gathered?: string;
    price?: number;
}

export interface FundSimpleInfo {
    id?: number;
  key?: string;
  displayName?: string;
  description?: string;
    owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  checkCronInterval?: string;
    ordering?: number;
}

export interface FundTotalBalanceInfo {
  fund?: FundSimpleInfo;
    gathered?: string;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
    amountUsdDiff?: number;
    amountBtcDiff?: number;
    amountCzkDiff?: number;
    shares?: number;
    sharesDiff?: number;
  balances?: FundBalancePerExchange[];
}

export interface LastLoginInfoDto {
    timestamp?: string;
  provider?: string;
  grant?: string;
}

export interface NewFundDto {
  key?: string;
  displayName?: string;
  description?: string;
    owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
    ordering?: number;
  checkCronInterval?: string;
}

export interface NxLogEvent {
    timestamp?: string;
  log?: string;
  message?: string;
    level?: LevelNxLogEventEnum;
  levelString?: string;
  callStack?: string;
  exceptionType?: string;
  exceptionMessage?: string;
  exceptionCallStack?: string;
  innerExceptionType?: string;
  innerExceptionMessage?: string;
  innerExceptionCallStack?: string;
  username?: string;
}

export type LevelNxLogEventEnum =
  '0' |
  '1' |
  '2' |
  '3' |
  '4' |
  '5';

export interface PortfolioBalance {
    portfolioBalanceId?: number;
    gathered?: string;
  exchangeName?: string;
    amount?: number;
  currency?: string;
    targetConnectorConnectorId?: number;
  targetConnector?: Connector;
    targetFundFundId?: number;
  targetFund?: Fund;
}

export interface PortfolioBalanceTick {
    timestamp?: string;
    shares?: number;
    valueBtc?: number;
    valueUsd?: number;
    valueCzk?: number;
    depositedBtc?: number;
    depositedUsd?: number;
    depositedCzk?: number;
}

export interface PortfolioFundInfo {
  fund?: FundSimpleInfo;
    shares?: number;
    profitUsd?: number;
    profitBtc?: number;
    profitCzk?: number;
    assetsUsd?: number;
    assetsBtc?: number;
    assetsCzk?: number;
  deposits?: PortfolioTransaction[];
  withdrawals?: PortfolioTransaction[];
  balanceTicks?: PortfolioBalanceTick[];
  profitTicks?: PortfolioBalanceTick[];
}

export interface PortfolioInfo {
  client?: ProfileInfoDto;
    activeFunds?: number;
    totalFunds?: number;
    accountAgeDays?: number;
    totalProfitUsd?: number;
    totalProfitBtc?: number;
    totalProfitCzk?: number;
    totalAssetsUsd?: number;
    totalAssetsBtc?: number;
    totalAssetsCzk?: number;
  activeFundsInfo?: PortfolioFundInfo[];
  lastLoginInfo?: LastLoginInfoDto;
}

export interface PortfolioTotalBalance {
    portfolioTotalBalanceId?: number;
    gathered?: string;
  exchangeName?: string;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
    shares?: number;
    targetConnectorConnectorId?: number;
  targetConnector?: Connector;
    targetFundFundId?: number;
  targetFund?: Fund;
}

export interface PortfolioTransaction {
    clientId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
    targetFundId?: number;
  targetFundDisplayName?: string;
}

export interface PricePerShare {
    gathered?: string;
    priceBtc?: number;
    priceUsd?: number;
    priceCzk?: number;
}

export interface PricesDto {
  hasPrice?: boolean;
  status?: string;
    btcUsd?: number;
    btcCzk?: number;
}

export interface ProfileInfoDto {
    id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
    registered?: string;
  isSystem?: boolean;
    commisionPerc?: number;
  username?: string;
  roles?: string[];
}

export interface SharesSimpleInfo {
    targetFundId?: number;
    pricePerShareBtc?: number;
    pricePerShareUsd?: number;
    pricePerShareCzk?: number;
    sharesCount?: number;
}

export interface StatsDto {
  activeExchanges?: string[];
    activeBots?: number;
    tradedTransactionsCount?: number;
    tradedAmountBtc?: number;
    tradedAmountUsd?: number;
    tradedFrom?: string;
    tradedTo?: string;
}

export interface TotalBalance {
    totalBtc?: number;
    btc?: number;
    usd?: number;
}

export interface TransferSharesDto {
    fromClientId?: number;
    toClientId?: number;
    targetFundId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
  preview?: boolean;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdateProfileExtendedDto {
  roles?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdateProfilePasswordDto {
  newUsername?: string;
  oldPassword?: string;
  newPassword?: string;
  newPasswordRepeat?: string;
}

export interface WithdrawalDto {
    clientId?: number;
    targetFundId?: number;
    created?: string;
    shares?: number;
    amountUsd?: number;
    amountBtc?: number;
    amountCzk?: number;
  note?: string;
  preview?: boolean;
}

export interface ConnectorStatusDto {
  fundId: number;
  fundName: string;
  connectorId: number;
  exchangeName: string;
  displayName: string;
  lastAttempt?: string;
  lastSuccess?: string;
  lastError?: string;
  consecutiveFailures: number;
  isHealthy: boolean;
}
