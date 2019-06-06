import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {FundInfo} from '@core/backend/generated/defs/FundInfo';
import {AuthService} from '@core/network/auth.service';
import {BtcPriceTick} from '@core/backend/generated/defs/BtcPriceTick';

@Component({
  selector: 'nx-dashboard-funds',
  templateUrl: './funds-dashboard.component.html',
  styleUrls: ['./funds-dashboard.component.less'],
})
export class FundsDashboardComponent implements OnInit {

  _loading = true;
  _funds: FundInfo[];
  _selectedFund: FundInfo;
  _today: Date;

  _colorScheme = {
    domain: ['#33A1DE', '#ffcc80']
  };

  _chartData = [];

  constructor(
    private fundsApi: FundsService,
    private auth: AuthService,
    public msg: NzMessageService) {
  }

  ngOnInit() {
    this._today = new Date();
    this.loadFundsInfo();
  }

  getFlagName(performance: number): 'up' | 'down' | '' {
    if (performance > 0) { return 'up'; }
    if (performance < 0) { return 'down'; }
    return '';
  }

  selectFund(fund: FundInfo) {
    this._selectedFund = fund;
    this._chartData = this.transformChartData(fund);
  }

  refreshData() {
    this.loadFundsInfo();
  }

  findBtcInfo(tick): BtcPriceTick {
    if (!this._selectedFund) {
      return {
        volume: 0,
        close: 0
      };
    }
    const share = tick.value;
    const found = this._selectedFund.btcTicks.find(x => x.pricePerShare === share);
    if (!found) {
      return {
        volume: 0,
        close: 0
      };
    }
    return found;
  }

  private loadFundsInfo() {
    this._funds = [];
    this._loading = true;
    this.fundsApi.apiFundsComplexGet()
/*      .pipe(
        delay(5000)
      )*/
      .subscribe(data => {
        this._funds = data;
        this.selectFund(this._funds.find(x => x.id === 1));

        this._loading = false;

      });
  }

  private transformChartData(fund: FundInfo) {
    if (!fund) {
      return this.formatChartData([], []);
    }

    const prices = fund.ticks.map(x => ({
      name: new Date(x.gathered),
      value: x.price
    }));
    const btc = fund.btcTicks.map(x => ({
      name: new Date(x.timestamp),
      value: x.pricePerShare
    }));
    return this.formatChartData(prices, btc);
  }

  private formatChartData(priceTicks: any[], btcTicks: any[]) {
    return [
      {
        name: 'Fund performance',
        series: priceTicks
      },
      {
        name: 'BTC performance',
        series: btcTicks
      }
    ];
  }
}
