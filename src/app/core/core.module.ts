import {NgModule} from '@angular/core';

import {FundsService} from './backend/generated/controllers/Funds';
import {StatisticsService} from './backend/generated/controllers/Statistics';
import {ProfileService} from './backend/generated/controllers/Profile';
import {PortfolioService} from './backend/generated/controllers/Portfolio';
import {ClientsService} from './backend/generated/controllers/Clients';

import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '@core/network/auth.service';
import {HttpClientModule} from '@angular/common/http';

const generatedServices = [
  FundsService,
  ClientsService,
  ProfileService,
  PortfolioService,
  StatisticsService
];


const exportedModules = [
  HttpClientModule,
];

const modules = [
];

@NgModule({
  imports: [
    ...exportedModules,
    ...modules
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    ...generatedServices
  ],
  declarations: [
  ],
})
export class CoreModule {
  constructor() {
  }

  /*static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: 'Window', useValue: window },
        { provide: NZ_I18N, useValue: en_US },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        { provide: 'ORIGIN_URL', useFactory: getBaseUrl },
      ]
    };
  }*/
}
/*
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}*/
