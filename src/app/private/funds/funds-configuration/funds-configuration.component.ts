import { Component, OnInit } from '@angular/core';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {NzMessageService} from 'ng-zorro-antd';
import {FundSimpleInfo} from '@core/backend/generated/defs/FundSimpleInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {ClientsService} from '@core/backend/generated/controllers/Clients';
import {FundConnectorDto} from '@core/backend/generated/defs/FundConnectorDto';

@Component({
  selector: 'nx-funds-configuration',
  templateUrl: './funds-configuration.component.html',
  styleUrls: ['./funds-configuration.component.less']
})
export class FundsConfigurationComponent implements OnInit {

  _loading = true;
  _funds: FundSimpleInfo[] = [];
  _selectedFund: FundSimpleInfo;

  _allClients: FundClient[] = [];
  _connectors: FundConnectorDto[] = [];

  constructor(
    private fundsApi: FundsService,
    private clientApi: ClientsService,
    public msg: NzMessageService) {
  }

  ngOnInit() {
    this.clientApi.clients().subscribe(x => {
      this._allClients = x;
      this.loadFundsInfo();
    });
  }

  getClientName(clientId): string {
    const found = this._allClients.find(x => x.fundClientId === clientId);
    if (!found) {
      return 'Unknown';
    }
    return `${found.firstName} ${found.lastName}`;
  }

  refreshData() {
    this.loadFundsInfo();
  }

  private loadFundsInfo() {
    this._funds = [];
    this._selectedFund = null;
    this._connectors = [];
    this._loading = true;
    this.fundsApi.apiFundsGet()
      .subscribe(data => {
        this._funds = data;
        this._loading = false;
      });
  }

  onFundSelected(fund: FundSimpleInfo) {
    if (this._selectedFund === fund) {
      // do nothing
      return;
    }

    this._selectedFund = fund;

    if (!this._selectedFund) {
      this._connectors = [];
      return;
    }

    this.fundsApi
      .connectors({fundid: this._selectedFund.id})
      .subscribe(x => this._connectors = x);
  }
}
