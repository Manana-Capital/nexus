/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface FundPerformanceYear {
  /** format: int32 */
  year?: number;
  /** format: double */
  yearChange?: number;
  /** format: double */
  yearChangeBtc?: number;
  /** format: double */
  readonly btcOutperform?: number;
  months?: __model.FundPerformanceMonth[];
}
