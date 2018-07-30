/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface FundClient {
  /** format: int32 */
  fundClientId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  /** format: date-time */
  registered?: string;
  isSystem?: boolean;
  /** format: int32 */
  commisionPerc?: number;
  username?: string;
  password?: string;
  roles?: string[];
  deposits?: __model.ClientDeposit[];
  withdrawals?: __model.ClientWithdrawal[];
}
