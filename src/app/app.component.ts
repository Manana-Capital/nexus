import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/network/auth.service';

@Component({
  selector: 'nx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  _authChecked = false;

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
    this.auth.userDataStream().subscribe(data => {
      this._authChecked = true;
    });
  }
}
