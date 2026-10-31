import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FundClient, FundSimpleInfo } from '../../core/api/model';
import { clientConfirmationLabel } from './client-label';
import { TransactionDto, TransactionType } from './transaction-logic';

@Component({
  selector: 'nx-transaction-preview',
  imports: [DatePipe, DecimalPipe, NzButtonModule],
  template: `
    <p class="nx-muted notice">{{ name() }} preview, check the amounts and continue</p>

    <dl>
      <dt>Target fund</dt>
      <dd>{{ fundName() }}</dd>
      @if (type() === 'transfer') {
        <dt>From client</dt>
        <dd>{{ clientOf(data().fromClientId) }}</dd>
        <dt>To client</dt>
        <dd>{{ clientOf(data().toClientId) }}</dd>
      } @else {
        <dt>For client</dt>
        <dd>{{ clientOf(data().clientId) }}</dd>
      }
      <dt>For date</dt>
      <dd>{{ data().created | date: 'd MMM y, HH:mm' }}</dd>
      <dt>Shares</dt>
      <dd><strong>{{ data().shares | number: '1.2-2' }}</strong></dd>
      <dt>Amount USD</dt>
      <dd><strong>{{ data().amountUsd | number: '1.2-2' }}</strong></dd>
      <dt>Amount BTC</dt>
      <dd>{{ data().amountBtc | number: '1.2-8' }}</dd>
      <dt>Amount CZK</dt>
      <dd>{{ data().amountCzk | number: '1.2-2' }}</dd>
      @if (data().note) {
        <dt>Note</dt>
        <dd class="note">{{ data().note }}</dd>
      }
    </dl>

    <div class="actions">
      <button nz-button nzType="primary" type="button" [nzLoading]="processing()" (click)="confirmed.emit()">{{ name() }}</button>
      <button nz-button type="button" [disabled]="processing()" (click)="back.emit()">Back</button>
    </div>
  `,
  styles: `
    :host { display: block; }
    .notice { margin: 0 0 16px; }
    dl { display: grid; grid-template-columns: minmax(90px, 140px) minmax(0, 1fr); gap: 8px 16px; margin: 0 0 20px; }
    dt { color: var(--nx-ink-3); font-weight: 400; }
    dd { margin: 0; overflow-wrap: anywhere; }
    .note { white-space: pre-wrap; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionPreview {
  readonly type = input.required<TransactionType>();
  readonly name = input.required<string>();
  readonly data = input.required<TransactionDto>();
  readonly funds = input<FundSimpleInfo[]>([]);
  readonly clients = input<FundClient[]>([]);
  readonly processing = input(false);
  readonly confirmed = output<void>();
  readonly back = output<void>();

  protected readonly fundName = computed(() => this.funds().find((x) => x.id === this.data().targetFundId)?.displayName ?? 'unknown');

  protected clientOf(id: number | undefined): string {
    const client = this.clients().find((x) => x.fundClientId === id);
    return client ? clientConfirmationLabel(client) : 'unknown';
  }
}
