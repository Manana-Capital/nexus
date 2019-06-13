/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface WithdrawalDto {
  /** format: int32 */
  clientId?: number;
  /** format: int32 */
  targetFundId?: number;
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
  preview?: boolean;
}
