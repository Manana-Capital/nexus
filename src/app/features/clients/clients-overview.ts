import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ApiService } from '../../core/api/api.service';
import { PortfolioInfo, ProfileInfoDto, UpdateProfileExtendedDto, UpdateProfilePasswordDto } from '../../core/api/model';
import { AuthService } from '../../core/auth/auth.service';
import { PortfolioOverview } from '../portfolio/portfolio-overview';
import { ClientAccessForm } from '../profile/client-access-form';
import { ClientProfileForm } from '../profile/client-profile-form';
import { clientInitials, clientLabel, clientName } from './client-label';

type ClientModal = 'profile' | 'access' | 'create';

@Component({
  selector: 'nx-clients-overview',
  imports: [DatePipe, NzAvatarModule, NzButtonModule, NzCollapseModule, NzIconModule, NzModalModule, NzPopconfirmModule, NzSkeletonModule, NzTagModule, PortfolioOverview, ClientAccessForm, ClientProfileForm],
  templateUrl: './clients-overview.html',
  styleUrl: './clients-overview.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsOverview {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly message = inject(NzMessageService);

  protected readonly canManage = computed(() => this.auth.hasRole('Manager'));

  protected readonly loading = signal(true);
  protected readonly portfolios = signal<PortfolioInfo[]>([]);
  protected readonly expandedId = signal<number | null>(null);
  protected readonly modal = signal<ClientModal | null>(null);
  protected readonly saving = signal(false);
  private readonly selectedId = signal<number | null>(null);

  protected readonly selectedClient = computed(() => this.portfolios().find((x) => x.client?.id === this.selectedId())?.client ?? null);
  protected readonly selectedName = computed(() => clientName(this.selectedClient()));

  protected readonly label = clientLabel;
  protected readonly initials = clientInitials;

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.expandedId.set(null);
    this.api.portfolios().subscribe({
      next: (data) => {
        this.portfolios.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  /** Portfolios carry charts, only the opened one gets rendered. */
  protected onToggle(clientId: number | undefined, active: boolean): void {
    if (active) {
      this.expandedId.set(clientId ?? null);
    } else if (this.expandedId() === clientId) {
      this.expandedId.set(null);
    }
  }

  protected open(modal: ClientModal, portfolio?: PortfolioInfo): void {
    this.selectedId.set(portfolio?.client?.id ?? null);
    this.modal.set(modal);
  }

  protected closeModal(): void {
    this.modal.set(null);
  }

  protected saveProfile(value: UpdateProfileExtendedDto): void {
    const id = this.selectedId();
    if (id === null || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.api.updateProfileOf(id, value).subscribe({
      next: (response) => {
        this.patchClient(id, response);
        this.message.success(`Profile for ${clientName(response)} was updated`);
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  protected saveAccess(value: UpdateProfilePasswordDto): void {
    const id = this.selectedId();
    if (id === null || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.api.changePasswordOf(id, value).subscribe({
      next: () => {
        this.patchClient(id, { username: value.newUsername });
        this.message.success(`Username and password for ${this.selectedName()} was changed`);
        this.saving.set(false);
        this.closeModal();
      },
      error: () => this.saving.set(false),
    });
  }

  protected createClient(value: UpdateProfileExtendedDto): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.api.createClient(value).subscribe({
      next: (response) => {
        this.message.success(`Account for ${clientName(response)} was created`);
        this.saving.set(false);
        this.closeModal();
        if (response.id !== undefined) {
          this.api.portfolioOf(response.id).subscribe({
            next: (portfolio) => this.portfolios.update((list) => [...list, portfolio]),
            // the client exists, the list just has to be refreshed to show it
            error: () => undefined,
          });
        }
      },
      error: () => this.saving.set(false),
    });
  }

  protected removeClient(portfolio: PortfolioInfo): void {
    const id = portfolio.client?.id;
    if (id === undefined) {
      return;
    }
    this.api.removeClient(id).subscribe({
      next: (response) => {
        this.portfolios.update((list) => list.filter((x) => x.client?.id !== id));
        this.message.success(`Account for ${clientName(response)} was removed`);
      },
      error: () => undefined,
    });
  }

  private patchClient(id: number, change: Partial<ProfileInfoDto>): void {
    this.portfolios.update((list) => list.map((x) => (x.client?.id === id ? { ...x, client: { ...x.client, ...change } } : x)));
  }
}
