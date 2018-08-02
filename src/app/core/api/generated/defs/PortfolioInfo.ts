/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface PortfolioInfo {
  client?: __model.ProfileInfoDto;
  /** format: int32 */
  activeFunds?: number;
  /** format: int32 */
  totalFunds?: number;
  /** format: int32 */
  accountAgeDays?: number;
  /** format: double */
  totalProfitUsd?: number;
  /** format: double */
  totalProfitBtc?: number;
  /** format: double */
  totalProfitCzk?: number;
  /** format: double */
  totalAssetsUsd?: number;
  /** format: double */
  totalAssetsBtc?: number;
  /** format: double */
  totalAssetsCzk?: number;
}
