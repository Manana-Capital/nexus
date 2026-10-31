import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard), title: 'Dashboard · Nexus' },
  { path: 'statistics', loadComponent: () => import('./features/statistics/statistics').then((m) => m.Statistics), title: 'Statistics · Nexus' },
  { path: 'system/rest-api', loadComponent: () => import('./features/system/external-view').then((m) => m.ExternalView), data: { path: 'swagger/', name: 'REST API' }, title: 'REST API · Nexus' },
  { path: 'system/background-jobs', loadComponent: () => import('./features/system/external-view').then((m) => m.ExternalView), data: { path: 'background/', name: 'Background jobs' }, title: 'Background jobs · Nexus' },
  { path: 'private', loadChildren: () => import('./features/private.routes').then((m) => m.privateRoutes) },
  { path: '401', loadComponent: () => import('./features/system/exception').then((m) => m.Exception), data: { code: 401 } },
  { path: '403', loadComponent: () => import('./features/system/exception').then((m) => m.Exception), data: { code: 403 } },
  { path: '404', loadComponent: () => import('./features/system/exception').then((m) => m.Exception), data: { code: 404 } },
  { path: '500', loadComponent: () => import('./features/system/exception').then((m) => m.Exception), data: { code: 500 } },
  { path: '**', redirectTo: '404' },
];
