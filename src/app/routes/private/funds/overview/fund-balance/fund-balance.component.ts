import {Component, Input, OnInit} from '@angular/core';
import {FundTotalBalanceInfo} from '@core/api/generated/defs/FundTotalBalanceInfo';
import {SimpleTableColumn} from '@delon/abc';
import {FundBalance} from '@core/api/generated/defs/FundBalance';

@Component({
  selector: 'nx-fund-balance',
  templateUrl: './fund-balance.component.html',
  styleUrls: ['./fund-balance.component.less']
})
export class FundBalanceComponent implements OnInit {

  @Input()
  exchangeName: string;

  @Input()
  data: FundBalance[];

  _columns: SimpleTableColumn[];
  _data = [];

  constructor() { }

  ngOnInit() {
    this._columns = this.transformToColumns();
    this._data = this.transformToData(this.data);
  }

  private transformToColumns(): SimpleTableColumn[] {
    return [
      {
        title: 'Currency',
        index: 'currency',
        render: 'currency',
/*        sorter: (a, b) => a.currency - b.currency,*/
      },
      {
        type: 'number',
        title: 'Amount',
        index: 'amount',
        render: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      }
    ]
  }

  private transformToData(model: FundBalance[]): any[] {
    const rows = model.map(x => ({
      exchange: x.exchangeName,
      currency: x.currency,
      amount: x.amount
    }));
    return rows
  }

}
