/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface StatsDto {
  activeExchanges?: string[];
  /** format: int32 */
  activeBots?: number;
  /** format: int32 */
  tradedTransactionsCount?: number;
  /** format: double */
  tradedAmountBtc?: number;
  /** format: double */
  tradedAmountUsd?: number;
  /** format: date-time */
  tradedFrom?: string;
  /** format: date-time */
  tradedTo?: string;
}
