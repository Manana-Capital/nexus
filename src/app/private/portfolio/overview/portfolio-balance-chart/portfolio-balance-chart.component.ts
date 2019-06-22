import {Component, Input, OnInit} from '@angular/core';
import {PortfolioBalanceTick} from '@core/backend/generated/defs/PortfolioBalanceTick';
import {NxCurrencySelectorService} from '@core/services/nx-currency-selector.service';

@Component({
  selector: 'nx-portfolio-balance-chart',
  templateUrl: './portfolio-balance-chart.component.html',
  styleUrls: ['./portfolio-balance-chart.component.less']
})
export class PortfolioBalanceChartComponent implements OnInit {

  @Input()
  ticksBalance: PortfolioBalanceTick[];

  @Input()
  ticksProfit: PortfolioBalanceTick[];

  @Input()
  loading = false;

  _colorSchemeBalance = {
    domain: ['#33A1DE', '#ffcc80']
  };

  _colorSchemeProfit = {
    domain: ['#676e78', '#C3E6CB']
  };

  _chartDataBalance = [];
  _chartDataProfit = [];
  _selectedChart = 'balance';

  constructor(
    public currency: NxCurrencySelectorService
  ) { }

  ngOnInit() {
    this._chartDataBalance = this.formatBalanceChartData(this.ticksBalance);
    this._chartDataProfit = this.formatProfitChartData(this.ticksProfit);
  }

  private formatBalanceChartData(ticks: PortfolioBalanceTick[]) {

    const ticksForChart = ticks.map(x => ({
      name: new Date(x.timestamp),
      value: this.currency.getPortfolioTick(x),
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

  private formatProfitChartData(ticks: PortfolioBalanceTick[]) {

    const ticksForChart = ticks.map(x => ({
      name: new Date(x.timestamp),
      value: this.currency.getPortfolioTick(x),
      valueUsd: x.valueUsd,
      valueBtc: x.valueBtc,
      valueCzk: x.valueCzk
    }));

    return [
      {
        name: 'Portfolio profit',
        series: ticksForChart
      }
    ];
  }

  private selectProfitColor(value: number) {
    console.log('SELECT COLOR', value);

    if (value > 0) {
      return '#C3E6CB';
    }

    if (value < 0) {
      return '#f5c6cb';
    }

    return '#91ccf0';
  }
}
