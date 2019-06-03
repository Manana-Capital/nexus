import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'nx-client-access-form',
  templateUrl: './client-access-form.component.html',
  styleUrls: ['./client-access-form.component.less']
})
export class ClientAccessFormComponent implements OnInit {

  @Input()
  set username(data: string) {
    this.pwd.newUsername = data;
    this.pwd.oldPassword = '';
    this.pwd.newPassword = '';
    this.pwd.newPasswordRepeat = '';
  }

  @Input()
  ignoreOldPassword = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();

  pwd = {
    newUsername: '',
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
  };

  constructor() { }

  ngOnInit() {
  }

  save() {
    this.onSave.emit(this.pwd);
  }
}
