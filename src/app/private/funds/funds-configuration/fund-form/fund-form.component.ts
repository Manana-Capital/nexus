import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FundSimpleInfo} from '@core/backend/generated/defs/FundSimpleInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';

@Component({
  selector: 'nx-fund-form',
  templateUrl: './fund-form.component.html',
  styleUrls: ['./fund-form.component.less']
})
export class FundFormComponent implements OnInit {

  @Input()
  set fund(data: FundSimpleInfo) {
    if (!data) {
      this._fund = {};
      return;
    }
    this._fund = JSON.parse(JSON.stringify(data));
  }

  @Input()
  clients: FundClient[] = [];

  @Output()
  saved: EventEmitter<FundSimpleInfo> = new EventEmitter();

  _fund: FundSimpleInfo = {};

  constructor() { }

  ngOnInit() {
  }

  save() {
    this.saved.emit(this._fund);
  }

  getClientDisplay(client: FundClient) {
    if (!client) {
      return 'undefined';
    }
    if (client.email) {
      return client.firstName + ' ' + client.lastName + ' (' + client.email + ')';
    }
    return client.firstName + ' ' + client.lastName;
  }
}
