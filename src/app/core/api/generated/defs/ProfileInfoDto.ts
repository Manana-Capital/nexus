/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface ProfileInfoDto {
  /** format: int32 */
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  /** format: date-time */
  registered?: string;
  isSystem?: boolean;
  /** format: int32 */
  commisionPerc?: number;
  username?: string;
  roles?: string[];
}
