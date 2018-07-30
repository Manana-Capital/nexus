/* tslint:disable:max-line-length */
/**
 * v1
 * Mañana Capital - Nexus
 * http://manana.capital
 * info@manana.capital
 * undefined
 */

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import * as __model from '../model';

export interface ApiFundsPostParams {
  newFund?: __model.NewFundDto;
}

export interface AssignConnectorParams {
  fundConnector?: __model.FundConnectorDto;
}

@Injectable()
export class FundsService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsGet */
  apiFundsGet(): Observable<__model.FundSimpleInfo[]> {
    return this.http.get<__model.FundSimpleInfo[]>(`/api/funds`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsPost */
  apiFundsPost(params: ApiFundsPostParams): Observable<__model.FundSimpleInfo> {
    const bodyParams = params.newFund;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.FundSimpleInfo>(`/api/funds`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsComplexGet */
  complex(): Observable<__model.FundInfo[]> {
    return this.http.get<__model.FundInfo[]>(`/api/funds/complex`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsAssign-connectorPost */
  assignConnector(params: AssignConnectorParams): Observable<void> {
    const bodyParams = params.fundConnector;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<void>(`/api/funds/assign-connector`, bodyParamsWithoutUndefined);
  }
}
