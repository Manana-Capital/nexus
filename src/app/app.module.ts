import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GtagModule } from 'angular-gtag';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import {CoreModule} from '@core/core.module';
import {AuthService} from '@core/network/auth.service';
import {AuthModule} from 'angular-auth-oidc-client';

registerLocaleData(en);

const layoutComponents = [
  MainLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...layoutComponents
  ],
  imports: [
    GtagModule.forRoot({ trackingId: 'UA-118576897-2', trackPageviews: true }),
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule.forRoot()
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
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

