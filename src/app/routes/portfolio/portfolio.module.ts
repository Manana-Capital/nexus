import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {PortfolioRoutingModule} from './portfolio-routing.module';
import { OverviewComponent } from './overview/overview.component';


const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, PortfolioRoutingModule],
  declarations: [
    ...COMPONENTS_NOROUNT,
    OverviewComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PortfolioModule {}
