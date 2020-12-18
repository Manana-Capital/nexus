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

@Injectable()
export class PricesService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Prices/ApiPricesGet */
  prices(): Observable<__model.PricesDto> {
    return this.http.get<__model.PricesDto>(`/api/prices`);
  }
}
