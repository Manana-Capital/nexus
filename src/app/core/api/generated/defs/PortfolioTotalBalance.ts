/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface PortfolioTotalBalance {
  /** format: int32 */
  portfolioTotalBalanceId?: number;
  /** format: date-time */
  gathered?: string;
  exchangeName?: string;
  /** format: double */
  amountUsd?: number;
  /** format: double */
  amountBtc?: number;
  /** format: double */
  amountCzk?: number;
  /** format: double */
  shares?: number;
  targetConnector?: __model.Connector;
  /** format: int32 */
  targetFundFundId?: number;
  targetFund?: __model.Fund;
}
