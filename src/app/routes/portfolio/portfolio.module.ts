import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {PortfolioRoutingModule} from './portfolio-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { PortfolioFundComponent } from './overview/portfolio-fund/portfolio-fund.component';


const COMPONENTS_NOROUNT = [
  PortfolioFundComponent
];

@NgModule({
  imports: [SharedModule, PortfolioRoutingModule],
  declarations: [
    ...COMPONENTS_NOROUNT,
    OverviewComponent,
    PortfolioFundComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PortfolioModule {}
