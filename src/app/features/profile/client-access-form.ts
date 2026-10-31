import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { map, startWith } from 'rxjs';
import { UpdateProfilePasswordDto } from '../../core/api/model';
import { passwordsMatch } from './profile-rules';

@Component({
  selector: 'nx-client-access-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="submit()" autocomplete="off">
      <nz-form-item>
        <nz-form-label nzFor="access-username" nzRequired>Username</nz-form-label>
        <nz-form-control nzErrorTip="Username is required">
          <input nz-input id="access-username" formControlName="newUsername" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      @if (!ignoreOldPassword()) {
        <nz-form-item>
          <nz-form-label nzFor="access-old-password" nzRequired>Old password</nz-form-label>
          <nz-form-control nzErrorTip="Old password is required">
            <input nz-input id="access-old-password" type="password" formControlName="oldPassword" autocomplete="current-password" />
          </nz-form-control>
        </nz-form-item>
      }

      <nz-form-item>
        <nz-form-label nzFor="access-new-password" nzRequired>New password</nz-form-label>
        <nz-form-control nzErrorTip="New password is required">
          <input nz-input id="access-new-password" type="password" formControlName="newPassword" autocomplete="new-password" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="access-new-password-repeat" nzRequired>Confirm new password</nz-form-label>
        <nz-form-control nzErrorTip="Repeat the new password">
          <input nz-input id="access-new-password-repeat" type="password" formControlName="newPasswordRepeat" autocomplete="new-password" />
          @if (differ()) {
            <div class="differ">The passwords don't match</div>
          }
        </nz-form-control>
      </nz-form-item>

      <button nz-button nzType="primary" type="submit" [nzLoading]="saving()" [disabled]="!valid()">Change password</button>
    </form>
  `,
  styles: `
    :host { display: block; }
    .differ { color: var(--nx-loss); margin-top: 4px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientAccessForm {
  readonly username = input<string | null | undefined>(null);
  readonly ignoreOldPassword = input(false);
  readonly saving = input(false);
  readonly saved = output<UpdateProfilePasswordDto>();

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      newUsername: ['', Validators.required],
      oldPassword: [''],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  protected readonly valid = toSignal(this.form.statusChanges.pipe(map(() => this.form.valid)), { initialValue: false });
  private readonly values = toSignal(this.form.valueChanges.pipe(startWith(null), map(() => this.form.getRawValue())), { requireSync: true });

  protected readonly differ = computed(() => {
    const { newPassword, newPasswordRepeat } = this.values();
    return !!newPasswordRepeat && newPassword !== newPasswordRepeat;
  });

  constructor() {
    effect(() => {
      this.form.controls.oldPassword.setValidators(this.ignoreOldPassword() ? [] : [Validators.required]);
      this.clear(this.username() ?? '');
    });
  }

  /** Passwords don't stay in the page after they were used. */
  clear(username = this.form.controls.newUsername.value): void {
    this.form.reset({ newUsername: username, oldPassword: '', newPassword: '', newPasswordRepeat: '' });
  }

  protected submit(): void {
    if (this.form.valid && !this.saving()) {
      this.saved.emit(this.form.getRawValue());
    }
  }
}
