import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ApiService } from '../../core/api/api.service';
import { FundInfo } from '../../core/api/model';
import { AuthService } from '../../core/auth/auth.service';
import { RangeKey, SERIES_COLORS, timeChartOption, toPoints } from '../../core/charts/chart-options';
import { NxChart } from '../../core/charts/nx-chart';
import { PerformanceTable } from './performance-table';

const STALE_AFTER_DAYS = 2;

@Component({
  selector: 'nx-dashboard',
  imports: [DecimalPipe, FormsModule, NzButtonModule, NzIconModule, NzRadioModule, NzSkeletonModule, NzSwitchModule, NzTooltipModule, NxChart, PerformanceTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  /** Selected fund comes from the address, it survives a reload and can be shared. */
  readonly fund = input<string | undefined>();

  protected readonly loading = signal(true);
  protected readonly funds = signal<FundInfo[]>([]);
  protected readonly range = signal<RangeKey>('ALL');
  protected readonly log = signal(false);
  protected readonly today = new Date();
  protected readonly ranges: RangeKey[] = ['1Y', '3Y', '5Y', 'ALL'];

  protected readonly selected = computed(() => {
    const funds = this.funds();
    return funds.find((x) => x.id === Number(this.fund())) ?? funds[0] ?? null;
  });

  private readonly btcByDay = computed(() => new Map((this.selected()?.btcTicks ?? []).map((x) => [x.timestamp?.slice(0, 10), x])));

  protected readonly chart = computed(() => {
    const fund = this.selected();
    if (!fund) {
      return null;
    }
    return timeChartOption({
      series: [
        { name: fund.displayName ?? 'Fund', color: SERIES_COLORS.fund, points: toPoints(fund.ticks, (x) => x.gathered, (x) => x.price) },
        { name: 'Bitcoin', color: SERIES_COLORS.btc, points: toPoints(fund.btcTicks, (x) => x.timestamp, (x) => x.pricePerShare) },
      ],
      format: (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      range: this.range(),
      log: this.log(),
      details: (time) => {
        const btc = this.btcByDay().get(new Date(time).toISOString().slice(0, 10));
        return btc?.close ? [`BTC price: $${btc.close.toLocaleString('en-US', { maximumFractionDigits: 0 })}`] : [];
      },
    });
  });

  constructor() {
    this.load();
    // funds visible to the visitor change with signing in
    let wasAuthenticated = this.auth.isAuthenticated();
    effect(() => {
      const authenticated = this.auth.isAuthenticated();
      if (authenticated !== wasAuthenticated) {
        wasAuthenticated = authenticated;
        this.load();
      }
    });
  }

  protected load(): void {
    this.loading.set(true);
    this.api.fundsComplex().subscribe({
      next: (funds) => {
        this.funds.set(funds.filter((x) => !x.isHidden));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected select(fund: FundInfo): void {
    this.router.navigate([], { queryParams: { fund: fund.id }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  protected lastUpdate(fund: FundInfo): Date | null {
    const last = fund.ticks?.at(-1)?.gathered;
    return last ? new Date(last) : null;
  }

  /** A fund that stopped updating must not look like a fund with flat performance. */
  protected staleDays(fund: FundInfo): number {
    const last = this.lastUpdate(fund);
    if (!last) {
      return 0;
    }
    const days = Math.floor((this.today.getTime() - last.getTime()) / 86_400_000);
    return days >= STALE_AFTER_DAYS ? days : 0;
  }

  protected tone(value: number | undefined): string {
    return !value ? '' : value > 0 ? 'nx-gain' : 'nx-loss';
  }
}
