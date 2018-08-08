/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface ClientWithdrawal {
  /** format: int32 */
  clientWithdrawalId?: number;
  /** format: date-time */
  created?: string;
  /** format: double */
  shares?: number;
  /** format: double */
  amountUsd?: number;
  /** format: double */
  amountBtc?: number;
  /** format: double */
  amountCzk?: number;
  note?: string;
  client?: __model.FundClient;
  /** format: int32 */
  targetFundFundId?: number;
  targetFund?: __model.Fund;
}
