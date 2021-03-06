/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface PortfolioTransaction {
  /** format: int32 */
  clientId?: number;
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
  /** format: int32 */
  targetFundId?: number;
  targetFundDisplayName?: string;
}
