import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProfileService} from '@core/api/generated/controllers/Profile';
import {ProfileInfoDto} from '@core/api/generated/defs/ProfileInfoDto';

@Component({
  selector: 'nx-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  active = 1;
  profileForm: FormGroup;
  pwd = {
    newUsername: '',
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
  };
  currentProfile: ProfileInfoDto;

  constructor(
    fb: FormBuilder,
    private profileService: ProfileService,
    public msg: NzMessageService
  ) {
    this.profileForm = fb.group({
      firstName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(`^[-_a-zA-Z0-9]{4,20}$`),
        ]),
      ],
      lastName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(`^[-_a-zA-Z0-9]{4,20}$`),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.email
        ]),
      ]
    });

    profileService.apiProfileGet().subscribe(data => {
      this.currentProfile = data;
      this.updateProfileForm(this.currentProfile);
    });
  }

  ngOnInit() {
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  profileSave(event, value) {
    this.profileService.apiProfilePut({
      dto: value
    })
      .subscribe(response => {
        this.msg.success('Profile was updated');
      });
  }

  pwdSave() {
    this.profileService.changePassword({
      dto: this.pwd
    })
      .subscribe(() => {
        this.msg.success('Username and password was changed');
      });
  }

  private updateProfileForm(currentProfile: ProfileInfoDto) {
    this.profileForm.patchValue(currentProfile);
    this.pwd.newUsername = currentProfile.username;
  }
}
