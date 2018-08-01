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

export interface ApiProfilePutParams {
  dto?: __model.UpdateProfileDto;
}

export interface ApiProfileByClientidGetParams {
  /** format: int32 */
  clientid: number;
}

export interface ChangePasswordParams {
  dto?: __model.UpdateProfilePasswordDto;
}

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Profile/ApiProfileGet */
  apiProfileGet(): Observable<__model.ProfileInfoDto> {
    return this.http.get<__model.ProfileInfoDto>(`/api/profile`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Profile/ApiProfilePut */
  apiProfilePut(params: ApiProfilePutParams): Observable<__model.ProfileInfoDto> {
    const bodyParams = params.dto;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.put<__model.ProfileInfoDto>(`/api/profile`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Profile/ApiProfileByClientidGet */
  apiProfileByClientidGet(params: ApiProfileByClientidGetParams): Observable<__model.ProfileInfoDto> {
    const pathParams = {
      clientid: params.clientid,
    };
    return this.http.get<__model.ProfileInfoDto>(`/api/profile/${pathParams.clientid}`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Profile/ApiProfileChange-passwordPut */
  changePassword(params: ChangePasswordParams): Observable<void> {
    const bodyParams = params.dto;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.put<void>(`/api/profile/change-password`, bodyParamsWithoutUndefined);
  }
}
