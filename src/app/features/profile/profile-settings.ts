import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ApiService } from '../../core/api/api.service';
import { ProfileInfoDto, UpdateProfileExtendedDto, UpdateProfilePasswordDto } from '../../core/api/model';
import { CurrencyService } from '../../core/currency.service';
import { clientInitials, clientName } from '../clients/client-label';
import { ClientAccessForm } from './client-access-form';
import { ClientProfileForm } from './client-profile-form';

@Component({
  selector: 'nx-profile-settings',
  imports: [FormsModule, NzAvatarModule, NzRadioModule, NzSkeletonModule, NzTabsModule, ClientAccessForm, ClientProfileForm],
  template: `
    <div class="nx-page">
      <div class="nx-page-head">
        <div class="who">
          <nz-avatar [nzText]="initials()" nzSize="large"></nz-avatar>
          <div>
            <h1>{{ name() }}</h1>
            <p>Personal settings</p>
          </div>
        </div>
      </div>

      <section class="nx-panel">
        @if (loading()) {
          <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 6 }"></nz-skeleton>
        } @else {
          <nz-tabs>
            <nz-tab nzTitle="Profile">
              <div class="content">
                <nx-client-profile-form [profile]="profile()" [saving]="saving()" (saved)="saveProfile($event)" />
              </div>
            </nz-tab>
            <nz-tab nzTitle="Access">
              <div class="content">
                <p class="nx-muted">Change password (and/or username)</p>
                <nx-client-access-form [username]="profile()?.username" [saving]="saving()" (saved)="saveAccess($event)" />
              </div>
            </nz-tab>
            <nz-tab nzTitle="Currency">
              <div class="content">
                <p class="nx-muted">Choose your default currency</p>
                <nz-radio-group class="currencies" [ngModel]="currency.selected()" (ngModelChange)="currency.select($event)">
                  <label nz-radio nzValue="USD">Dollar (USD)</label>
                  <label nz-radio nzValue="CZK">Czech crown (CZK)</label>
                  <label nz-radio nzValue="BTC">Bitcoin (BTC)</label>
                </nz-radio-group>
              </div>
            </nz-tab>
          </nz-tabs>
        }
      </section>
    </div>
  `,
  styles: `
    .who { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .content { max-width: 520px; }
    .currencies { display: flex; flex-wrap: wrap; gap: 8px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettings {
  private readonly api = inject(ApiService);
  private readonly message = inject(NzMessageService);
  protected readonly currency = inject(CurrencyService);

  private readonly accessForm = viewChild(ClientAccessForm);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly profile = signal<ProfileInfoDto | null>(null);

  protected readonly name = computed(() => (this.profile() ? clientName(this.profile()) : 'Profile'));
  protected readonly initials = computed(() => clientInitials(this.profile()));

  constructor() {
    this.api.profile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected saveProfile(value: UpdateProfileExtendedDto): void {
    this.saving.set(true);
    // roles of the own account are not editable here
    const { firstName, lastName, email } = value;
    this.api.updateProfile({ firstName, lastName, email }).subscribe({
      next: (response) => {
        this.profile.set(response);
        this.message.success('Profile was updated');
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  protected saveAccess(value: UpdateProfilePasswordDto): void {
    this.saving.set(true);
    this.api.changePassword(value).subscribe({
      next: () => {
        this.profile.update((x) => ({ ...x, username: value.newUsername }));
        this.accessForm()?.clear(value.newUsername);
        this.message.success('Username and password was changed');
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
