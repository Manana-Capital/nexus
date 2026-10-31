import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as m from './model';

/** Client of the Nexus REST API. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.backendUrl.replace(/\/$/, '');

  // funds
  fundsSimple = () => this.http.get<m.FundSimpleInfo[]>(`${this.base}/api/funds`);
  fundsComplex = () => this.http.get<m.FundInfo[]>(`${this.base}/api/funds/complex`);
  createFund = (dto: m.NewFundDto) => this.http.post<m.FundSimpleInfo>(`${this.base}/api/funds`, dto);
  updateFund = (fund: m.FundSimpleInfo) => this.http.put<m.FundSimpleInfo>(`${this.base}/api/funds`, fund);
  fundBalances = () => this.http.get<m.FundTotalBalanceInfo[]>(`${this.base}/api/funds/balances`);
  connectorHistory = (connectorId: number) =>
    this.http.get<m.FundBalancePerExchange[]>(`${this.base}/api/funds/balances/${connectorId}`);
  connectorStatuses = () => this.http.get<m.ConnectorStatusDto[]>(`${this.base}/api/funds/connectors/status`);
  connectorDefinitions = () => this.http.get<m.ConnectorDefinitionDto[]>(`${this.base}/api/funds/connectors/definition`);
  connectors = (fundId: number) => this.http.get<m.FundConnectorDto[]>(`${this.base}/api/funds/connectors/${fundId}`);
  assignConnector = (dto: m.FundConnectorDto) => this.http.post<number>(`${this.base}/api/funds/assign-connector`, dto);
  updateConnector = (dto: m.FundConnectorDto) => this.http.post<m.FundConnectorDto>(`${this.base}/api/funds/update-connector`, dto);
  checkConnector = (id: number) => this.http.post<m.Balance[]>(`${this.base}/api/funds/check-connector/${id}`, null);
  checkConnectorTotal = (id: number) => this.http.post<m.TotalBalance>(`${this.base}/api/funds/check-connector/total/${id}`, null);
  updateBackgroundTasks = () => this.http.post<void>(`${this.base}/api/backgroundtasks/update-tasks`, null);

  // public
  prices = () => this.http.get<m.PricesDto>(`${this.base}/api/prices`);
  statistics = () => this.http.get<m.StatsDto>(`${this.base}/api/statistics`);

  // portfolio
  portfolio = () => this.http.get<m.PortfolioInfo>(`${this.base}/api/portfolio`);
  portfolioOf = (clientId: number) => this.http.get<m.PortfolioInfo>(`${this.base}/api/portfolio/${clientId}`);
  portfolios = () => this.http.get<m.PortfolioInfo[]>(`${this.base}/api/portfolio/all`);

  // profile
  profile = () => this.http.get<m.ProfileInfoDto>(`${this.base}/api/profile`);
  updateProfile = (dto: m.UpdateProfileDto) => this.http.put<m.ProfileInfoDto>(`${this.base}/api/profile`, dto);
  updateProfileOf = (userId: number, dto: m.UpdateProfileExtendedDto) =>
    this.http.put<m.ProfileInfoDto>(`${this.base}/api/profile/update/${userId}`, dto);
  changePassword = (dto: m.UpdateProfilePasswordDto) => this.http.put<void>(`${this.base}/api/profile/change-password`, dto);
  changePasswordOf = (userId: number, dto: m.UpdateProfilePasswordDto) =>
    this.http.put<void>(`${this.base}/api/profile/change-password/${userId}`, dto);

  // clients
  clients = () => this.http.get<m.FundClient[]>(`${this.base}/api/clients`);
  sharesCount = (fundId: number) =>
    this.http.get<number>(`${this.base}/api/clients/shares-count`, { params: new HttpParams().set('fundId', fundId) });
  createClient = (dto: m.UpdateProfileExtendedDto) => this.http.post<m.ProfileInfoDto>(`${this.base}/api/clients/create`, dto);
  removeClient = (clientId: number) => this.http.delete<m.ProfileInfoDto>(`${this.base}/api/clients/remove/${clientId}`);
  deposit = (dto: m.DepositDto) => this.http.post<m.DepositDto>(`${this.base}/api/clients/deposits`, dto);
  withdraw = (dto: m.WithdrawalDto) => this.http.post<m.WithdrawalDto>(`${this.base}/api/clients/withdrawals`, dto);
  transferShares = (dto: m.TransferSharesDto) => this.http.post<m.TransferSharesDto>(`${this.base}/api/clients/shares/transfer`, dto);

  // system
  logs = () => this.http.get<m.NxLogEvent[]>(`${this.base}/api/system/logs`);
}
