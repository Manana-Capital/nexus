/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface Fund {
  /** format: int32 */
  fundId?: number;
  key?: string;
  displayName?: string;
  description?: string;
  owner?: __model.FundClient;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  checkCronInterval?: string;
  /** format: int32 */
  ordering?: number;
  deposits?: __model.ClientDeposit[];
  withdrawals?: __model.ClientWithdrawal[];
  connectors?: __model.Connector[];
}
