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

export interface ApiFundsPutParams {
  fund?: __model.FundSimpleInfo;
}

export interface ApiFundsPostParams {
  newFund?: __model.NewFundDto;
}

export interface ApiFundsComplexByFundidGetParams {
  /** format: int32 */
  fundid: number;
}

export interface ConnectorsParams {
  /** format: int32 */
  fundid: number;
}

export interface AssignConnectorParams {
  fundConnector?: __model.FundConnectorDto;
}

export interface UpdateConnectorParams {
  fundConnector?: __model.FundConnectorDto;
}

export interface CheckConnectorParams {
  /** format: int32 */
  connectorid: number;
}

export interface TotalParams {
  /** format: int32 */
  connectorid: number;
}

export interface ApiFundsBalancesByConnectoridGetParams {
  /** format: int32 */
  connectorid: number;
}

export interface ApiFundsBalancesByConnectoridByCurrencyGetParams {
  /** format: int32 */
  connectorid: number;
  currency: string;
}

@Injectable()
export class FundsService {
  constructor(private http: HttpClient) {}

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsGet */
  apiFundsGet(): Observable<__model.FundSimpleInfo[]> {
    return this.http.get<__model.FundSimpleInfo[]>(`/api/funds`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsPut */
  apiFundsPut(params: ApiFundsPutParams): Observable<__model.FundSimpleInfo> {
    const bodyParams = params.fund;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.put<__model.FundSimpleInfo>(`/api/funds`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsPost */
  apiFundsPost(params: ApiFundsPostParams): Observable<__model.FundSimpleInfo> {
    const bodyParams = params.newFund;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.FundSimpleInfo>(`/api/funds`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsComplexGet */
  apiFundsComplexGet(): Observable<__model.FundInfo[]> {
    return this.http.get<__model.FundInfo[]>(`/api/funds/complex`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsComplexByFundidGet */
  apiFundsComplexByFundidGet(params: ApiFundsComplexByFundidGetParams): Observable<__model.FundInfo> {
    const pathParams = {
      fundid: params.fundid,
    };
    return this.http.get<__model.FundInfo>(`/api/funds/complex/${pathParams.fundid}`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsConnectorsDefinitionGet */
  definition(): Observable<__model.ConnectorDefinitionDto[]> {
    return this.http.get<__model.ConnectorDefinitionDto[]>(`/api/funds/connectors/definition`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsConnectorsByFundidGet */
  connectors(params: ConnectorsParams): Observable<__model.FundConnectorDto[]> {
    const pathParams = {
      fundid: params.fundid,
    };
    return this.http.get<__model.FundConnectorDto[]>(`/api/funds/connectors/${pathParams.fundid}`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsAssign-connectorPost */
  assignConnector(params: AssignConnectorParams): Observable<number> {
    const bodyParams = params.fundConnector;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<number>(`/api/funds/assign-connector`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsUpdate-connectorPost */
  updateConnector(params: UpdateConnectorParams): Observable<__model.FundConnectorDto> {
    const bodyParams = params.fundConnector;
    const bodyParamsWithoutUndefined: any = {};
    Object.entries(bodyParams || {}).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) bodyParamsWithoutUndefined[key] = value;
    });
    return this.http.post<__model.FundConnectorDto>(`/api/funds/update-connector`, bodyParamsWithoutUndefined);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsCheck-connectorByConnectoridPost */
  checkConnector(params: CheckConnectorParams): Observable<__model.Balance[]> {
    const pathParams = {
      connectorid: params.connectorid,
    };
    return this.http.post<__model.Balance[]>(`/api/funds/check-connector/${pathParams.connectorid}`, {});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsCheck-connectorTotalByConnectoridPost */
  total(params: TotalParams): Observable<__model.TotalBalance> {
    const pathParams = {
      connectorid: params.connectorid,
    };
    return this.http.post<__model.TotalBalance>(`/api/funds/check-connector/total/${pathParams.connectorid}`, {});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsAll-status-connectorsPost */
  allStatusConnectors(): Observable<string[]> {
    return this.http.post<string[]>(`/api/funds/all-status-connectors`, {});
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsBalancesGet */
  apiFundsBalancesGet(): Observable<__model.FundTotalBalanceInfo[]> {
    return this.http.get<__model.FundTotalBalanceInfo[]>(`/api/funds/balances`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsBalancesByConnectoridGet */
  apiFundsBalancesByConnectoridGet(params: ApiFundsBalancesByConnectoridGetParams): Observable<__model.FundBalancePerExchange[]> {
    const pathParams = {
      connectorid: params.connectorid,
    };
    return this.http.get<__model.FundBalancePerExchange[]>(`/api/funds/balances/${pathParams.connectorid}`);
  }

  /** http://undefined/swagger/swagger-ui.html#!/Funds/ApiFundsBalancesByConnectoridByCurrencyGet */
  apiFundsBalancesByConnectoridByCurrencyGet(params: ApiFundsBalancesByConnectoridByCurrencyGetParams): Observable<__model.FundBalance[]> {
    const pathParams = {
      connectorid: params.connectorid,
      currency: params.currency,
    };
    return this.http.get<__model.FundBalance[]>(`/api/funds/balances/${pathParams.connectorid}/${pathParams.currency}`);
  }
}
