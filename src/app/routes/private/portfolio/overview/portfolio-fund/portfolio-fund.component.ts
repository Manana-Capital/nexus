import {Component, Input, OnInit} from '@angular/core';
import {PortfolioFundInfo} from 'app/core/api/generated/defs/PortfolioFundInfo';

@Component({
  selector: 'nx-portfolio-fund',
  templateUrl: './portfolio-fund.component.html',
  styleUrls: ['./portfolio-fund.component.less']
})
export class PortfolioFundComponent implements OnInit {

  @Input()
  fund: PortfolioFundInfo;

  constructor() { }

  ngOnInit() {
  }

}
