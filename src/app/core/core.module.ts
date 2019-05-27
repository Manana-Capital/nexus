import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

/*import {AuthService} from './network/auth.service';*/
/*import { environment } from '@env/environment';*/

import {FundsService} from './backend/generated/controllers/Funds';
import {StatisticsService} from './backend/generated/controllers/Statistics';
import {ProfileService} from './backend/generated/controllers/Profile';
import {PortfolioService} from './backend/generated/controllers/Portfolio';
import {ClientsService} from './backend/generated/controllers/Clients';

import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '@core/network/auth.service';
import { UserHeadComponent } from './components/user-head/user-head.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const generatedServices = [
  FundsService,
  ClientsService,
  ProfileService,
  PortfolioService,
  StatisticsService
];

const exportedComponents = [
    UserHeadComponent
];

@NgModule({
  imports: [
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    OidcSecurityService,
    AuthService,
    ...generatedServices
  ],
  declarations: [
    ...exportedComponents
  ],
  exports: [
    ...exportedComponents
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
