import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {PrivateRoutingModule} from './private-routing.module';
import {PortfolioFundComponent} from './portfolio/overview/portfolio-fund/portfolio-fund.component';
import {PortfolioOverviewComponent} from './portfolio/overview/overview.component';
import { TransactionComponent } from './clients/transaction/transaction.component';
import {TransactionStep1Component} from './clients/transaction/steps/transaction-step1.component';
import {TransactionStep2Component} from './clients/transaction/steps/transaction-step2.component';
import {TransactionStep3Component} from './clients/transaction/steps/transaction-step3.component';


const COMPONENTS_NOROUNT = [
  PortfolioFundComponent,
  PortfolioOverviewComponent,

  TransactionStep1Component,
  TransactionStep2Component,
  TransactionStep3Component
];

const COMPONENTS = [
  ProfileSettingsComponent,
  TransactionComponent,
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
