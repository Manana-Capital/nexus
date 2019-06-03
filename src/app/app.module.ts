import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GtagModule } from 'angular-gtag';

import {PublicModule} from './public/public.module';
import { AppComponent } from './app.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import {CoreModule} from '@core/core.module';
import {AuthService} from '@core/network/auth.service';
import {AuthModule} from 'angular-auth-oidc-client';
import { NavigationMenuComponent } from './layout/navigation-menu/navigation-menu.component';
import {DefaultInterceptor} from '@core/network/default.interceptor';

registerLocaleData(en);

const layoutComponents = [
  MainLayoutComponent,
  NavigationMenuComponent
];

@NgModule({
  declarations: [
    AppComponent,
    ...layoutComponents,
  ],
  imports: [
    GtagModule.forRoot({ trackingId: 'UA-118576897-2', trackPageviews: true }),
    BrowserModule,
    PublicModule,
    CoreModule,
    AuthModule.forRoot()
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: 'ORIGIN_URL', useFactory: getBaseUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private auth: AuthService) {
    auth.init();
  }

}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

