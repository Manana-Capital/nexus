import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {NexusExceptionComponent} from './exception/nexus-exception.component';
import {FundsDashboardComponent} from './dashboard/funds/funds-dashboard.component';
import { FundCardComponent } from './dashboard/funds/fund-card/fund-card.component';
import {Exception401Component} from './exception/401.component';
import {ExternalRestApiComponent} from './external-pages/external-rest-api.component';
import {ExternalBackgroundJobsComponent} from './external-pages/external-background-jobs.component';
import { FundPerformanceYearComponent } from './dashboard/funds/fund-performance-year/fund-performance-year.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import {MainLayoutComponent} from '../layout/main-layout/main-layout.component';
import {NavigationMenuComponent} from '../layout/navigation-menu/navigation-menu.component';
import {SharedModule} from '../shared/shared.module';

const LAYOUT = [
  MainLayoutComponent,
  NavigationMenuComponent
];

const COMPONENTS = [
  FundsDashboardComponent,
  FundCardComponent,
  FundPerformanceYearComponent,

  StatisticsComponent,

  NexusExceptionComponent,
  Exception401Component,
  Exception403Component,
  Exception404Component,
  Exception500Component,

  ExternalRestApiComponent,
  ExternalBackgroundJobsComponent
];
const COMPONENTS_NOROUT = [];

@NgModule({
  imports: [
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [
    ...LAYOUT,
    ...COMPONENTS,
    ...COMPONENTS_NOROUT
  ],
  exports: [
    ...LAYOUT
  ],
  entryComponents: COMPONENTS_NOROUT
})
export class PublicModule {}
