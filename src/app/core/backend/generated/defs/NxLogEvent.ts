/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface NxLogEvent {
  /** format: date-time */
  timestamp?: string;
  log?: string;
  message?: string;
  /** format: int32 */
  level?: LevelNxLogEventEnum;
  levelString?: string;
  exceptionType?: string;
  exceptionMessage?: string;
  innerExceptionType?: string;
  innerExceptionMessage?: string;
  username?: string;
}

export type LevelNxLogEventEnum =
  '0' |
  '1' |
  '2' |
  '3' |
  '4' |
  '5';
