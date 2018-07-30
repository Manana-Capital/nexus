/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface TotalBalanceDto {
  exchangeName?: string;
  /** format: date-time */
  gatheredCurrent?: string;
  /** format: date-time */
  gatheredPrevious?: string;
  /** format: double */
  amountBtc?: number;
  /** format: double */
  amountUsd?: number;
  /** format: double */
  amountCzk?: number;
  /** format: double */
  changeAmountBtc?: number;
  /** format: double */
  changePercent?: number;
  /** format: double */
  changePercentBigBang?: number;
}
