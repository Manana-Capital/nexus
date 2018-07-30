/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import * as __model from '../model';

export interface LastBalancesParams {
  /** format: int32 */
  fundId?: number;
}

export interface LastTotalBalancesParams {
  /** format: int32 */
  fundId?: number;
}

@Injectable()
export class PortfolioService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Portfolio/ApiPortfolioLast-balancesGet */
  lastBalances(params: LastBalancesParams): Observable<__model.PortfolioBalance[]> {
    const queryParamBase = {
      fundId: params.fundId,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<__model.PortfolioBalance[]>(`/api/portfolio/last-balances`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Portfolio/ApiPortfolioLast-total-balancesGet */
  lastTotalBalances(params: LastTotalBalancesParams): Observable<__model.TotalBalanceDto[]> {
    const queryParamBase = {
      fundId: params.fundId,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<__model.TotalBalanceDto[]>(`/api/portfolio/last-total-balances`, {params: queryParams});
  }
}
