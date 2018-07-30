/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface NewFundDto {
  key?: string;
  displayName?: string;
  /** format: int32 */
  owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  checkCronInterval?: string;
}
