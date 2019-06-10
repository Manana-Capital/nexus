import {Component, Input, OnInit} from '@angular/core';
import {PortfolioFundInfo} from 'app/core/backend/generated/defs/PortfolioFundInfo';
import {PortfolioTransaction} from '@core/backend/generated/defs/PortfolioTransaction';
import {PortfolioBalanceTick} from '@core/backend/generated/defs/PortfolioBalanceTick';

interface Transaction extends PortfolioTransaction {
  type?: string;
}

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

    this.mergeTransactionsTogether(val);
  }

  @Input()
  isSelected = false;

  _displayTransactionsTogether = true;
  _fund: PortfolioFundInfo;
  _transactions: Transaction[] = [];

  constructor() { }

  ngOnInit() {
  }

  private sortItems(val: PortfolioFundInfo) {
    val.deposits = this.sortTransactions(val.deposits);
    val.withdrawals = this.sortTransactions(val.withdrawals);
  }

  private sortTransactions(val: Transaction[]) {
    return val.sort((x, y) => {
      const xD = new Date(x.created);
      const yD = new Date(y.created);
      return xD > yD ? -1 : xD < yD ? 1 : 0;
    });
  }

  private mergeTransactionsTogether(val: PortfolioFundInfo) {
    this._transactions = val.deposits.map(x => {
      const tra = x as Transaction;
      tra.type = 'deposit';
      return tra;
    }).concat(val.withdrawals.map(x => {
      const tra = x as Transaction;
      tra.type = 'withdrawal';
      return tra;
    }));
    this._transactions = this.sortTransactions(this._transactions);
  }
}
