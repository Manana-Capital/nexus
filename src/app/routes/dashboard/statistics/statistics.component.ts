import { Component, OnInit } from '@angular/core';
import {StatsDto} from '@core/api/generated/defs/StatsDto';
import {StatisticsService} from '@core/api/generated/controllers/Statistics';

@Component({
  selector: 'nx-dashboard-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent implements OnInit {

  _data: StatsDto = {
    activeExchanges: [],
    activeBots: 0,
    tradedAmountBtc: 0,
    tradedAmountUsd: 0,
    tradedTransactionsCount: 0
  };

  constructor(
    private _statsService: StatisticsService
  ) {
    this._statsService.statistics().subscribe(x => this._data = x);
  }

  ngOnInit() {
  }

}
