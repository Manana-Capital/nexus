import { Component, OnInit } from '@angular/core';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {NzMessageService} from 'ng-zorro-antd';
import {FundSimpleInfo} from '@core/backend/generated/defs/FundSimpleInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {ClientsService} from '@core/backend/generated/controllers/Clients';
import {FundConnectorDto} from '@core/backend/generated/defs/FundConnectorDto';
import {Balance} from '@core/backend/generated/defs/Balance';
import {ConnectorDefinitionDto} from '@core/backend/generated/defs/ConnectorDefinitionDto';
import {TotalBalance} from '@core/backend/generated/defs/TotalBalance';

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
  _checkedConnectorTotalBalance: TotalBalance;

  _isVisibleFundEdit = false;
  _isVisibleFundCreate = false;

  _isVisibleConnectorEdit = false;
  _isVisibleConnectorCreate = false;
  _isVisibleConnectorCheck = false;

  _isWorking = false;

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
    this._isWorking = true;
    this.fundsApi
      .apiFundsPut({fund: updatedFund})
      .subscribe(x => {
        this.msg.success(`Fund '${x.displayName}' was updated`);
        const current = this._funds.find(y => y.id === x.id);
        this._funds[this._funds.indexOf(current)] = Object.assign(current, x);
        this._isVisibleFundEdit = false;
        this._isWorking = false;
      }, () => this._isWorking = false);
  }

  onCreateFund(createdFund: FundSimpleInfo) {
    this._isWorking = true;
    this.fundsApi
      .apiFundsPost({newFund: createdFund})
      .subscribe(x => {
        this.msg.success(`Fund '${x.displayName}' was created`);
        this._funds = [...this._funds, x];
        this._isVisibleFundCreate = false;
        this._isWorking = false;
      }, () => this._isWorking = false);
  }

  editConnector(connector: FundConnectorDto) {
    this._selectedConnectorForEdit = connector;
    this._isVisibleConnectorEdit = true;
  }

  onSaveConnector(updatedConnector: FundConnectorDto) {
    this._isWorking = true;
    this.fundsApi
      .updateConnector({fundConnector: updatedConnector})
      .subscribe(x => {
        this.msg.success(`Connector '${x.displayName}' was updated`);
        const current = this._connectors.find(y => y.connectorId === x.connectorId);
        this._connectors[this._connectors.indexOf(current)] = Object.assign(current, x);
        this._isVisibleConnectorEdit = false;
        this._isWorking = false;
      }, () => this._isWorking = false);
  }

  onCreateConnector(createdConnector: FundConnectorDto, targetFund: FundSimpleInfo) {
    this._isWorking = true;
    createdConnector.targetFundId = targetFund.id;
    this.fundsApi
      .assignConnector({fundConnector: createdConnector})
      .subscribe(x => {
        createdConnector.connectorId = x;
        this.msg.success(`Connector '${createdConnector.displayName}' was assigned`);
        this._connectors = [...this._connectors, createdConnector];
        this._isVisibleConnectorCreate = false;
        this._isWorking = false;
      }, () => this._isWorking = false);
  }

  checkConnector(connector: FundConnectorDto) {
    const msgHandle = this.msg.loading(`Checking connector '${connector.exchangeName}'...`, {nzDuration: 1000 * 10});
    this._checkedConnectorBalance = null;
    this._checkedConnectorTotalBalance = null;
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

  checkConnectorTotal(connector: FundConnectorDto) {
    const msgHandle = this.msg.loading(`Checking connector total '${connector.exchangeName}'...`, {nzDuration: 1000 * 10});
    this.fundsApi
      .total({connectorid: connector.connectorId})
      .subscribe(total => {
        this._checkedConnectorTotalBalance = total;
        this.msg.remove(msgHandle.messageId);
      }, error => {
        this.msg.remove(msgHandle.messageId);
      });
  }
}
