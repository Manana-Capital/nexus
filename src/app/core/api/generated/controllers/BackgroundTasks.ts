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

@Injectable()
export class BackgroundTasksService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/BackgroundTasks/ApiBackgroundTasksUpdate-tasksPost */
  updateTasks(): Observable<void> {
    return this.http.post<void>(`/api/backgroundtasks/update-tasks`, {});
  }
}
