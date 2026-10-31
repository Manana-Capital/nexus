import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
  { path: 'portfolio/:clientId', loadComponent: () => import('./portfolio/portfolio-page').then((m) => m.PortfolioPage), title: 'Portfolio · Nexus' },
  { path: 'portfolio', loadComponent: () => import('./portfolio/portfolio-page').then((m) => m.PortfolioPage), title: 'My portfolio · Nexus' },
  { path: 'profile', loadComponent: () => import('./profile/profile-settings').then((m) => m.ProfileSettings), title: 'Profile · Nexus' },
  { path: 'clients', redirectTo: 'clients/overview', pathMatch: 'full' },
  { path: 'clients/overview', loadComponent: () => import('./clients/clients-overview').then((m) => m.ClientsOverview), title: 'Clients · Nexus' },
  { path: 'clients/transaction', redirectTo: 'clients/transaction/deposit', pathMatch: 'full' },
  { path: 'clients/transaction/:type', loadComponent: () => import('./clients/transaction').then((m) => m.Transaction), title: 'Transaction · Nexus' },
  { path: 'funds', redirectTo: 'funds/overview', pathMatch: 'full' },
  { path: 'funds/overview', loadComponent: () => import('./funds/funds-overview').then((m) => m.FundsOverview), title: 'Funds · Nexus' },
  { path: 'funds/configuration', loadComponent: () => import('./funds-config/funds-configuration').then((m) => m.FundsConfiguration), title: 'Funds configuration · Nexus' },
  { path: 'system', redirectTo: 'system/logs', pathMatch: 'full' },
  { path: 'system/logs', loadComponent: () => import('./system/logs-viewer').then((m) => m.LogsViewer), title: 'Logs · Nexus' },
];
