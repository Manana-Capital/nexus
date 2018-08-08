/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface PortfolioBalance {
  /** format: int32 */
  portfolioBalanceId?: number;
  /** format: date-time */
  gathered?: string;
  exchangeName?: string;
  /** format: double */
  amount?: number;
  currency?: string;
  targetConnector?: __model.Connector;
  /** format: int32 */
  targetFundFundId?: number;
  targetFund?: __model.Fund;
}
