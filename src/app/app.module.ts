import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GtagModule } from 'angular-gtag';

import {PublicModule} from './public/public.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import {AuthService} from '@core/network/auth.service';
import {AuthModule} from 'angular-auth-oidc-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DefaultInterceptor} from '@core/network/default.interceptor';
import {CoreModule} from '@core/core.module';
import {LayoutModule} from '@angular/cdk/layout';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    GtagModule.forRoot({ trackingId: 'UA-118576897-2', trackPageviews: true }),
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    CoreModule,
    AuthModule.forRoot(),
    PublicModule
  ],
  providers: [
    { provide: 'Window', useValue: window },
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
