import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SimpleTableColumn } from '@delon/abc';
import { getTimeDistance, yuan } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import {FundsService} from '@core/api/generated/controllers/Funds';
import {FundInfo} from '@core/api/generated/defs/FundInfo';
import {AuthService} from '@core/net/auth.service';

@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less'],
})
export class DashboardAnalysisComponent implements OnInit {

  _funds: FundInfo[];
  _today: Date;

  constructor(
    private fundsApi: FundsService,
    private auth: AuthService,
    public msg: NzMessageService) {}

  ngOnInit() {
    this._today = new Date();

    this.auth.userDataStream().subscribe(x => {
      this.loadFundsInfo();
    });

  }

  private loadFundsInfo() {
    this.fundsApi.complex().subscribe(data => {
      this._funds = data;
    });
  }
}
