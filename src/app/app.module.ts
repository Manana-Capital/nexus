import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);
// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
// third
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import { AuthModule } from 'angular-auth-oidc-client';
import {GtagModule} from 'angular-gtag';

// Load i18n language file
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/tmp/i18n/`, '.json');
}

export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    AuthModule.forRoot(),
    GtagModule.forRoot({ trackingId: 'UA-118576897-2', trackPageviews: true }),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    // i18n
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: I18nHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // thirds
   /* UEditorModule.forRoot({
      // It is recommended to use a local path; below, in order to reduce the size of the ng-alain scaffolding,
      // the CDN may be referenced, and some functions may be affected.
      js: [
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`,
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`,
      ],
      options: {
        UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`,
      },
    }),*/
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
    }),
    // JSON-Schema form
    JsonSchemaModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    //{ provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
    { provide: 'ORIGIN_URL', useFactory: getBaseUrl },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
