import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { map, startWith } from 'rxjs';
import { FundClient, FundSimpleInfo } from '../../core/api/model';
import { clientLabel } from './client-label';
import { amountHint, amountSource, TransactionDraft, TransactionType } from './transaction-logic';

const MAX_AMOUNT = 1_000_000;
const amountValidators = [Validators.min(0), Validators.max(MAX_AMOUNT)];

function amountRequired(group: AbstractControl): ValidationErrors | null {
  return amountSource(group.getRawValue()) ? null : { amountRequired: true };
}

function differentClients(group: AbstractControl): ValidationErrors | null {
  const { fromClientId, toClientId } = group.getRawValue();
  return fromClientId !== null && fromClientId === toClientId ? { sameClients: true } : null;
}

@Component({
  selector: 'nx-transaction-form',
  imports: [ReactiveFormsModule, NzAlertModule, NzButtonModule, NzDatePickerModule, NzFormModule, NzInputModule, NzInputNumberModule, NzSelectModule],
  template: `
    @if (!funds().length) {
      <nz-alert class="notice" nzType="warning" nzShowIcon nzMessage="There is no fund available" nzDescription="A transaction needs a target fund. Funds are set up in the fund configuration."></nz-alert>
    }

    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label nzRequired>Fund</nz-form-label>
        <nz-form-control nzErrorTip="Choose a fund">
          <nz-select formControlName="targetFundId" nzPlaceHolder="Choose a fund">
            @for (fund of funds(); track fund.id) {
              <nz-option [nzLabel]="fund.displayName ?? ''" [nzValue]="fund.id"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      @if (type() === 'transfer') {
        <nz-form-item>
          <nz-form-label nzRequired>From</nz-form-label>
          <nz-form-control nzErrorTip="Choose a client">
            <nz-select formControlName="fromClientId" nzShowSearch nzPlaceHolder="Choose a client">
              @for (client of clients(); track client.fundClientId) {
                <nz-option [nzLabel]="label(client)" [nzValue]="client.fundClientId"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzRequired>To</nz-form-label>
          <nz-form-control nzErrorTip="Choose a client">
            <nz-select formControlName="toClientId" nzShowSearch nzPlaceHolder="Choose a client">
              @for (client of clients(); track client.fundClientId) {
                <nz-option [nzLabel]="label(client)" [nzValue]="client.fundClientId"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        @if (sameClients()) {
          <nz-alert class="notice" nzType="error" nzMessage="Shares can't be transferred to the same client"></nz-alert>
        }
      } @else {
        <nz-form-item>
          <nz-form-label nzRequired>Client</nz-form-label>
          <nz-form-control nzErrorTip="Choose a client">
            <nz-select formControlName="clientId" nzShowSearch nzPlaceHolder="Choose a client">
              @for (client of clients(); track client.fundClientId) {
                <nz-option [nzLabel]="label(client)" [nzValue]="client.fundClientId"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      }

      <nz-form-item>
        <nz-form-label nzRequired>Date</nz-form-label>
        <nz-form-control nzErrorTip="Choose a date">
          <nz-date-picker formControlName="created" [nzShowTime]="{ nzFormat: 'HH:mm' }" nzFormat="yyyy-MM-dd HH:mm" [nzAllowClear]="false" [nzPopupStyle]="datePopupStyle"></nz-date-picker>
        </nz-form-control>
      </nz-form-item>

      <div class="amounts">
        <nz-form-item>
          <nz-form-label>Shares</nz-form-label>
          <nz-form-control nzErrorTip="Between 0 and 1,000,000">
            <nz-input-number formControlName="shares" [nzMin]="0"></nz-input-number>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>USD</nz-form-label>
          <nz-form-control nzErrorTip="Between 0 and 1,000,000">
            <nz-input-number formControlName="amountUsd" [nzMin]="0"></nz-input-number>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>BTC</nz-form-label>
          <nz-form-control nzErrorTip="Between 0 and 1,000,000">
            <nz-input-number formControlName="amountBtc" [nzMin]="0"></nz-input-number>
          </nz-form-control>
        </nz-form-item>
      </div>
      <p class="nx-muted hint">{{ hint() }}</p>

      <nz-form-item>
        <nz-form-label>Note</nz-form-label>
        <nz-form-control>
          <textarea nz-input formControlName="note" [placeholder]="'Information about ' + type()" rows="3"></textarea>
        </nz-form-control>
      </nz-form-item>

      <button nz-button nzType="primary" type="submit" [nzLoading]="processing()" [disabled]="!valid()">Preview {{ type() }}</button>
    </form>
  `,
  styles: `
    :host { display: block; }
    nz-select, nz-date-picker, nz-input-number { width: 100%; }
    .notice { display: block; margin-bottom: 16px; }
    .amounts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); column-gap: 12px; }
    .amounts nz-form-item { margin-bottom: 8px; }
    .hint { margin: 0 0 16px; font-size: 12px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionForm {
  readonly type = input.required<TransactionType>();
  readonly draft = input.required<TransactionDraft>();
  readonly funds = input<FundSimpleInfo[]>([]);
  readonly clients = input<FundClient[]>([]);
  readonly processing = input(false);
  readonly submitted = output<TransactionDraft>();

  protected readonly form = inject(FormBuilder).group(
    {
      targetFundId: [null as number | null, Validators.required],
      clientId: [null as number | null],
      fromClientId: [null as number | null],
      toClientId: [null as number | null],
      created: [null as Date | null, Validators.required],
      shares: [0 as number | null, amountValidators],
      amountUsd: [0 as number | null, amountValidators],
      amountBtc: [0 as number | null, amountValidators],
      note: [null as string | null],
    },
    { validators: [amountRequired, differentClients] },
  );

  protected readonly valid = toSignal(this.form.statusChanges.pipe(map(() => this.form.valid)), { initialValue: false });
  private readonly values = toSignal(this.form.valueChanges.pipe(startWith(null), map(() => this.form.getRawValue())), { requireSync: true });

  protected readonly hint = computed(() => amountHint(this.values()));
  protected readonly sameClients = computed(() => {
    const { fromClientId, toClientId } = this.values();
    return fromClientId !== null && fromClientId === toClientId;
  });

  protected readonly label = clientLabel;
  // the calendar with its time columns is wider than a phone, the OK button has to stay reachable
  protected readonly datePopupStyle = { maxWidth: 'calc(100vw - 32px)', overflowX: 'auto' };

  constructor() {
    effect(() => {
      const transfer = this.type() === 'transfer';
      const draft = this.draft();
      const { clientId, fromClientId, toClientId } = this.form.controls;
      clientId.setValidators(transfer ? [] : [Validators.required]);
      fromClientId.setValidators(transfer ? [Validators.required] : []);
      toClientId.setValidators(transfer ? [Validators.required] : []);
      this.form.reset(draft);
    });
  }

  protected submit(): void {
    if (this.form.valid && !this.processing()) {
      this.submitted.emit(this.form.getRawValue());
    }
  }
}
