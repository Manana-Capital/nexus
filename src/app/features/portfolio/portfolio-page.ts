import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ApiService } from '../../core/api/api.service';
import { PortfolioInfo } from '../../core/api/model';
import { CurrencyService } from '../../core/currency.service';
import { PortfolioOverview } from './portfolio-overview';

@Component({
  selector: 'nx-portfolio-page',
  imports: [DatePipe, FormsModule, NzRadioModule, NzSkeletonModule, PortfolioOverview],
  template: `
    <div class="nx-page">
      <div class="nx-page-head">
        <div>
          <h1>{{ portfolio()?.client?.firstName ? 'Hello, ' + portfolio()?.client?.firstName : 'Portfolio' }}</h1>
          @if (portfolio()?.lastLoginInfo; as login) {
            <p>Last login {{ login.timestamp | date: 'd MMM y, HH:mm' }} by {{ login.provider }} · active funds {{ portfolio()?.activeFunds }} of {{ portfolio()?.totalFunds }}</p>
          }
        </div>
        <nz-radio-group [ngModel]="currency.selected()" (ngModelChange)="currency.select($event)" nzButtonStyle="solid" aria-label="Currency">
          <label nz-radio-button nzValue="USD">USD</label>
          <label nz-radio-button nzValue="CZK">CZK</label>
          <label nz-radio-button nzValue="BTC">BTC</label>
        </nz-radio-group>
      </div>
      @if (loading()) {
        <div class="nx-panel"><nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }"></nz-skeleton></div>
      } @else {
        <nx-portfolio-overview [portfolio]="portfolio()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPage {
  private readonly api = inject(ApiService);
  protected readonly currency = inject(CurrencyService);

  readonly clientId = input<string | undefined>();

  protected readonly portfolio = signal<PortfolioInfo | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    effect(() => {
      const clientId = this.clientId();
      this.loading.set(true);
      (clientId ? this.api.portfolioOf(Number(clientId)) : this.api.portfolio()).subscribe({
        next: (data) => {
          this.portfolio.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }
}
