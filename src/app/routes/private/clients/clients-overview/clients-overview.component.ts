import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '@core/api/generated/controllers/Portfolio';
import {PortfolioInfo} from '@core/api/generated/defs/PortfolioInfo';
import {FundClient} from '@core/api/generated/defs/FundClient';

@Component({
  selector: 'nx-clients-overview',
  templateUrl: './clients-overview.component.html',
  styleUrls: ['./clients-overview.component.less']
})
export class ClientsOverviewComponent implements OnInit {

  _data: PortfolioInfo[];
  _loading: boolean = false;

  constructor(
    private portfolioService: PortfolioService
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

}
