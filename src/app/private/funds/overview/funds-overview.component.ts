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
  _funds: FundTotalBalanceInfo[];
  _selectedFund: FundTotalBalanceInfo;
  _today: Date;

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
  }

  refreshData() {
    this.loadFundsInfo();
  }


  private loadFundsInfo() {
    this._funds = [];
    this._selectedFund = null;
    this._loading = true;
    this.fundsApi.balances()
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
}
