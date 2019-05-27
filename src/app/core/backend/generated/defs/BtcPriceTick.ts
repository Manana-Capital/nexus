/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

export interface BtcPriceTick {
  /** format: date-time */
  timestamp?: string;
  /** format: double */
  pricePerShare?: number;
  /** format: double */
  open?: number;
  /** format: double */
  close?: number;
  /** format: double */
  high?: number;
  /** format: double */
  low?: number;
  /** format: double */
  volume?: number;
}
