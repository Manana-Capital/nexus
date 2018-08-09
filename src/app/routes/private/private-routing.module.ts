import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {TransactionComponent} from './clients/transaction/transaction.component';
import {PortfolioOverviewPageComponent} from './portfolio/overview/overview-page.component';
import {ClientsOverviewComponent} from './clients/clients-overview/clients-overview.component';


const routes: Routes = [
  { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
  { path: 'portfolio/:clientId', component: PortfolioOverviewPageComponent, data: {title: 'My portfolio'} },
  { path: 'portfolio', component: PortfolioOverviewPageComponent, data: {title: 'My portfolio'} },
  { path: 'profile', component: ProfileSettingsComponent, data: {title: 'Profile'} },
  { path: 'clients', children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ClientsOverviewComponent },
      { path: 'transaction/:type', component: TransactionComponent },
      { path: 'transaction', redirectTo: 'transaction/deposit', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
