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

export interface ApiClientsDepositsGetParams {
  /** format: int32 */
  fundId?: number;
}

export interface ApiClientsDepositsPostParams {
  deposit?: __model.DepositDto;
}

export interface ApiClientsWithdrawalsGetParams {
  /** format: int32 */
  fundId?: number;
}

export interface ApiClientsWithdrawalsPostParams {
  withdrawal?: __model.WithdrawalDto;
}

export interface SharesCountParams {
  /** format: int32 */
  fundId?: number;
}

export interface TransferParams {
  transfer?: __model.TransferSharesDto;
}

export interface ChangeUsernamePasswordParams {
  /** format: int32 */
  clientId?: number;
  newUsername?: string;
  newPassword?: string;
}

export interface ChangeRolesParams {
  /** format: int32 */
  clientId?: number;
  roles?: string[];
}

export interface CreateParams {
  dto?: __model.UpdateProfileExtendedDto;
}

export interface RemoveParams {
  /** format: int32 */
  clientid: number;
}

@Injectable()
export class ClientsService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsGet */
  clients(): Observable<__model.FundClient[]> {
    return this.http.get<__model.FundClient[]>(`/api/clients`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsWith-transactionsGet */
  withTransactions(): Observable<__model.FundClient[]> {
    return this.http.get<__model.FundClient[]>(`/api/clients/with-transactions`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsDepositsGet */
  apiClientsDepositsGet(params: ApiClientsDepositsGetParams): Observable<__model.ClientDeposit[]> {
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

    return this.http.get<__model.ClientDeposit[]>(`/api/clients/deposits`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsDepositsPost */
  apiClientsDepositsPost(params: ApiClientsDepositsPostParams): Observable<__model.DepositDto> {
    const bodyParams = params.deposit;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.DepositDto>(`/api/clients/deposits`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsWithdrawalsGet */
  apiClientsWithdrawalsGet(params: ApiClientsWithdrawalsGetParams): Observable<__model.ClientWithdrawal[]> {
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

    return this.http.get<__model.ClientWithdrawal[]>(`/api/clients/withdrawals`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsWithdrawalsPost */
  apiClientsWithdrawalsPost(params: ApiClientsWithdrawalsPostParams): Observable<__model.WithdrawalDto> {
    const bodyParams = params.withdrawal;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.WithdrawalDto>(`/api/clients/withdrawals`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsShares-countGet */
  sharesCount(params: SharesCountParams): Observable<number> {
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

    return this.http.get<number>(`/api/clients/shares-count`, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsSharesTransferPost */
  transfer(params: TransferParams): Observable<__model.TransferSharesDto> {
    const bodyParams = params.transfer;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.TransferSharesDto>(`/api/clients/shares/transfer`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsChange-username-passwordPost */
  changeUsernamePassword(params: ChangeUsernamePasswordParams): Observable<void> {
    const queryParamBase = {
      clientId: params.clientId,
      newUsername: params.newUsername,
      newPassword: params.newPassword,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.post<void>(`/api/clients/change-username-password`, {}, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsChange-rolesPost */
  changeRoles(params: ChangeRolesParams): Observable<void> {
    const queryParamBase = {
      clientId: params.clientId,
      roles: params.roles,
    };

    let queryParams = new HttpParams();
    Object.entries(queryParamBase).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'string') queryParams = queryParams.set(key, value);
        else queryParams = queryParams.set(key, JSON.stringify(value));
      }
    });

    return this.http.post<void>(`/api/clients/change-roles`, {}, {params: queryParams});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsCreatePost */
  create(params: CreateParams): Observable<__model.ProfileInfoDto> {
    const bodyParams = params.dto;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.ProfileInfoDto>(`/api/clients/create`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Clients/ApiClientsRemoveByClientidDelete */
  remove(params: RemoveParams): Observable<__model.ProfileInfoDto> {
    const pathParams = {
      clientid: params.clientid,
    };
    return this.http.delete<__model.ProfileInfoDto>(`/api/clients/remove/${pathParams.clientid}`);
  }
}
