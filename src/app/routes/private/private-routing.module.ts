import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {PortfolioOverviewComponent} from './portfolio/overview/overview.component';


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'portfolio/:clientId', component: PortfolioOverviewComponent, data: {title: 'My portfolio'} },
  { path: 'portfolio', component: PortfolioOverviewComponent, data: {title: 'My portfolio'} },
  { path: 'profile', component: ProfileSettingsComponent, data: {title: 'Profile'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
