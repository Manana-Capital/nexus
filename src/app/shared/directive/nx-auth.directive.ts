import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AuthService, NexusClient} from '@core/network/auth.service';

@Directive({
  selector: '[nxAuth]'
})
export class NxAuthDirective implements OnInit {
  _isAuthenticated: boolean;
  _userData: NexusClient;

  // tslint:disable-next-line:no-input-rename
  @Input('nxAuth')
  role: string;

  constructor(
    public auth: AuthService,
    private el: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.auth.isAuthorizedStream().subscribe(is => {
      this._isAuthenticated = is;
    });
    this.auth.userDataStream().subscribe(data => {
      this._userData = data;

      if (this._userData && this._userData.role.indexOf(this.role) >= 0) {
        this.displayMe();
      } else {
        this.hideMe();
      }

    });
  }

  private hideMe() {
    this.el.nativeElement.style.display = 'none';
  }

  private displayMe() {
    this.el.nativeElement.style.display = 'initial';
  }

}
