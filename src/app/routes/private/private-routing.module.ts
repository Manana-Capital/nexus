import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileSettingsComponent} from './profile/settings/settings.component';
import {PortfolioOverviewComponent} from './portfolio/overview/overview.component';
import {TransactionComponent} from './clients/transaction/transaction.component';


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'portfolio/:clientId', component: PortfolioOverviewComponent, data: {title: 'My portfolio'} },
  { path: 'portfolio', component: PortfolioOverviewComponent, data: {title: 'My portfolio'} },
  { path: 'profile', component: ProfileSettingsComponent, data: {title: 'Profile'} },
  { path: 'clients', children: [
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
