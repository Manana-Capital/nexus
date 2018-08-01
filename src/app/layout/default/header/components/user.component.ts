import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import {AuthService} from '@core/net/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item *ngIf="_isAuthorized" (click)="goProfile()"><i class="anticon anticon-user mr-sm"></i>Profile</div>
      <li nz-menu-divider *ngIf="_isAuthorized"></li>
      <div nz-menu-item *ngIf="_isAuthorized" (click)="logout()"><i class="anticon anticon-logout mr-sm"></i>Logout</div>
      <div nz-menu-item *ngIf="!_isAuthorized" (click)="login()"><i class="anticon anticon-login mr-sm"></i>Login</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  $$auth: Subscription;

  _isAuthorized: boolean = false;

  constructor(
    public settings: SettingsService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.$$auth = this.authService.userDataStream().subscribe(x => this._isAuthorized = !!x);
  }

  ngOnDestroy(): void {
    this.$$auth.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  goProfile() {
    this.router.navigate(['profile/settings']);
  }
}
