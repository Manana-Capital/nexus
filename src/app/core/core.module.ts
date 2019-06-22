import {NgModule} from '@angular/core';

import {FundsService} from './backend/generated/controllers/Funds';
import {StatisticsService} from './backend/generated/controllers/Statistics';
import {ProfileService} from './backend/generated/controllers/Profile';
import {PortfolioService} from './backend/generated/controllers/Portfolio';
import {ClientsService} from './backend/generated/controllers/Clients';

import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '@core/network/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {NxGravatarService} from '@core/services/nx-gravatar.service';
import {SystemService} from '@core/backend/generated/controllers/System';
import {NxCurrencySelectorService} from '@core/services/nx-currency-selector.service';

const generatedServices = [
  FundsService,
  ClientsService,
  ProfileService,
  PortfolioService,
  StatisticsService,
  SystemService
];


const exportedModules = [
  HttpClientModule,
];

const modules = [
];

const services = [
  NxGravatarService,
  NxCurrencySelectorService
];

@NgModule({
  imports: [
    ...exportedModules,
    ...modules
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    ...generatedServices,
    ...services
  ],
  declarations: [
  ],
})
export class CoreModule {
  constructor() {
  }
}
