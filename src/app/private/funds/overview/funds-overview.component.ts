import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {FundTotalBalanceInfo} from '@core/backend/generated/defs/FundTotalBalanceInfo';
import {FundBalancePerExchange} from '@core/backend/generated/defs/FundBalancePerExchange';
import {FundBalance} from '@core/backend/generated/defs/FundBalance';

@Component({
  selector: 'nx-funds-overview',
  templateUrl: './funds-overview.component.html',
  styleUrls: ['./funds-overview.component.less'],
})
export class FundsOverviewComponent implements OnInit {

  _loading = true;
  _loadingConnectorData = false;
  _funds: FundTotalBalanceInfo[];
  _selectedFund: FundTotalBalanceInfo;
  _selectedConnectorId: number;
  _selectedConnectorCurrency: string;
  _today: Date;

  _connectorData: FundBalancePerExchange[];
  _connectorChartDataUsd = [];
  _connectorChartDataBtc = [];
  _connectorChartDataCzk = [];
  _connectorChartType = 'usd';
  _connectorChartScheme = {
    domain: ['#85bb65', '#ffcc80', '#33A1DE']
  };

  constructor(
    private fundsApi: FundsService,
    public msg: NzMessageService) {
  }

  ngOnInit() {
    this._today = new Date();
    this.loadFundsInfo();
  }

  selectFund(fund: FundTotalBalanceInfo) {
    this._selectedFund = fund;
    this._selectedConnectorId = 0;
  }

  refreshData() {
    this.loadFundsInfo();
  }


  private loadFundsInfo() {
    this._funds = [];
    this._selectedFund = null;
    this._loading = true;
    this.fundsApi.apiFundsBalancesGet()
      .subscribe(data => {
        this._funds = data;
        this.selectFund(this._funds.find(x => x.fund.id === 1));

        this._loading = false;

      });
  }

  private groupBy<T, TKey>(list: T[], keyGetter: ((x: T) => TKey)): Map<TKey, T[]> {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  sortBalances(balances: FundBalancePerExchange[]) {
    return balances.sort((a, b) => a.balances.length - b.balances.length);
  }

  getBtcRatioForFund(fund: FundTotalBalanceInfo) {
    const btcOnly = this.getBtcOnlyForFund(fund);
    const btcTotal = fund.amountBtc;
    return btcOnly / btcTotal;
  }

  getBtcOnlyForFund(fund: FundTotalBalanceInfo) {
    return fund.balances.reduce((a, c) => a + this.getBtcOnly(c.balances), 0);
  }

  getBtcRatio(balance: FundBalancePerExchange) {
    const btcOnly = this.getBtcOnly(balance.balances);
    const btcTotal = balance.amountBtc;
    return btcOnly / btcTotal;
  }

  getBtcOnly(balances: FundBalance[]) {
    return balances.reduce((a, c) => a + this.getBtcOnlyFromBalance(c), 0);
  }

  getBtcOnlyFromBalance(balance: FundBalance) {
    const cur = balance.currency.toLowerCase();
    if (cur === 'btc' || cur === 'xbt' || cur === 'xxbt') {
      return balance.amount;
    }
    return 0;
  }

  abs(value: number) {
    return Math.abs(value);
  }

  selectConnector(connectorId: number) {
    this._selectedConnectorId = connectorId;
    this._loadingConnectorData = true;
    this.fundsApi.apiFundsBalancesByConnectoridGet({connectorid: connectorId})
      .subscribe(data => {
        this._connectorData = data;
        this.transformChartData(this._connectorData);
        this._loadingConnectorData = false;
      });
  }

  private transformChartData(data: FundBalancePerExchange[]) {
    if (!data || !data.length) {
      this._connectorChartDataUsd = this.formatChartData('USD', []);
      this._connectorChartDataBtc = this.formatChartData('BTC', []);
      this._connectorChartDataCzk = this.formatChartData('CZK', []);
      return;
    }

    const usd = data.map(x => ({
      name: new Date(x.gathered),
      value: x.amountUsd
    }));
    const btc = data.map(x => ({
      name: new Date(x.gathered),
      value: x.amountBtc
    }));
    const czk = data.map(x => ({
      name: new Date(x.gathered),
      value: x.amountCzk
    }));
    this._connectorChartDataUsd = this.formatChartData('USD', usd);
    this._connectorChartDataBtc = this.formatChartData('BTC', btc);
    this._connectorChartDataCzk = this.formatChartData('CZK', czk);
  }

  private formatChartData(name: string, data: any[]) {
    return [
      {
        name: name,
        series: data
      }
    ];
  }
}
