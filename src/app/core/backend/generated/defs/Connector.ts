/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface Connector {
  /** format: int32 */
  connectorId?: number;
  exchangeName?: string;
  displayName?: string;
  configuration?: string;
  isDisabled?: boolean;
  isLendingEnabled?: boolean;
  /** format: int32 */
  targetFundFundId?: number;
  targetFund?: __model.Fund;
  balances?: __model.PortfolioBalance[];
  totalBalances?: __model.PortfolioTotalBalance[];
}
