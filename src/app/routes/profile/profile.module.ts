import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileSettingsComponent} from './settings/settings.component';


const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ProfileRoutingModule],
  declarations: [
    ProfileSettingsComponent,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProfileModule {}
