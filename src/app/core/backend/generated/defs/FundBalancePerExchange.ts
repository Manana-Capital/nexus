/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface FundBalancePerExchange {
  /** format: int32 */
  connectorId?: number;
  exchangeName?: string;
  exchangeDisplayName?: string;
  balances?: __model.FundBalance[];
  /** format: date-time */
  gathered?: string;
  /** format: double */
  amountUsd?: number;
  /** format: double */
  amountBtc?: number;
  /** format: double */
  amountCzk?: number;
  /** format: double */
  shares?: number;
}
