import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/network/auth.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'nx-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less'],
  animations: [
    trigger(
      'menuAnimation',
      [
        transition(
          ':enter', [
            style({transform: 'translateX(-100%)'}),
            animate('200ms', style({transform: 'translateX(0)'}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'translateX(0)'}),
            animate('200ms', style({transform: 'translateX(-100%)'}))
          ]
        )]
    )
  ]
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
