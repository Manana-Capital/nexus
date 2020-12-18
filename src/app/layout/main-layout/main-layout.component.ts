import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/network/auth.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { PricesDto } from '@core/backend/generated/model';
import { PricesService } from '@core/backend/generated/controllers/Prices';

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
  _isLoadingLazyModule = false;
  _isSmallScreen = false;
  _prices: PricesDto;

  constructor(public auth: AuthService,
              public router: Router,
              public breakpointObserver: BreakpointObserver,
              public pricesService: PricesService
  ) {
    this.auth.isAuthorizedStream().subscribe(is => {
      this._isAuthenticated = is;
    });
    this.auth.userDataStream().subscribe(data => {
      this._userData = data;
    });
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this._isCollapsed = true;
          this._isSmallScreen = true;
        } else {
          this._isSmallScreen = false;
        }
      });

      this.pricesService.prices().subscribe(x => this._prices = x);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this._isLoadingLazyModule = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this._isLoadingLazyModule = false;
      }
    });
  }

  onNavigationStart() {
    if (!this._isSmallScreen) {
      // do nothing
      return;
    }

    // small screen, so collapse menu on every navigation
    this._isCollapsed = true;
  }
}
