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

@Injectable()
export class PortfolioService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Portfolio/ApiPortfolioGet */
  portfolio(): Observable<__model.PortfolioInfo> {
    return this.http.get<__model.PortfolioInfo>(`/api/portfolio`);
  }
}
