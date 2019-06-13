/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface FundTotalBalanceInfo {
  fund?: __model.FundSimpleInfo;
  /** format: date-time */
  gathered?: string;
  /** format: double */
  amountUsd?: number;
  /** format: double */
  amountBtc?: number;
  /** format: double */
  amountCzk?: number;
  /** format: double */
  amountUsdDiff?: number;
  /** format: double */
  amountBtcDiff?: number;
  /** format: double */
  amountCzkDiff?: number;
  /** format: double */
  shares?: number;
  /** format: double */
  sharesDiff?: number;
  balances?: __model.FundBalancePerExchange[];
}
