import { Component } from '@angular/core';
import { SettingsService } from '@delon/theme';
import {Router} from '@angular/router';
import {AuthService} from '@core/net/auth.service';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
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
