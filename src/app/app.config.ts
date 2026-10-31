import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import * as icons from '@ant-design/icons-angular/icons';
import { AbstractSecurityStorage, authInterceptor, DefaultLocalStorageService, LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { provideNzNativeDateAdapter } from 'ng-zorro-antd/core/time';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { errorInterceptor } from './core/http/error.interceptor';

const backend = environment.backendUrl;
const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;

const usedIcons = [
  icons.DashboardOutline, icons.BarChartOutline, icons.WalletOutline, icons.FundOutline, icons.FundFill, icons.SettingOutline, icons.TeamOutline,
  icons.ProfileOutline, icons.DownOutline, icons.UpOutline, icons.SwapOutline, icons.ToolOutline, icons.ApiOutline, icons.ClockCircleOutline, icons.DesktopOutline,
  icons.MenuFoldOutline, icons.MenuUnfoldOutline, icons.LoginOutline, icons.LogoutOutline, icons.UserOutline, icons.InfoCircleOutline, icons.ReloadOutline,
  icons.PlusOutline, icons.EditOutline, icons.KeyOutline, icons.UserDeleteOutline, icons.UserAddOutline, icons.CheckCircleFill, icons.WarningFill, icons.ExportOutline,
  icons.DeleteOutline, icons.SearchOutline, icons.CheckOutline, icons.CloseOutline, icons.RobotOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor(), errorInterceptor])),
    provideNzI18n(en_US),
    provideNzNativeDateAdapter({ locale: 'en-US' }),
    provideNzIcons(usedIcons),
    provideAuth({
      config: {
        authority: backend.replace(/\/$/, ''),
        redirectUrl: `${origin}/`,
        postLogoutRedirectUri: `${origin}/`,
        clientId: 'ng',
        scope: 'openid profile nexus role',
        responseType: 'code',
        silentRenew: false,
        useRefreshToken: false,
        autoUserInfo: true,
        secureRoutes: [backend],
        unauthorizedRoute: '/401',
        forbiddenRoute: '/403',
        postLoginRoute: '/dashboard',
        triggerAuthorizationResultEvent: true,
        maxIdTokenIatOffsetAllowedInSeconds: 60 * 60 * 4,
        logLevel: environment.production ? LogLevel.Warn : LogLevel.Warn,
      },
    }),
    // tokens live for days, staying logged in across tabs and restarts is the expected behaviour
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
    provideAppInitializer(() => inject(AuthService).init().pipe(catchError(() => of(null)))),
  ],
};
