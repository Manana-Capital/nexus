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
import {Observable} from 'rxjs/Observable';

import * as __model from '../model';

export interface ApiPortfolioByClientidGetParams {
  /** format: int32 */
  clientid: number;
}

@Injectable()
export class PortfolioService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Portfolio/ApiPortfolioGet */
  apiPortfolioGet(): Observable<__model.PortfolioInfo> {
    return this.http.get<__model.PortfolioInfo>(`/api/portfolio`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Portfolio/ApiPortfolioByClientidGet */
  apiPortfolioByClientidGet(params: ApiPortfolioByClientidGetParams): Observable<__model.PortfolioInfo> {
    const pathParams = {
      clientid: params.clientid,
    };
    return this.http.get<__model.PortfolioInfo>(`/api/portfolio/${pathParams.clientid}`);
  }
}
