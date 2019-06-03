import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import {ProfileService} from '@core/backend/generated/controllers/Profile';
import {ProfileInfoDto} from '@core/backend/generated/defs/ProfileInfoDto';

@Component({
  selector: 'nx-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  active = 1;

  currentProfile: ProfileInfoDto;

  constructor(
    private profileService: ProfileService,
    public msg: NzMessageService
  ) {

    profileService.apiProfileGet().subscribe(data => {
      this.currentProfile = data;
    });
  }

  ngOnInit() {
  }

  profileSave(value) {
    this.profileService.apiProfilePut({
      dto: value
    })
      .subscribe(response => {
        this.msg.success('Profile was updated');
        this.currentProfile = response;
      });
  }

  pwdSave(value) {
    this.profileService.apiProfileChangePasswordPut({
      dto: value
    })
      .subscribe(() => {
        this.msg.success('Username and password was changed')
        this.currentProfile.username = value.newUsername;
      });
  }
}
