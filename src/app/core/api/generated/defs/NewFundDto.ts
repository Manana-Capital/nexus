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
  description?: string;
  /** format: int32 */
  owner?: number;
  isPublic?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isUnderConstruction?: boolean;
  /** format: int32 */
  ordering?: number;
  checkCronInterval?: string;
}
