import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';

// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {NexusExceptionComponent} from './exception/nexus-exception.component';
import {FundsDashboardComponent} from './dashboard/funds/funds-dashboard.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { FundCardComponent } from './dashboard/funds/fund-card/fund-card.component';
import {Exception401Component} from './exception/401.component';
import {ExternalRestApiComponent} from './external-pages/external-rest-api.component';
import {ExternalBackgroundJobsComponent} from './external-pages/external-background-jobs.component';

const COMPONENTS = [
  FundsDashboardComponent,
  FundCardComponent,

  NexusExceptionComponent,
  Exception401Component,
  Exception403Component,
  Exception404Component,
  Exception500Component,

  ExternalRestApiComponent,
  ExternalBackgroundJobsComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, NgxChartsModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {}
