import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import { FundClient, FundSimpleInfo } from '../../core/api/model';
import { AuthService } from '../../core/auth/auth.service';
import { TransactionForm } from './transaction-form';
import { commitDto, defaultClientId, defaultFundId, draftToDto, toTransactionType, TRANSACTION_NAMES, TransactionDraft, TransactionDto } from './transaction-logic';
import { TransactionPreview } from './transaction-preview';

@Component({
  selector: 'nx-transaction',
  imports: [NzButtonModule, NzResultModule, NzSkeletonModule, NzStepsModule, TransactionForm, TransactionPreview],
  template: `
    <div class="nx-page">
      <div class="nx-page-head">
        <div>
          <h1>{{ name() }}</h1>
          <p>{{ description() }}</p>
        </div>
      </div>

      <section class="nx-panel">
        <nz-steps class="steps" [nzCurrent]="step()" [nzDirection]="isSmall() ? 'vertical' : 'horizontal'">
          <nz-step [nzTitle]="name()"></nz-step>
          <nz-step nzTitle="Preview"></nz-step>
          <nz-step nzTitle="Result"></nz-step>
        </nz-steps>

        <div class="body">
          @if (loading()) {
            <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 6 }"></nz-skeleton>
          } @else if (loadFailed()) {
            <p class="nx-muted">Funds and clients could not be loaded.</p>
            <button nz-button type="button" (click)="load()">Try again</button>
          } @else {
            @switch (step()) {
              @case (0) {
                <nx-transaction-form [type]="type()" [draft]="draft()" [funds]="funds()" [clients]="clients()" [processing]="processing()" (submitted)="showPreview($event)" />
              }
              @case (1) {
                <nx-transaction-preview [type]="type()" [name]="name()" [data]="preview()!" [funds]="funds()" [clients]="clients()" [processing]="processing()" (confirmed)="commit()" (back)="step.set(0)" />
              }
              @case (2) {
                <nz-result nzStatus="success" [nzTitle]="name() + ' completed'" nzSubTitle="Transaction was created successfully">
                  <div nz-result-extra>
                    <button nz-button type="button" (click)="step.set(0)">Repeat</button>
                  </div>
                </nz-result>
              }
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    .steps { display: flex; margin-bottom: 24px; }
    .body { max-width: 560px; margin: 0 auto; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transaction {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly breakpoints = inject(BreakpointObserver);

  /** Route parameter. */
  readonly typeParam = input<string | undefined>(undefined, { alias: 'type' });

  protected readonly type = computed(() => toTransactionType(this.typeParam()));
  protected readonly name = computed(() => TRANSACTION_NAMES[this.type()]);
  protected readonly description = computed(() => ({ deposit: 'Add a deposit of a client to a fund', withdrawal: 'Record a withdrawal of a client from a fund', transfer: 'Move shares of a fund between clients' })[this.type()]);
  protected readonly isSmall = toSignal(this.breakpoints.observe('(max-width: 575px)').pipe(map((x) => x.matches)), { initialValue: false });

  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly funds = signal<FundSimpleInfo[]>([]);
  protected readonly clients = signal<FundClient[]>([]);

  protected readonly step = signal(0);
  protected readonly processing = signal(false);
  protected readonly draft = signal<TransactionDraft>(this.newDraft());
  protected readonly preview = signal<TransactionDto | null>(null);

  /** A response belongs to the transaction type it was requested for, the route can change meanwhile. */
  private requestId = 0;

  constructor() {
    // the same instance serves all three types, a preview must not get committed as a different type
    effect(() => {
      this.type();
      untracked(() => this.restart());
    });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    forkJoin({ funds: this.api.fundsSimple(), clients: this.api.clients() }).subscribe({
      next: ({ funds, clients }) => {
        this.funds.set(funds);
        this.clients.set([...clients].sort((a, b) => (a.fundClientId ?? 0) - (b.fundClientId ?? 0)));
        this.draft.set(this.newDraft());
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    });
  }

  protected showPreview(draft: TransactionDraft): void {
    // keeps what was typed, the preview's computed amounts would take over the form on the way back
    this.draft.set(draft);
    this.send(draftToDto(this.type(), draft), (response) => {
      this.preview.set(response);
      this.step.set(1);
    });
  }

  protected commit(): void {
    const preview = this.preview();
    if (preview) {
      this.send(commitDto(preview), () => this.step.set(2));
    }
  }

  private send(dto: TransactionDto, done: (response: TransactionDto) => void): void {
    if (this.processing()) {
      return;
    }
    const id = ++this.requestId;
    this.processing.set(true);
    this.request(dto).subscribe({
      next: (response) => {
        if (id === this.requestId) {
          this.processing.set(false);
          done(response);
        }
      },
      error: () => {
        if (id === this.requestId) {
          this.processing.set(false);
        }
      },
    });
  }

  private request(dto: TransactionDto): Observable<TransactionDto> {
    switch (this.type()) {
      case 'withdrawal':
        return this.api.withdraw(dto);
      case 'transfer':
        return this.api.transferShares(dto);
      default:
        return this.api.deposit(dto);
    }
  }

  private restart(): void {
    this.requestId++;
    this.processing.set(false);
    this.preview.set(null);
    this.step.set(0);
    this.draft.set(this.newDraft());
  }

  private newDraft(): TransactionDraft {
    const own = defaultClientId(this.clients(), this.auth.user()?.id);
    return {
      targetFundId: defaultFundId(this.funds()),
      clientId: own,
      fromClientId: own,
      toClientId: null,
      created: new Date(),
      shares: 0,
      amountUsd: 0,
      amountBtc: 0,
      note: null,
    };
  }
}
