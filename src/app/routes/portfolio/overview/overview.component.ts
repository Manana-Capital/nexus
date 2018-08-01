import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '@core/api/generated/controllers/Portfolio';
import {PortfolioInfo} from '@core/api/generated/defs/PortfolioInfo';

@Component({
  selector: 'nx-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {

  currentPortfolio: PortfolioInfo;

  constructor(
    private portfolioService: PortfolioService
  ) {
    this.portfolioService.portfolio().subscribe(data => {
      this.currentPortfolio = data;
    });
  }

  ngOnInit() {
  }

}
