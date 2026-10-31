import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ApiService } from '../../core/api/api.service';
import { ConnectorStatusDto, FundBalancePerExchange, FundTotalBalanceInfo } from '../../core/api/model';
import { SERIES_COLORS, timeChartOption, toPoints } from '../../core/charts/chart-options';
import { NxChart } from '../../core/charts/nx-chart';
import { Currency, formatCurrency } from '../../core/currency.service';
import { btcOnly, btcOnlyOfFund, btcRatio, sortExchanges } from '../../core/funds/portfolio-math';

@Component({
  selector: 'nx-funds-overview',
  imports: [DatePipe, DecimalPipe, FormsModule, NzButtonModule, NzIconModule, NzRadioModule, NzSkeletonModule, NzTooltipModule, NxChart],
  templateUrl: './funds-overview.html',
  styleUrl: './funds-overview.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsOverview {
  private readonly api = inject(ApiService);

  protected readonly loading = signal(true);
  protected readonly funds = signal<FundTotalBalanceInfo[]>([]);
  protected readonly statuses = signal<ConnectorStatusDto[]>([]);
  private readonly selectedId = signal<number | null>(null);
  protected readonly selectedConnector = signal<number | null>(null);
  protected readonly history = signal<FundBalancePerExchange[] | null>(null);
  protected readonly historyCurrency = signal<Currency>('USD');

  protected readonly selected = computed(() => {
    const funds = this.funds();
    return funds.find((x) => x.fund?.id === this.selectedId()) ?? funds[0] ?? null;
  });

  protected readonly exchanges = computed(() => sortExchanges(this.selected()?.balances));

  private readonly statusByConnector = computed(() => new Map(this.statuses().map((x) => [x.connectorId, x])));

  protected readonly unhealthy = computed(() => this.statuses().filter((x) => !x.isHealthy));

  protected readonly historyChart = computed(() => {
    const history = this.history();
    if (!history) {
      return null;
    }
    const currency = this.historyCurrency();
    const read = (x: FundBalancePerExchange) => (currency === 'USD' ? x.amountUsd : currency === 'BTC' ? x.amountBtc : x.amountCzk);
    return timeChartOption({
      series: [{ name: `Balance (${currency})`, color: SERIES_COLORS.fund, points: toPoints(history, (x) => x.gathered, read), area: true }],
      format: (value) => formatCurrency(value, currency, currency === 'BTC'),
    });
  });

  protected readonly btcOnly = btcOnly;
  protected readonly btcOnlyOfFund = btcOnlyOfFund;
  protected readonly btcRatio = btcRatio;

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.fundBalances().subscribe({
      next: (funds) => {
        this.funds.set(funds);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.connectorStatuses().subscribe({ next: (x) => this.statuses.set(x), error: () => this.statuses.set([]) });
  }

  protected selectFund(fund: FundTotalBalanceInfo): void {
    this.selectedId.set(fund.fund?.id ?? null);
    this.selectedConnector.set(null);
    this.history.set(null);
  }

  protected selectConnector(connectorId: number | undefined): void {
    if (connectorId === undefined || connectorId === this.selectedConnector()) {
      return;
    }
    this.selectedConnector.set(connectorId);
    this.history.set(null);
    this.api.connectorHistory(connectorId).subscribe({ next: (x) => this.history.set(x), error: () => this.selectedConnector.set(null) });
  }

  protected status(connectorId: number | undefined): ConnectorStatusDto | undefined {
    return connectorId === undefined ? undefined : this.statusByConnector().get(connectorId);
  }

  protected percentOf(diff: number | undefined, total: number | undefined): number {
    return total ? (Math.abs(diff ?? 0) / total) * 100 : 0;
  }

  protected tone(value: number | undefined): string {
    return !value ? '' : value > 0 ? 'nx-gain' : 'nx-loss';
  }
}
