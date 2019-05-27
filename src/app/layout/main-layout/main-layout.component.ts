import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/network/auth.service';

@Component({
  selector: 'nx-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less']
})
export class MainLayoutComponent implements OnInit {
  _isCollapsed = false;
  _isAuthenticated: boolean;
  _userData: any;

  constructor(public auth: AuthService) {
    this.auth.isAuthorizedStream().subscribe(is => {
      this._isAuthenticated = is;
    });
    this.auth.userDataStream().subscribe(data => {
      this._userData = data;
    });
  }

  ngOnInit() {
  }
}
