/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface FundInfo {
  pricePerShare?: __model.FundPricePerShare;
  performance?: __model.FundPerformance;
  ticks?: __model.FundPriceTick[];
  btcTicks?: __model.BtcPriceTick[];
  performanceYears?: __model.FundPerformanceYear[];
  /** format: int32 */
  id?: number;
  key?: string;
  displayName?: string;
  description?: string;
  /** format: int32 */
  owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  checkCronInterval?: string;
  /** format: int32 */
  ordering?: number;
}
