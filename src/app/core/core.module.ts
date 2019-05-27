import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

/*import {AuthService} from './network/auth.service';*/

import {FundsService} from './backend/generated/controllers/Funds';
import {StatisticsService} from './backend/generated/controllers/Statistics';
import {ProfileService} from './backend/generated/controllers/Profile';
import {PortfolioService} from './backend/generated/controllers/Portfolio';
import {ClientsService} from './backend/generated/controllers/Clients';

const generatedServices = [
  FundsService,
  ClientsService,
  ProfileService,
  PortfolioService,
  StatisticsService
];

@NgModule({
  providers: [
/*    OidcSecurityService,*/
/*    AuthService,*/
    ...generatedServices
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
