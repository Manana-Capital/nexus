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

export interface AccountAccessDeniedGetParams {
  returnUrl?: string;
}

export interface AccountAccessDeniedPutParams {
  returnUrl?: string;
}

export interface AccountAccessDeniedPostParams {
  returnUrl?: string;
}

@Injectable()
export class AccountService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Account/AccountAccessDeniedGet */
  accountAccessDeniedGet(params: AccountAccessDeniedGetParams): Observable<void> {
    const queryParamBase = {
      returnUrl: params.returnUrl,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else if (Array.isArray(value)) value.forEach(v => queryParams = queryParams.append(key, v));
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.get<void>(`/account/accessdenied`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Account/AccountAccessDeniedPut */
  accountAccessDeniedPut(params: AccountAccessDeniedPutParams): Observable<void> {
    const queryParamBase = {
      returnUrl: params.returnUrl,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else if (Array.isArray(value)) value.forEach(v => queryParams = queryParams.append(key, v));
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.put<void>(`/account/accessdenied`, {}, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Account/AccountAccessDeniedPost */
  accountAccessDeniedPost(params: AccountAccessDeniedPostParams): Observable<void> {
    const queryParamBase = {
      returnUrl: params.returnUrl,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else if (Array.isArray(value)) value.forEach(v => queryParams = queryParams.append(key, v));
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.post<void>(`/account/accessdenied`, {}, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Account/AccountAccessDeniedDelete */
  accountAccessDeniedDelete(): Observable<void> {
    return this.http.delete<void>(`/account/accessdenied`);
  }
}
