/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface PortfolioFundInfo {
  fund?: __model.FundSimpleInfo;
  /** format: double */
  shares?: number;
  /** format: double */
  profitUsd?: number;
  /** format: double */
  profitBtc?: number;
  /** format: double */
  profitCzk?: number;
  /** format: double */
  assetsUsd?: number;
  /** format: double */
  assetsBtc?: number;
  /** format: double */
  assetsCzk?: number;
  deposits?: __model.PortfolioTransaction[];
  withdrawals?: __model.PortfolioTransaction[];
}
