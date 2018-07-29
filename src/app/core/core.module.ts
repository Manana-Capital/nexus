import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { I18NService } from './i18n/i18n.service';
import {AuthService} from '@core/net/auth.service';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@NgModule({
  providers: [
    I18NService,
    OidcSecurityService,
    AuthService
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
