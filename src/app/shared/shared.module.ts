import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { UserHeadComponent } from './components/user-head/user-head.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { NxTrendComponent } from './components/nx-trend/nx-trend.component';
import {NxCardComponent} from './components/nx-card/nx-card.component';
import {ExternalViewComponent} from './components/external-view-component/external-view.component';
import {NxGravatarService} from '@core/services/nx-gravatar.service';

const exportedComponents = [
  ExternalViewComponent,
  UserHeadComponent,
  NxCardComponent,
  NxTrendComponent
];

const exportedModules = [
  CommonModule,
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  NgxChartsModule
];

const modules = [
];

@NgModule({
  imports: [
    ...exportedModules,
    ...modules
  ],
  providers: [
  ],
  declarations: [
    ...exportedComponents
  ],
  exports: [
    ...exportedModules,
    ...exportedComponents
  ],
})
export class SharedModule {
  constructor() {
  }
}
