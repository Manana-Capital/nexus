import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {PrivateRoutingModule} from './private-routing.module';
import {PortfolioFundComponent} from './portfolio/overview/portfolio-fund/portfolio-fund.component';
import {PortfolioOverviewComponent} from './portfolio/overview/overview.component';


const COMPONENTS_NOROUNT = [
  PortfolioFundComponent,
  PortfolioOverviewComponent,
];

const COMPONENTS = [
  ProfileSettingsComponent,
];

@NgModule({
  imports: [
    SharedModule,
    PrivateRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PrivateModule {}
