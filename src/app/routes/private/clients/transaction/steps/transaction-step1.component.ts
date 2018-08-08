import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FundClient} from '@core/api/generated/defs/FundClient';
import {FundInfo} from '@core/api/generated/defs/FundInfo';
import {TransactionState} from '../transaction.component';

@Component({
  selector: 'nx-transaction-step1',
  templateUrl: './transaction-step1.component.html',
  styles: [`
    :host ::ng-deep .ant-calendar-picker {
      width: 100%;
    }
    :host ::ng-deep nz-input-number {
      width: 100%;
    }
  `]
})
export class TransactionStep1Component implements OnInit {

  @Input()
  state: TransactionState;

  @Input()
  defaultData;

  @Input()
  clients: FundClient[];

  @Input()
  funds: FundInfo[];

  @Input()
  isProcessing: boolean = false;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();

  _form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this._form = this.fb.group({
      targetFundId: [
        null,
        Validators.compose([Validators.required]),
      ],
      fromClientId: [null, [Validators.required]],
      toClientId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      shares: [
        0,
        Validators.compose([
          Validators.pattern(`\\d+\\.?\\d*`),
          Validators.min(0),
          Validators.max(10000 * 100),
        ]),
      ],
      amountUsd: [
        0,
        Validators.compose([
          Validators.pattern(`\\d+\\.?\\d*`),
          Validators.min(0),
          Validators.max(10000 * 100),
        ]),
      ],
      amountBtc: [
        0,
        Validators.compose([
          Validators.pattern(`\\d+\\.?\\d*`),
          Validators.min(0),
          Validators.max(10000 * 100),
        ]),
      ],
      created: [null, [Validators.required]],
      note: [],
    });
    this._form.patchValue(this.defaultData);
  }

  submitForm() {
    this.submitted.emit(this._form.value);
  }

  getClientDisplay(client: FundClient) {
    if(!client)
      return 'undefined';
    if(client.email)
      return client.firstName + ' ' + client.lastName + ' (' + client.email + ')'
    return client.firstName + ' ' + client.lastName;
  }
}
