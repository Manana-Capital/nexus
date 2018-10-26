import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '@core/api/generated/controllers/Portfolio';
import {PortfolioInfo} from '@core/api/generated/defs/PortfolioInfo';
import {FundClient} from '@core/api/generated/defs/FundClient';
import {NzMessageService} from 'ng-zorro-antd';
import {ProfileService} from '@core/api/generated/controllers/Profile';

@Component({
  selector: 'nx-clients-overview',
  templateUrl: './clients-overview.component.html',
  styleUrls: ['./clients-overview.component.less']
})
export class ClientsOverviewComponent implements OnInit {

  _data: PortfolioInfo[];
  _loading: boolean = false;

  _isVisibleEditProfile = false;
  _isVisibleEditAccount = false;
  _selectedPortfolio: PortfolioInfo;

  constructor(
    private portfolioService: PortfolioService,
    private profileService: ProfileService,
    public msg: NzMessageService
  ) {
    this._loading = true;
    this.portfolioService.all().subscribe(x => {
      this._data = x;
      this._loading = false;
    });
  }

  ngOnInit() {
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

  showEditAccount(portfolio) {
    this._selectedPortfolio = portfolio;
    this._isVisibleEditAccount = true;
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
        this.msg.success(`Profile for ${client.firstName} ${client.lastName} was updated`);
        this._isVisibleEditProfile = false;
      });
  }

  accountSave(value) {
    this.profileService.apiProfileChangePasswordByUseridPut({
      userid: this._selectedPortfolio.client.id,
      dto: value
    })
      .subscribe(() => {
        const client = this._selectedPortfolio.client;
        client.username = value.newUsername;
        this.msg.success(`Username and password for ${client.firstName} ${client.lastName} was changed`);
        this._isVisibleEditAccount = false;
      });
  }
}
