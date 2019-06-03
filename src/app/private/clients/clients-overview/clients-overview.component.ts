import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '@core/backend/generated/controllers/Portfolio';
import {PortfolioInfo} from '@core/backend/generated/defs/PortfolioInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {NzMessageService} from 'ng-zorro-antd';
import {ProfileService} from '@core/backend/generated/controllers/Profile';
import {ClientsService} from '@core/backend/generated/controllers/Clients';

@Component({
  selector: 'nx-clients-overview',
  templateUrl: './clients-overview.component.html',
  styleUrls: ['./clients-overview.component.less']
})
export class ClientsOverviewComponent implements OnInit {

  _data: PortfolioInfo[];
  _loading: boolean = false;

  _isVisibleEditProfile = false;
  _isVisibleEditAccess = false;
  _isVisibleCreateClient = false;
  _selectedPortfolio: PortfolioInfo;

  constructor(
    private portfolioService: PortfolioService,
    private profileService: ProfileService,
    private clientService: ClientsService,
    public msg: NzMessageService
  ) {
    this.refreshData();
  }

  ngOnInit() {
  }

  refreshData() {
    this._loading = true;
    this._data = [];
    this.portfolioService.all().subscribe(x => {
      this._data = x;
      this._loading = false;
    });
  }

  getClientDisplay(client: FundClient) {
    if(!client)
      return 'undefined';
    if(client.email)
      return client.firstName + ' ' + client.lastName + ' (' + client.email + ')'
    return client.firstName + ' ' + client.lastName;
  }

  showEditProfile(portfolio) {
    this._selectedPortfolio = portfolio;
    this._isVisibleEditProfile = true;
  }

  showEditAccess(portfolio) {
    this._selectedPortfolio = portfolio;
    this._isVisibleEditAccess = true;
  }

  showCreateClient() {
    this._isVisibleCreateClient = true;
  }

  profileSave(value) {
    this.profileService.update({
      userid: this._selectedPortfolio.client.id,
      dto: value
    })
      .subscribe(response => {
        const client = this._selectedPortfolio.client;
        client.firstName = response.firstName;
        client.lastName = response.lastName;
        client.email = response.email;
        client.username = response.username;
        client.roles = response.roles;
        this.msg.success(`Profile for ${client.firstName} ${client.lastName} was updated`);
        this._isVisibleEditProfile = false;
      });
  }

  createClient(value) {
    this.clientService.create({
      dto: value
    })
      .subscribe(response => {
        this.portfolioService.apiPortfolioByClientidGet({
          clientid: response.id
        })
          .subscribe(portfolioResponse => {
            this._data.push(portfolioResponse);
          });
        this.msg.success(`Account for ${response.firstName} ${response.lastName} was created`);
        this._isVisibleCreateClient = false;
      });
  }

  removeClient(portfolio: PortfolioInfo) {
    const clientId = portfolio.client.id;
    this.clientService.remove({
      clientid: clientId
    }).subscribe(response => {
      const found = this._data.find(x => x.client.id == response.id);
      if(found) {
        const index = this._data.indexOf(found);
        this._data.splice(index, 1);
      }
      this.msg.success(`Account for ${response.firstName} ${response.lastName} was removed`);
    });
  }

  accessSave(value) {
    this.profileService.apiProfileChangePasswordByUseridPut({
      userid: this._selectedPortfolio.client.id,
      dto: value
    })
      .subscribe(() => {
        const client = this._selectedPortfolio.client;
        client.username = value.newUsername;
        this.msg.success(`Username and password for ${client.firstName} ${client.lastName} was changed`);
        this._isVisibleEditAccess = false;
      });
  }
}
