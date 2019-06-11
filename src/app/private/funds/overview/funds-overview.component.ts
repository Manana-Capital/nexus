import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {FundsService} from '@core/backend/generated/controllers/Funds';
import {FundTotalBalanceInfo} from '@core/backend/generated/defs/FundTotalBalanceInfo';

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

}
