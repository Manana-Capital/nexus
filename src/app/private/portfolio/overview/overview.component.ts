import { Component, OnInit, Input } from '@angular/core';
import {PortfolioInfo} from 'app/core/backend/generated/defs/PortfolioInfo';
import {PortfolioBalanceTick} from '@core/backend/generated/defs/PortfolioBalanceTick';
import {NxCurrencySelectorService} from '@core/services/nx-currency-selector.service';

@Component({
  selector: 'nx-portfolio-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class PortfolioOverviewComponent implements OnInit {

  @Input()
  get currentPortfolio(): PortfolioInfo {
    return this._currentPortfolio;
  }
  set currentPortfolio(val: PortfolioInfo) {
    this._currentPortfolio = val;
    this.reloadChartData();
  }

  _currentPortfolio: PortfolioInfo;

  @Input()
  loading = true;

  @Input()
  fullSize = true;

  @Input()
  expandData = false;

  _totalBalanceTicks: PortfolioBalanceTick[];
  _totalProfitTicks: PortfolioBalanceTick[];
  _selectedFundIndex = 0;
  _displayFundDetail = true;

  constructor(
    public currency: NxCurrencySelectorService
  ) {
  }

  ngOnInit() {
  }

  private reloadChartData() {
    this._totalBalanceTicks = [];
    this._totalProfitTicks = [];
    this._totalBalanceTicks = this.mergeBalanceTicks(this.currentPortfolio);
    this._totalProfitTicks = this.mergeProfitTicks(this.currentPortfolio);
  }

  private mergeBalanceTicks(portfolio: PortfolioInfo): PortfolioBalanceTick[] {
    if (!portfolio || !portfolio.activeFundsInfo) {
      return [];
    }

    const merged: PortfolioBalanceTick[] = [];
    portfolio.activeFundsInfo.forEach(x => {
      merged.push(...x.balanceTicks);
    });

    return this.mergeTicks(merged);
  }

  private mergeProfitTicks(portfolio: PortfolioInfo): PortfolioBalanceTick[] {
    if (!portfolio || !portfolio.activeFundsInfo) {
      return [];
    }

    const merged: PortfolioBalanceTick[] = [];
    portfolio.activeFundsInfo.forEach(x => {
      merged.push(...x.profitTicks);
    });

    return this.mergeTicks(merged);
  }

  private mergeTicks(merged: PortfolioBalanceTick[]) {
    const grouped = this.groupBy(merged, ['timestamp']);
    return grouped.map((group: PortfolioBalanceTick[]) => ({
      timestamp: group[0].timestamp,
      shares: group.reduce((sum, current) => sum + current.shares, 0),
      valueUsd: group.reduce((sum, current) => sum + current.valueUsd, 0),
      valueBtc: group.reduce((sum, current) => sum + current.valueBtc, 0),
      valueCzk: group.reduce((sum, current) => sum + current.valueCzk, 0),
    }));
  }

  private  groupBy(array: any[], properties: string[]): any[] {
    const result = [];

    // iterate over each item in the original array
    array.forEach(item => {
      // check if the item belongs in an already created group
      const added = result.some(group => {
        // check if the item belongs in this group
        const shouldAdd = properties.every(prop => (group[0][prop] === item[prop]));
        // add item to this group if it belongs
        if (shouldAdd) {
          group.push(item);
        }
        // exit the loop when an item is added, continue if not
        return shouldAdd;
      });

      // no matching group was found, so a new group needs to be created for this item
      if (!added) {
        result.push([item]);
      }
    });
    return result;
  }

  reloadFundDetail() {
    this._displayFundDetail = false;
    setTimeout(() => this._displayFundDetail = true, 10);
  }
}
