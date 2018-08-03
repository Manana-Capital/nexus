import {Component, Input, OnInit} from '@angular/core';
import {FundPerformanceYear} from '@core/api/generated/defs/FundPerformanceYear';
import {SimpleTableColumn} from '@delon/abc';

@Component({
  selector: 'nx-fund-performance-year',
  templateUrl: './fund-performance-year.component.html',
  styleUrls: ['./fund-performance-year.component.less']
})
export class FundPerformanceYearComponent implements OnInit {

  @Input()
  yearModel: FundPerformanceYear;

  _columns: SimpleTableColumn[];
  _data = [];

  constructor() { }

  ngOnInit() {
    this._columns = this.transformToColumns(this.yearModel);
    this._data = this.transformToData(this.yearModel);
  }

  private transformToColumns(model: FundPerformanceYear): SimpleTableColumn[] {
    return [
      {
        title: model.year.toString(),
        index: 'month',
        render: 'month'
      },
      {
        type: 'number',
        title: 'Mañana',
        index: 'manana',
        render: 'manana',
        //sorter: (a, b) => a.manana - b.manana,
      },
      {
        type: 'number',
        title: 'Bitcoin',
        index: 'btc',
        render: 'btc',
        //sorter: (a, b) => a.btc - b.btc,
      },
      {
        type: 'number',
        title: 'Outperform',
        index: 'outperform',
        render: 'outperform-render',
        //sorter: (a, b) => a.outperform - b.outperform,
      }
    ]
  }

  private transformToData(model: FundPerformanceYear): any[] {
    const months = model.months.map(x => ({
      month: new Date(x.gathered),
      manana: x.change,
      btc: x.changeBtc,
      outperform: x.btcOutperform
    }));
    return [
        {
          month: null,
          manana: model.yearChange,
          btc: model.yearChangeBtc,
          outperform: model.btcOutperform
        }
      ].concat(months);
  }
}
