import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { map } from 'rxjs';
import { ProfileInfoDto, UpdateProfileExtendedDto } from '../../core/api/model';
import { nameValidators, ROLE_OPTIONS } from './profile-rules';

@Component({
  selector: 'nx-client-profile-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, NzTagModule],
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label nzFor="profile-first-name" nzRequired>First name</nz-form-label>
        <nz-form-control nzErrorTip="3 to 20 characters, no digits or spaces">
          <input nz-input id="profile-first-name" formControlName="firstName" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="profile-last-name" nzRequired>Last name</nz-form-label>
        <nz-form-control nzErrorTip="3 to 20 characters, no digits or spaces">
          <input nz-input id="profile-last-name" formControlName="lastName" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="profile-email">Email</nz-form-label>
        <nz-form-control nzErrorTip="Invalid email format" nzExtra="Login into the system with this email (only Google email is supported)">
          <input nz-input id="profile-email" type="email" formControlName="email" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>Roles</nz-form-label>
        <nz-form-control>
          @if (showRoles()) {
            <nz-select class="roles" formControlName="roles" nzMode="multiple" nzPlaceHolder="Please select roles">
              @for (option of roleOptions; track option.value) {
                <nz-option [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
              }
            </nz-select>
          } @else {
            @for (role of profile()?.roles; track role) {
              <nz-tag>{{ role }}</nz-tag>
            } @empty {
              <span class="nx-muted">None</span>
            }
          }
        </nz-form-control>
      </nz-form-item>

      @if (profile(); as current) {
        <nz-form-item>
          <nz-form-label nzFor="profile-username">Username</nz-form-label>
          <nz-form-control nzExtra="Modify the username in the access form">
            <input nz-input id="profile-username" [value]="current.username ?? ''" disabled />
          </nz-form-control>
        </nz-form-item>
      }

      <button nz-button nzType="primary" type="submit" [nzLoading]="saving()" [disabled]="!valid()">Save</button>
    </form>
  `,
  styles: `
    :host { display: block; }
    .roles { width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProfileForm {
  readonly profile = input<ProfileInfoDto | null>(null);
  readonly showRoles = input(false);
  readonly saving = input(false);
  readonly saved = output<UpdateProfileExtendedDto>();

  protected readonly roleOptions = ROLE_OPTIONS;

  protected readonly form = inject(FormBuilder).group({
    firstName: [null as string | null, nameValidators],
    lastName: [null as string | null, nameValidators],
    email: [null as string | null, Validators.email],
    roles: [[] as string[]],
  });

  protected readonly valid = toSignal(this.form.statusChanges.pipe(map(() => this.form.valid)), { initialValue: false });

  constructor() {
    effect(() => {
      const profile = this.profile();
      this.form.reset({
        firstName: profile?.firstName ?? null,
        lastName: profile?.lastName ?? null,
        email: profile?.email ?? null,
        roles: profile?.roles ?? [],
      });
    });
  }

  protected submit(): void {
    if (!this.form.valid || this.saving()) {
      return;
    }
    const { firstName, lastName, email, roles } = this.form.getRawValue();
    this.saved.emit({ firstName: firstName ?? undefined, lastName: lastName ?? undefined, email: email || undefined, roles: roles ?? [] });
  }
}
