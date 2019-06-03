import { Component, OnInit, Input } from '@angular/core';
import {PortfolioInfo} from 'app/core/backend/generated/defs/PortfolioInfo';

@Component({
  selector: 'nx-portfolio-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class PortfolioOverviewComponent implements OnInit {

  @Input()
  currentPortfolio: PortfolioInfo;

  @Input()
  loading = true;

  @Input()
  fullSize = true;

  @Input()
  expandData = false;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
