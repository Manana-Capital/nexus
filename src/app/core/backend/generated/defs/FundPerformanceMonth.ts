/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface FundPerformanceMonth {
  /** format: date-time */
  gathered?: string;
  /** format: double */
  change?: number;
  /** format: double */
  changeBtc?: number;
  /** format: double */
  readonly btcOutperform?: number;
}
