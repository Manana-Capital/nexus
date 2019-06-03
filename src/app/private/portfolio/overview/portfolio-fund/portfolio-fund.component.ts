import {Component, Input, OnInit} from '@angular/core';
import {PortfolioFundInfo} from 'app/core/backend/generated/defs/PortfolioFundInfo';

@Component({
  selector: 'nx-portfolio-fund',
  templateUrl: './portfolio-fund.component.html',
  styleUrls: ['./portfolio-fund.component.less']
})
export class PortfolioFundComponent implements OnInit {

  @Input()
  get fund(): PortfolioFundInfo {
    return this._fund;
  }
  set fund(val: PortfolioFundInfo) {
    this.sortItems(val);
    this._fund = val;
  }

  _fund: PortfolioFundInfo;

  constructor() { }

  ngOnInit() {
  }

  private sortItems(val: PortfolioFundInfo) {
    val.deposits = val.deposits.sort((x, y) => {
      const xD = new Date(x.created);
      const yD = new Date(y.created);
      return xD > yD ? -1 : xD < yD ? 1 : 0;
    });
    val.withdrawals = val.withdrawals.sort((x, y) => {
      const xD = new Date(x.created);
      const yD = new Date(y.created);
      return xD > yD ? -1 : xD < yD ? 1 : 0;
    });
  }
}
