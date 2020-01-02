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
import {Observable} from 'rxjs';

import * as __model from '../model';

export interface SharesParams {
  /** format: int32 */
  fundId?: number;
}

export interface PricePerDayParams {
  /** format: int32 */
  fundId?: number;
}

export interface PriceLatestParams {
  /** format: int32 */
  fundId?: number;
}

@Injectable()
export class SharesService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Shares/ApiSharesGet */
  shares(params: SharesParams): Observable<__model.SharesSimpleInfo> {
    const queryParamBase = {
      fundId: params.fundId,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<__model.SharesSimpleInfo>(`/api/shares`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Shares/ApiSharesPrice-per-dayGet */
  pricePerDay(params: PricePerDayParams): Observable<__model.PricePerShare[]> {
    const queryParamBase = {
      fundId: params.fundId,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<__model.PricePerShare[]>(`/api/shares/price-per-day`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Shares/ApiSharesPrice-latestGet */
  priceLatest(params: PriceLatestParams): Observable<__model.PricePerShare> {
    const queryParamBase = {
      fundId: params.fundId,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<__model.PricePerShare>(`/api/shares/price-latest`, {params: queryParams});
  }
}
