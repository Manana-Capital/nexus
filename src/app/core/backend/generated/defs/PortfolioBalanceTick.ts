/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface PortfolioBalanceTick {
  /** format: date-time */
  timestamp?: string;
  /** format: double */
  shares?: number;
  /** format: double */
  valueBtc?: number;
  /** format: double */
  valueUsd?: number;
  /** format: double */
  valueCzk?: number;
  /** format: double */
  depositedBtc?: number;
  /** format: double */
  depositedUsd?: number;
  /** format: double */
  depositedCzk?: number;
}
