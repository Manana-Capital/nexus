import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FundInfo} from '@core/backend/generated/defs/FundInfo';
import {FundClient} from '@core/backend/generated/defs/FundClient';
import {TransactionState} from '../transaction.component';

@Component({
  selector: 'nx-transaction-step2',
  templateUrl: './transaction-step2.component.html',
  styles: [`
    :host ::ng-deep .ant-form-item {
      margin-bottom: 0;
    }
  `]
})
export class TransactionStep2Component implements OnInit {
  @Input()
  state: TransactionState;

  @Input()
  data;

  @Input()
  clients: FundClient[];

  @Input()
  funds: FundInfo[];

  @Input()
  isProcessing = false;

  @Output()
  submitted: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  backRequested: EventEmitter<number> = new EventEmitter<number>();

  _targetFundName: string;
  _fromClientName: string;
  _clientName: string;
  _toClientName: string;

  constructor() {}

  ngOnInit() {
    this._targetFundName = this.funds.find(x => x.id == this.data.targetFundId).displayName;
    this._fromClientName = this.getClientName(this.data.fromClientId, this.clients);
    this._toClientName = this.getClientName(this.data.toClientId, this.clients);
    this._clientName = this.getClientName(this.data.clientId, this.clients);
  }

  submitForm() {
    this.submitted.emit(0);
  }

  goBack() {
    this.backRequested.emit(0);
  }

  private getClientName(clientId: number, clients: FundClient[]) {
    const found = clients.find(x => x.fundClientId === clientId);
    if (!found) {
      return 'unknown';
    }
    const fullName = found.firstName + ' ' + found.lastName;
    if (found.isSystem) {
      return fullName + ' [COMPANY account]';
    }
    if (found.email) {
      return fullName + ' (' + found.email + ')';
    }
    return fullName;
  }
}
