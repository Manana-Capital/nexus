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
export class SystemService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/System/ApiSystemLogsGet */
  logs(): Observable<__model.NxLogEvent[]> {
    return this.http.get<__model.NxLogEvent[]>(`/api/system/logs`);
  }
}
