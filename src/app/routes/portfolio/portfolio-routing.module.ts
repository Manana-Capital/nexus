import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview/:clientId', component: OverviewComponent, data: {title: 'My portfolio'} },
  { path: 'overview', component: OverviewComponent, data: {title: 'My portfolio'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
