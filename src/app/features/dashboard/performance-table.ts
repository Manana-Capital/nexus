import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FundPerformanceYear } from '../../core/api/model';
import { buildPerformanceMatrix, cellBackground, MatrixMode } from '../../core/funds/performance-matrix';

/** All years at one glance: rows of years instead of a table per year, any number of years fits the page. */
@Component({
  selector: 'nx-performance-table',
  imports: [DecimalPipe, FormsModule, NzRadioModule],
  template: `
    <div class="nx-panel-head">
      <h2>Monthly performance</h2>
      <nz-radio-group [ngModel]="mode()" (ngModelChange)="mode.set($event)" nzButtonStyle="solid" nzSize="small">
        <label nz-radio-button nzValue="fund">Fund</label>
        <label nz-radio-button nzValue="btc">Bitcoin</label>
        <label nz-radio-button nzValue="outperform">vs Bitcoin</label>
      </nz-radio-group>
    </div>
    <div class="nx-table-wrap" tabindex="0" aria-label="Monthly performance table">
      <table class="matrix">
        <thead>
          <tr>
            <th class="year">Year</th>
            @for (month of months; track month) {
              <th>{{ month }}</th>
            }
            <th class="total">Total</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.year) {
            <tr>
              <th class="year" scope="row">{{ row.year }}</th>
              @for (value of row.months; track $index) {
                <td [style.background]="color(value)">
                  @if (value !== null) {
                    {{ value | number: '1.1-1' }}
                  }
                </td>
              }
              <td class="total" [style.background]="color(row.total)">
                @if (row.total !== null) {
                  {{ row.total | number: '1.1-1' }}%
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .matrix { width: 100%; border-collapse: separate; border-spacing: 2px; min-width: 760px; }
    th { font-weight: 500; color: var(--nx-ink-3); font-size: 12px; padding: 4px 6px; text-align: right; }
    td { text-align: right; padding: 5px 6px; border-radius: 3px; font-size: 13px; white-space: nowrap; }
    .year { position: sticky; left: 0; background: var(--nx-surface); text-align: left; color: var(--nx-ink); z-index: 1; }
    .total { font-weight: 600; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceTable {
  readonly years = input<FundPerformanceYear[] | undefined>();

  protected readonly mode = signal<MatrixMode>('fund');
  protected readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  protected readonly rows = computed(() => buildPerformanceMatrix(this.years(), this.mode()));
  protected readonly color = cellBackground;
}
