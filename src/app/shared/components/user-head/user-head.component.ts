import { Component, OnInit } from '@angular/core';
import {AuthService, NexusClient} from '@core/network/auth.service';
import {NxGravatarService} from '@core/services/nx-gravatar.service';

@Component({
  selector: 'nx-user-head',
  templateUrl: './user-head.component.html',
  styleUrls: ['./user-head.component.less']
})
export class UserHeadComponent implements OnInit {
  _userData: NexusClient;

  constructor(
    public auth: AuthService,
    public gravatar: NxGravatarService
  ) {
    this.auth.userDataStream().subscribe(data => {
      this._userData = data;
    });
  }

  ngOnInit() {
  }

}
