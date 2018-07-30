import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
// dashboard pages
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';

// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {ACLGuard} from '@delon/acl';
import {ExternalViewComponent} from '../layout/external-component/external-view.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAnalysisComponent  },
      {
        path: 'portfolio',
        component: Exception404Component,
        canActivate: [ACLGuard],
        data: { guard: 'Client' },
      },
      { path: 'charts', component: Exception404Component },
      { path: 'clients', component: Exception404Component },
      { path: 'funds', component: Exception404Component },
      { path: 'system/restapi', component: ExternalViewComponent },
      { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' },
      { path: '403', component: Exception403Component, data: {title: 'Forbidden'} },
      { path: '404', component: Exception404Component, data: {title: 'Not found'} },
      { path: '500', component: Exception500Component, data: {title: 'Server error'} },
    ],
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
