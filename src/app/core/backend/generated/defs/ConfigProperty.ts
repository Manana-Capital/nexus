/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import * as __model from '../model';

export interface ConfigProperty {
  name?: string;
  /** format: int32 */
  type?: TypeConfigPropertyEnum;
  isArray?: boolean;
  children?: __model.ConfigProperty[];
}

export type TypeConfigPropertyEnum =
  '0' |
  '1' |
  '2' |
  '3';
