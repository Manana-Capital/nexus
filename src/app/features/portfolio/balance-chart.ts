import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { PortfolioBalanceTick } from '../../core/api/model';
import { SERIES_COLORS, timeChartOption, toPoints } from '../../core/charts/chart-options';
import { NxChart } from '../../core/charts/nx-chart';
import { CurrencyService, formatCurrency } from '../../core/currency.service';

@Component({
  selector: 'nx-balance-chart',
  imports: [FormsModule, NzRadioModule, NxChart],
  template: `
    <div class="nx-panel-head">
      <h2>{{ title() }}</h2>
      <nz-radio-group [ngModel]="view()" (ngModelChange)="view.set($event)" nzButtonStyle="solid" nzSize="small">
        <label nz-radio-button nzValue="balance">Balance</label>
        <label nz-radio-button nzValue="profit">Profit</label>
      </nz-radio-group>
    </div>
    <nx-chart [option]="option()" [height]="340" [label]="title() + ' over time'" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceChart {
  private readonly currency = inject(CurrencyService);

  readonly title = input('Portfolio');
  readonly balance = input.required<PortfolioBalanceTick[]>();
  readonly profit = input.required<PortfolioBalanceTick[]>();

  protected readonly view = signal<'balance' | 'profit'>('balance');

  protected readonly option = computed(() => {
    const selected = this.currency.selected();
    const format = (value: number) => formatCurrency(value, selected, selected === 'BTC');
    const value = (x: PortfolioBalanceTick) => this.currency.pick(x, 'value');

    if (this.view() === 'profit') {
      return timeChartOption({
        series: [{ name: 'Profit', color: SERIES_COLORS.fund, points: toPoints(this.profit(), (x) => x.timestamp, value), area: true }],
        format,
      });
    }
    return timeChartOption({
      series: [
        { name: 'Balance', color: SERIES_COLORS.fund, points: toPoints(this.balance(), (x) => x.timestamp, value), area: true },
        { name: 'Deposited', color: SERIES_COLORS.btc, points: toPoints(this.balance(), (x) => x.timestamp, (x) => this.currency.pick(x, 'deposited')), step: true },
      ],
      format,
    });
  });
}
