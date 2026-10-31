import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PortfolioFundInfo, PortfolioInfo, PortfolioTransaction } from '../../core/api/model';
import { CurrencyService } from '../../core/currency.service';
import { averageBtcPrice, mergeFundTicks, portfolioFunds, profitPercent } from '../../core/funds/portfolio-math';
import { BalanceChart } from './balance-chart';

type Row = PortfolioTransaction & { type: 'deposit' | 'withdrawal' };

/** Holdings of one client across all their funds: the total first, then fund by fund. */
@Component({
  selector: 'nx-portfolio-overview',
  imports: [DatePipe, DecimalPipe, NgTemplateOutlet, FormsModule, NzSwitchModule, NzTabsModule, BalanceChart],
  templateUrl: './portfolio-overview.html',
  styleUrl: './portfolio-overview.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioOverview {
  protected readonly currency = inject(CurrencyService);

  readonly portfolio = input.required<PortfolioInfo | null>();

  protected readonly funds = computed(() => portfolioFunds(this.portfolio()));
  protected readonly selectedIndex = signal(0);
  protected readonly together = signal(true);

  protected readonly totalBalance = computed(() => mergeFundTicks(this.funds().map((x) => x.balanceTicks ?? [])));
  protected readonly totalProfit = computed(() => mergeFundTicks(this.funds().map((x) => x.profitTicks ?? [])));

  protected readonly summary = computed(() => {
    const info = this.portfolio();
    const balance = this.currency.pick(info, 'totalAssets');
    const profit = this.currency.pick(info, 'totalProfit');
    const deposited = this.funds().reduce((sum, x) => sum + this.deposited(x), 0);
    const withdrawn = this.funds().reduce((sum, x) => sum + this.withdrawn(x), 0);
    return { balance, profit, deposited, withdrawn, percent: profitPercent(balance, deposited, withdrawn) };
  });

  protected deposited(fund: PortfolioFundInfo): number {
    return (fund.deposits ?? []).reduce((sum, x) => sum + this.currency.pick(x, 'amount'), 0);
  }

  protected withdrawn(fund: PortfolioFundInfo): number {
    return (fund.withdrawals ?? []).reduce((sum, x) => sum + this.currency.pick(x, 'amount'), 0);
  }

  protected fundPercent(fund: PortfolioFundInfo): number {
    return profitPercent(this.currency.pick(fund, 'assets'), this.deposited(fund), this.withdrawn(fund));
  }

  protected averagePrice(transactions: PortfolioTransaction[] | undefined): number {
    const field = `amount${{ USD: 'Usd', CZK: 'Czk', BTC: 'Btc' }[this.currency.selected()]}` as keyof PortfolioTransaction & string;
    return averageBtcPrice(transactions, field, 'amountBtc');
  }

  protected transactions(fund: PortfolioFundInfo): Row[] {
    const deposits = (fund.deposits ?? []).map((x): Row => ({ ...x, type: 'deposit' }));
    const withdrawals = (fund.withdrawals ?? []).map((x): Row => ({ ...x, type: 'withdrawal' }));
    return this.sorted([...deposits, ...withdrawals]);
  }

  protected sorted<T extends PortfolioTransaction>(rows: T[] | undefined): T[] {
    return [...(rows ?? [])].sort((a, b) => new Date(b.created ?? '').getTime() - new Date(a.created ?? '').getTime());
  }

  protected tone(value: number): string {
    return !value ? '' : value > 0 ? 'nx-gain' : 'nx-loss';
  }
}
