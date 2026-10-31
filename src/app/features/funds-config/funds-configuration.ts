import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ApiService } from '../../core/api/api.service';
import { Balance, ConnectorDefinitionDto, FundClient, FundConnectorDto, FundSimpleInfo, TotalBalance } from '../../core/api/model';
import { AuthService } from '../../core/auth/auth.service';
import { clientName } from '../clients/client-label';
import { defaultFundId } from '../clients/transaction-logic';
import { ConnectorForm } from './connector-form';
import { FundForm } from './fund-form';

type ConfigModal = 'fund-edit' | 'fund-create' | 'connector-edit' | 'connector-create' | 'connector-check';

@Component({
  selector: 'nx-funds-configuration',
  imports: [DecimalPipe, NzAlertModule, NzButtonModule, NzIconModule, NzModalModule, NzSkeletonModule, NzSpinModule, NzTooltipModule, ConnectorForm, FundForm],
  templateUrl: './funds-configuration.html',
  styleUrl: './funds-configuration.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsConfiguration {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly message = inject(NzMessageService);

  protected readonly canManage = computed(() => this.auth.hasRole('Manager'));

  protected readonly loading = signal(true);
  protected readonly funds = signal<FundSimpleInfo[]>([]);
  protected readonly clients = signal<FundClient[]>([]);
  protected readonly definitions = signal<ConnectorDefinitionDto[]>([]);
  protected readonly selectedFundId = signal<number | null>(null);
  protected readonly loadingConnectors = signal(false);
  protected readonly connectors = signal<FundConnectorDto[]>([]);

  protected readonly modal = signal<ConfigModal | null>(null);
  protected readonly saving = signal(false);
  protected readonly updatingTasks = signal(false);
  protected readonly editedFund = signal<FundSimpleInfo | null>(null);
  protected readonly editedConnector = signal<FundConnectorDto | null>(null);

  protected readonly checked = signal<FundConnectorDto | null>(null);
  protected readonly checkedBalances = signal<Balance[]>([]);
  protected readonly checkedTotal = signal<TotalBalance | null>(null);
  protected readonly computingTotal = signal(false);
  private checkId = 0;

  protected readonly selectedFund = computed(() => this.funds().find((x) => x.id === this.selectedFundId()) ?? null);

  constructor() {
    // the role is known only after the user info arrives, and connectors with their secrets are for managers
    effect(() => {
      if (this.canManage()) {
        untracked(() => {
          this.load();
          this.api.clients().subscribe({ next: (x) => this.clients.set(x), error: () => this.clients.set([]) });
          this.api.connectorDefinitions().subscribe({ next: (x) => this.definitions.set(x), error: () => this.definitions.set([]) });
        });
      }
    });
  }

  protected load(): void {
    this.loading.set(true);
    this.api.fundsSimple().subscribe({
      next: (funds) => {
        this.funds.set(funds);
        this.loading.set(false);
        this.selectFund(defaultFundId(funds, this.selectedFundId()), true);
      },
      error: () => this.loading.set(false),
    });
  }

  protected selectFund(id: number | null | undefined, reload = false): void {
    const fundId = id ?? null;
    if (fundId === this.selectedFundId() && !reload) {
      return;
    }
    this.selectedFundId.set(fundId);
    this.connectors.set([]);
    if (fundId === null) {
      this.loadingConnectors.set(false);
      return;
    }
    this.loadingConnectors.set(true);
    this.api.connectors(fundId).subscribe({
      next: (connectors) => {
        // switching funds quickly must not show connectors of the previous one under the new one
        if (fundId === this.selectedFundId()) {
          this.connectors.set(connectors);
          this.loadingConnectors.set(false);
        }
      },
      error: () => {
        if (fundId === this.selectedFundId()) {
          this.loadingConnectors.set(false);
        }
      },
    });
  }

  protected ownerName(ownerId: number | undefined): string {
    return clientName(this.clients().find((x) => x.fundClientId === ownerId));
  }

  protected closeModal(): void {
    this.modal.set(null);
  }

  protected openFund(fund: FundSimpleInfo | null): void {
    this.editedFund.set(fund);
    this.modal.set(fund ? 'fund-edit' : 'fund-create');
  }

  protected saveFund(fund: FundSimpleInfo): void {
    this.saving.set(true);
    this.api.updateFund(fund).subscribe({
      next: (response) => {
        this.funds.update((list) => list.map((x) => (x.id === response.id ? { ...x, ...response } : x)));
        this.message.success(`Fund '${response.displayName}' was updated`);
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  protected createFund(fund: FundSimpleInfo): void {
    this.saving.set(true);
    this.api.createFund(fund).subscribe({
      next: (response) => {
        this.funds.update((list) => [...list, response]);
        this.message.success(`Fund '${response.displayName}' was created`);
        this.saving.set(false);
        this.closeModal();
        if (this.selectedFundId() === null) {
          this.selectFund(response.id);
        }
      },
      error: () => this.saving.set(false),
    });
  }

  protected updateTasks(): void {
    this.updatingTasks.set(true);
    this.api.updateBackgroundTasks().subscribe({
      next: () => {
        this.message.success('Background tasks were updated');
        this.updatingTasks.set(false);
      },
      error: () => this.updatingTasks.set(false),
    });
  }

  protected openConnector(connector: FundConnectorDto | null): void {
    this.editedConnector.set(connector);
    this.modal.set(connector ? 'connector-edit' : 'connector-create');
  }

  protected saveConnector(connector: FundConnectorDto): void {
    this.saving.set(true);
    this.api.updateConnector(connector).subscribe({
      next: (response) => {
        this.connectors.update((list) => list.map((x) => (x.connectorId === response.connectorId ? { ...x, ...response } : x)));
        this.message.success(`Connector '${response.displayName}' was updated`);
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  protected assignConnector(connector: FundConnectorDto): void {
    const targetFundId = this.selectedFundId();
    if (targetFundId === null) {
      return;
    }
    const created = { ...connector, targetFundId };
    this.saving.set(true);
    this.api.assignConnector(created).subscribe({
      next: (connectorId) => {
        if (targetFundId === this.selectedFundId()) {
          this.connectors.update((list) => [...list, { ...created, connectorId }]);
        }
        this.message.success(`Connector '${created.displayName}' was assigned`);
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  protected check(connector: FundConnectorDto): void {
    if (connector.connectorId === undefined) {
      return;
    }
    const id = ++this.checkId;
    const progress = this.message.loading(`Checking connector '${connector.exchangeName}'...`, { nzDuration: 0 });
    this.api.checkConnector(connector.connectorId).subscribe({
      next: (balances) => {
        this.message.remove(progress.messageId);
        if (id === this.checkId) {
          this.checked.set(connector);
          this.checkedBalances.set(balances);
          this.checkedTotal.set(null);
          this.modal.set('connector-check');
        }
      },
      error: () => this.message.remove(progress.messageId),
    });
  }

  protected computeTotal(): void {
    const connectorId = this.checked()?.connectorId;
    if (connectorId === undefined) {
      return;
    }
    const id = this.checkId;
    this.computingTotal.set(true);
    this.api.checkConnectorTotal(connectorId).subscribe({
      next: (total) => {
        if (id === this.checkId) {
          this.checkedTotal.set(total);
        }
        this.computingTotal.set(false);
      },
      error: () => this.computingTotal.set(false),
    });
  }
}
