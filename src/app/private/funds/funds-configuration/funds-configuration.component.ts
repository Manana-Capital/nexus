import { Component, OnInit } from '@angular/core';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {NzMessageService} from 'ng-zorro-antd';
import {FundSimpleInfo} from '@core/backend/generated/defs/FundSimpleInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {ClientsService} from '@core/backend/generated/controllers/Clients';
import {FundConnectorDto} from '@core/backend/generated/defs/FundConnectorDto';
import {Balance} from '@core/backend/generated/defs/Balance';
import {ConnectorDefinitionDto} from '@core/backend/generated/defs/ConnectorDefinitionDto';

@Component({
  selector: 'nx-funds-configuration',
  templateUrl: './funds-configuration.component.html',
  styleUrls: ['./funds-configuration.component.less']
})
export class FundsConfigurationComponent implements OnInit {

  _loading = true;
  _loadingConnectors = false;
  _funds: FundSimpleInfo[] = [];
  _selectedFund: FundSimpleInfo;
  _selectedFundForEdit: FundSimpleInfo;
  _selectedConnectorForEdit: FundConnectorDto;

  _allClients: FundClient[] = [];

  _connectorsDefs: ConnectorDefinitionDto[] = [];
  _connectors: FundConnectorDto[] = [];

  _checkedConnector: FundConnectorDto;
  _checkedConnectorBalance: Balance[];

  _isVisibleFundEdit = false;
  _isVisibleConnectorEdit = false;
  _isVisibleConnectorCheck = false;

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
    this.fundsApi.definition().subscribe(x => this._connectorsDefs = x);
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
        this._loadingConnectors = false;
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

    this._loadingConnectors = true;
    this.fundsApi
      .connectors({fundid: this._selectedFund.id})
      .subscribe(x => {
        this._connectors = x;
        this._loadingConnectors = false;
      });
  }

  editFund(fund: FundSimpleInfo) {
    this._selectedFundForEdit = fund;
    this._isVisibleFundEdit = true;
  }

  onSaveFund(updatedFund: FundSimpleInfo) {
    this.fundsApi
      .apiFundsPut({fund: updatedFund})
      .subscribe(x => {
        this.msg.success(`Fund '${x.displayName}' was updated`);
        this._isVisibleFundEdit = false;
      });
  }

  editConnector(connector: FundConnectorDto) {
    this._selectedConnectorForEdit = connector;
    this._isVisibleConnectorEdit = true;
  }

  onSaveConnector(updatedConnector: FundConnectorDto) {
    this.fundsApi
      .updateConnector({fundConnector: updatedConnector})
      .subscribe(x => {
        this.msg.success(`Connector '${x.displayName}' was updated`);
        this._isVisibleConnectorEdit = false;
      });
  }

  checkConnector(connector: FundConnectorDto) {
    const msgHandle = this.msg.loading(`Checking connector '${connector.exchangeName}'...`, {nzDuration: 1000 * 10});
    this.fundsApi
      .checkConnector({connectorid: connector.connectorId})
      .subscribe(balances => {
        this._checkedConnector = connector;
        this._checkedConnectorBalance = balances;
        this.msg.remove(msgHandle.messageId);
        this._isVisibleConnectorCheck = true;
      }, error => {
        this.msg.remove(msgHandle.messageId);
      });
  }
}
