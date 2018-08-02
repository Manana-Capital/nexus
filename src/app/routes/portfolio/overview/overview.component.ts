import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '@core/api/generated/controllers/Portfolio';
import {PortfolioInfo} from '@core/api/generated/defs/PortfolioInfo';

@Component({
  selector: 'nx-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {

  _currentPortfolio: PortfolioInfo;
  _displaySecondaryTotalProfit: boolean = false;

  constructor(
    private portfolioService: PortfolioService
  ) {
    this.portfolioService.apiPortfolioGet().subscribe(data => {
      this._currentPortfolio = data;
    });
  }

  ngOnInit() {
  }

}
