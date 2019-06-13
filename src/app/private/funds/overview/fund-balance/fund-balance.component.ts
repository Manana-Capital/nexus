import {Component, Input, OnInit} from '@angular/core';
import {FundBalance} from '@core/backend/generated/defs/FundBalance';
import {Balance} from '@core/backend/generated/defs/Balance';

@Component({
  selector: 'nx-fund-balance',
  templateUrl: './fund-balance.component.html',
  styleUrls: ['./fund-balance.component.less']
})
export class FundBalanceComponent implements OnInit {

  @Input()
  exchangeName: string;

  @Input()
  set data(value: FundBalance[] | Balance[]) {
    this._data = this.transformToData(value);
  }

  _data = [];

  constructor() { }

  ngOnInit() {
  }

  private transformToData(data: FundBalance[]): any[] {
    if (!data) {
      return [];
    }

    const rows = data.map(x => ({
      exchange: x.exchangeName,
      currency: x.currency,
      amount: x.amount
    }));
    return rows;
  }

}
