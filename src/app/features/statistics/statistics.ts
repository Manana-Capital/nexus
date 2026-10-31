import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'nx-statistics',
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="nx-page">
      <div class="nx-page-head">
        <div>
          <h1>Statistics</h1>
          @if (data(); as d) {
            <p>Trading from {{ d.tradedFrom | date }} to {{ d.tradedTo | date }}</p>
          }
        </div>
      </div>
      @if (data(); as d) {
        <div class="nx-panel nx-stats">
          <div><div class="nx-stat-label">Trades</div><div class="nx-stat-value">{{ d.tradedTransactionsCount | number: '1.0-0' }}</div></div>
          <div><div class="nx-stat-label">Traded amount</div><div class="nx-stat-value">{{ d.tradedAmountBtc | number: '1.0-0' }} BTC</div></div>
          <div><div class="nx-stat-label">Traded amount</div><div class="nx-stat-value">{{ d.tradedAmountUsd | number: '1.0-0' }} USD</div></div>
          <div><div class="nx-stat-label">Active bots</div><div class="nx-stat-value">{{ d.activeBots }}</div></div>
        </div>
        <div class="nx-panel">
          <div class="nx-panel-head"><h2>Exchanges</h2></div>
          <div class="tags">
            @for (exchange of d.activeExchanges; track exchange) {
              <span class="tag">{{ exchange }}</span>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { padding: 3px 10px; border: 1px solid var(--nx-line); border-radius: 12px; color: var(--nx-ink-2); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics {
  protected readonly data = toSignal(inject(ApiService).statistics().pipe(catchError(() => of(null))), { initialValue: null });
}
