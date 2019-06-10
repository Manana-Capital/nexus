import {Component, Input, OnInit} from '@angular/core';
import {PortfolioInfo} from '@core/backend/generated/defs/PortfolioInfo';

@Component({
  selector: 'nx-portfolio-distribution-chart',
  templateUrl: './portfolio-distribution-chart.component.html',
  styleUrls: ['./portfolio-distribution-chart.component.less']
})
export class PortfolioDistributionChartComponent implements OnInit {

  @Input()
  info: PortfolioInfo;

  @Input()
  loading = false;

  _colorScheme = {
    domain: ['#33A1DE', '#ffcc80']
  };

  _chartData = [];

  constructor() { }

  ngOnInit() {
    this._chartData = this.formatChartData(this.info);
  }

  private formatChartData(info: PortfolioInfo) {

    const funds = info.activeFundsInfo;
    const forChart = funds.map(x => ({
      name: x.fund.displayName,
      value: x.assetsUsd / info.totalAssetsUsd * 100,
      valueUsd: x.assetsUsd,
      valueBtc: x.assetsBtc,
      valueCzk: x.assetsCzk
    }));
    return forChart;
  }
}
