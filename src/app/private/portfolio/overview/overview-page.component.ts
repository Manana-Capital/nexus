import { Component, OnInit } from '@angular/core';
import {PortfolioService} from 'app/core/backend/generated/controllers/Portfolio';
import {PortfolioInfo} from 'app/core/backend/generated/defs/PortfolioInfo';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nx-portfolio-overview-page',
  templateUrl: 'overview-page.component.html',
  styleUrls: ['overview.component.less']
})
export class PortfolioOverviewPageComponent implements OnInit {

  _currentPortfolio: PortfolioInfo;
  _loading = true;

  constructor(
    private portfolioService: PortfolioService,
    private router: ActivatedRoute
  ) {
    router.params.subscribe(x => {
      this._loading = true;
      if (!x.clientId) {
        this.loadProfile();
      } else {
        this.loadProfileFor(x.clientId);
      }
    });
  }

  ngOnInit() {
  }

  private loadProfile() {
    this.portfolioService.apiPortfolioGet().subscribe(data => {
      this._currentPortfolio = data;
      this._loading = false;
    });
  }

  private loadProfileFor(clientId: number) {
    this.portfolioService.apiPortfolioByClientidGet({clientid: clientId}).subscribe(data => {
      this._currentPortfolio = data;
      this._loading = false;
    });
  }
}
