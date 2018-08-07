import {
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {MenuService, SettingsService, TitleService} from '@delon/theme';
import {ACLService} from '@delon/acl';
import {AuthService} from '@core/net/auth.service';
declare var gtag: any;

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private settings: SettingsService,
    private aclService: ACLService,
    private auth: AuthService,
    private router: Router,
    private titleSrv: TitleService,
    private menuService: MenuService
  ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.titleSrv.setTitle());

    this.auth.userDataStream().subscribe(user => {
      console.log('USER', user);
      if(!user)
        return;
      this.setCurrentClient(user);
    });
  }

  private setCurrentClient(user) {
    const currentClient = {
      name: user.name,
      avatar: './assets/tmp/img/avatar.png',
      email: user.email
    };
    this.settings.setUser(currentClient);
    this.aclService.setFull(false);
    const roles = this.sanitizeRolesArray(user.role);
    this.aclService.setRole(roles);
    this.menuService.resume();

    gtag('set', {'user_id': user.sub});
  }

  private sanitizeRolesArray(roles): string[] {
    if(!roles)
      return [];
    if(roles.constructor === Array)
      return roles;
    return [roles];
  }
}
