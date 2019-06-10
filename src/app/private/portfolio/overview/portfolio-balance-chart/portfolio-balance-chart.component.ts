import {Component, Input, OnInit} from '@angular/core';
import {PortfolioBalanceTick} from '@core/backend/generated/defs/PortfolioBalanceTick';

@Component({
  selector: 'nx-portfolio-balance-chart',
  templateUrl: './portfolio-balance-chart.component.html',
  styleUrls: ['./portfolio-balance-chart.component.less']
})
export class PortfolioBalanceChartComponent implements OnInit {

  @Input()
  ticks: PortfolioBalanceTick[];

  @Input()
  loading = false;

  _colorScheme = {
    domain: ['#33A1DE', '#ffcc80']
  };

  _chartData = [];

  constructor() { }

  ngOnInit() {
    this._chartData = this.formatChartData(this.ticks);
  }

  private formatChartData(ticks: PortfolioBalanceTick[]) {

    const ticksForChart = ticks.map(x => ({
      name: new Date(x.timestamp),
      value: x.valueUsd,
      valueUsd: x.valueUsd,
      valueBtc: x.valueBtc,
      valueCzk: x.valueCzk
    }));

    return [
      {
        name: 'Portfolio balance',
        series: ticksForChart
      }
    ];
  }
}
