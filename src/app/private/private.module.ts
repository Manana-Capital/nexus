import { NgModule } from '@angular/core';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {PrivateRoutingModule} from './private-routing.module';
import {PortfolioFundComponent} from './portfolio/overview/portfolio-fund/portfolio-fund.component';
import {PortfolioOverviewComponent} from './portfolio/overview/overview.component';
import { TransactionComponent } from './clients/transaction/transaction.component';
import {TransactionStep1Component} from './clients/transaction/steps/transaction-step1.component';
import {TransactionStep2Component} from './clients/transaction/steps/transaction-step2.component';
import {TransactionStep3Component} from './clients/transaction/steps/transaction-step3.component';
import {PortfolioOverviewPageComponent} from './portfolio/overview/overview-page.component';
import { ClientsOverviewComponent } from './clients/clients-overview/clients-overview.component';
import {FundOverviewCardComponent} from './funds/overview/fund-card/fund-card.component';
import {FundsOverviewComponent} from './funds/overview/funds-overview.component';
import { FundBalanceComponent } from './funds/overview/fund-balance/fund-balance.component';
import { ClientProfileFormComponent } from './profile/client-profile-form/client-profile-form.component';
import { ClientAccessFormComponent } from './profile/client-access-form/client-access-form.component';
import {SharedModule} from '../shared/shared.module';


const COMPONENTS_NOROUNT = [
  PortfolioFundComponent,
  PortfolioOverviewComponent,

  TransactionStep1Component,
  TransactionStep2Component,
  TransactionStep3Component,

  FundOverviewCardComponent,
  FundBalanceComponent,

  ClientProfileFormComponent,
  ClientAccessFormComponent,
];

const COMPONENTS = [
  ProfileSettingsComponent,
  TransactionComponent,
  PortfolioOverviewPageComponent,
  ClientsOverviewComponent,
  FundsOverviewComponent
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
