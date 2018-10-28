import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfileInfoDto} from '@core/api/generated/defs/ProfileInfoDto';

@Component({
  selector: 'nx-client-profile-form',
  templateUrl: './client-profile-form.component.html',
  styleUrls: ['./client-profile-form.component.less']
})
export class ClientProfileFormComponent implements OnInit {

  @Input()
  set profile(data: ProfileInfoDto) {
    if(!data) {
      return;
    }
    this.profileForm.patchValue(data);
    this._selectedRoles = data.roles;
    this.currentProfile = data;
  }

  @Input()
  displayRoleSelection: boolean = false;

  @Output()
  onSave: EventEmitter<ProfileInfoDto> = new EventEmitter();

  profileForm: FormGroup;
  currentProfile: ProfileInfoDto;
  _roles = [
    {
      label: 'Fund client',
      value: 'Client'
    },
    {
      label: 'Company employee',
      value: 'Employee'
    },
    {
      label: 'Company manager',
      value: 'Manager'
    },
    {
      label: 'System administrator',
      value: 'Admin'
    },
  ];

  _selectedRoles;

  constructor(
    fb: FormBuilder,
  ) {
    this.profileForm = fb.group({
      firstName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(`[^0-9 ]{3,20}$`),
        ]),
      ],
      lastName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(`[^0-9 ]{3,20}$`),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.email
        ]),
      ]
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

  save(data){
    data.roles = this._selectedRoles;
    this.onSave.emit(data);
  }
}
