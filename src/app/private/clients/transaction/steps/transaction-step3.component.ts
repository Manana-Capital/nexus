import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TransactionState} from '../transaction.component';

@Component({
  selector: 'nx-transaction-step3',
  templateUrl: './transaction-step3.component.html',
})
export class TransactionStep3Component implements OnInit {
  @Input()
  state: TransactionState;

  @Output()
  againRequested: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {

  }

  onAgain() {
    this.againRequested.emit(0);
  }
}
