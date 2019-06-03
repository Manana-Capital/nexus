import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {FundsDashboardComponent} from './dashboard/funds/funds-dashboard.component';
import {Exception401Component} from './exception/401.component';
import {ExternalRestApiComponent} from './external-pages/external-rest-api.component';
import {ExternalBackgroundJobsComponent} from './external-pages/external-background-jobs.component';
import {StatisticsComponent} from './dashboard/statistics/statistics.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: FundsDashboardComponent  },
  { path: 'statistics', component: StatisticsComponent  },
  {
    path: 'private',
    loadChildren: '../private/private.module#PrivateModule'
  },
  { path: 'charts', component: Exception404Component },
  { path: 'funds', component: Exception404Component },
  { path: 'system/rest-api', component: ExternalRestApiComponent },
  { path: 'system/background-jobs', component: ExternalBackgroundJobsComponent},
  { path: '401', component: Exception401Component, data: {title: 'Unauthorized'} },
  { path: '403', component: Exception403Component, data: {title: 'Forbidden'} },
  { path: '404', component: Exception404Component, data: {title: 'Not found'} },
  { path: '500', component: Exception500Component, data: {title: 'Server error'} },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
