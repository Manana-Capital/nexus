import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'nx-client-account-form',
  templateUrl: './client-account-form.component.html',
  styleUrls: ['./client-account-form.component.less']
})
export class ClientAccountFormComponent implements OnInit {

  @Input()
  set username(data: string) {
    if(!data) {
      return;
    }
    this.pwd.newUsername = data;
  }

  @Input()
  ignoreOldPassword: boolean = false;

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

  save(){
    this.onSave.emit(this.pwd);
  }
}
