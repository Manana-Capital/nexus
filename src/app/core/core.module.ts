import { NgModule, Optional, SkipSelf } from '@angular/core';
import {CommonModule} from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';

import {FundsService} from './backend/generated/controllers/Funds';
import {StatisticsService} from './backend/generated/controllers/Statistics';
import {ProfileService} from './backend/generated/controllers/Profile';
import {PortfolioService} from './backend/generated/controllers/Portfolio';
import {ClientsService} from './backend/generated/controllers/Clients';

import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '@core/network/auth.service';
import { UserHeadComponent } from './components/user-head/user-head.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExternalViewComponent} from '@core/components/external-view-component/external-view.component';
import {NxCardComponent} from '@core/components/nx-card/nx-card.component';
import {RouterModule} from '@angular/router';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { NxTrendComponent } from './components/nx-trend/nx-trend.component';

const generatedServices = [
  FundsService,
  ClientsService,
  ProfileService,
  PortfolioService,
  StatisticsService
];

const exportedComponents = [
  ExternalViewComponent,
  UserHeadComponent,
  NxCardComponent,
  NxTrendComponent
];

const exportedModules = [
  CommonModule,
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  HttpClientModule,
  BrowserAnimationsModule,
  NgxChartsModule
];

@NgModule({
  imports: [
    ...exportedModules
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    ...generatedServices
  ],
  declarations: [
    ...exportedComponents
  ],
  exports: [
    ...exportedModules,
    ...exportedComponents
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
