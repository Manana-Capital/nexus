/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface FundConnectorDto {
  /** format: int32 */
  connectorId?: number;
  /** format: int32 */
  targetFundId?: number;
  exchangeName?: string;
  displayName?: string;
  configuration?: object;
  isDisabled?: boolean;
  isLendingEnabled?: boolean;
}
