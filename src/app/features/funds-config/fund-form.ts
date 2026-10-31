import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { map } from 'rxjs';
import { FundClient, FundSimpleInfo } from '../../core/api/model';
import { clientLabel } from '../clients/client-label';

@Component({
  selector: 'nx-fund-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule, NzInputNumberModule, NzSelectModule],
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="save()">
      <nz-form-item>
        <nz-form-label nzFor="fund-key" nzRequired>Key</nz-form-label>
        <nz-form-control nzErrorTip="Key is required">
          <input nz-input id="fund-key" formControlName="key" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="fund-display-name" nzRequired>Display name</nz-form-label>
        <nz-form-control nzErrorTip="Display name is required">
          <input nz-input id="fund-display-name" formControlName="displayName" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="fund-description">Description</nz-form-label>
        <nz-form-control>
          <textarea nz-input id="fund-description" formControlName="description" placeholder="Write description of the fund, will be displayed as info tooltip" rows="3"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="fund-cron">Cron check interval</nz-form-label>
        <nz-form-control>
          <input nz-input id="fund-cron" formControlName="checkCronInterval" autocomplete="off" />
        </nz-form-control>
      </nz-form-item>

      <div class="flags">
        <label nz-checkbox formControlName="isPublic">Public</label>
        <label nz-checkbox formControlName="isDisabled">Disabled</label>
        <label nz-checkbox formControlName="isHidden">Hidden</label>
        <label nz-checkbox formControlName="isUnderConstruction">Under construction</label>
      </div>

      <nz-form-item>
        <nz-form-label nzRequired>Owner</nz-form-label>
        <nz-form-control nzErrorTip="Choose the owner">
          <nz-select class="full" formControlName="owner" nzShowSearch nzPlaceHolder="Choose the owner">
            @for (client of clients(); track client.fundClientId) {
              <nz-option [nzLabel]="label(client)" [nzValue]="client.fundClientId"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Ordering</nz-form-label>
        <nz-form-control nzErrorTip="Ordering is required">
          <nz-input-number class="full" formControlName="ordering"></nz-input-number>
        </nz-form-control>
      </nz-form-item>

      <button nz-button nzType="primary" type="submit" [nzLoading]="saving()" [disabled]="!valid()">Save fund</button>
    </form>
  `,
  styles: `
    :host { display: block; }
    .full { width: 100%; }
    .flags { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; }
    .flags label { margin-left: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundForm {
  readonly fund = input<FundSimpleInfo | null>(null);
  readonly clients = input<FundClient[]>([]);
  readonly saving = input(false);
  readonly saved = output<FundSimpleInfo>();

  protected readonly form = inject(FormBuilder).group({
    key: [null as string | null, Validators.required],
    displayName: [null as string | null, Validators.required],
    description: [null as string | null],
    checkCronInterval: [null as string | null],
    isPublic: [false],
    isDisabled: [false],
    isHidden: [false],
    isUnderConstruction: [false],
    owner: [null as number | null, Validators.required],
    ordering: [0 as number | null, Validators.required],
  });

  protected readonly valid = toSignal(this.form.statusChanges.pipe(map(() => this.form.valid)), { initialValue: false });
  protected readonly label = clientLabel;

  constructor() {
    effect(() => {
      const fund = this.fund();
      this.form.reset({
        key: fund?.key ?? null,
        displayName: fund?.displayName ?? null,
        description: fund?.description ?? null,
        checkCronInterval: fund?.checkCronInterval ?? null,
        isPublic: fund?.isPublic ?? false,
        isDisabled: fund?.isDisabled ?? false,
        isHidden: fund?.isHidden ?? false,
        isUnderConstruction: fund?.isUnderConstruction ?? false,
        owner: fund?.owner ?? null,
        ordering: fund?.ordering ?? 0,
      });
    });
  }

  protected save(): void {
    if (!this.form.valid || this.saving()) {
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      ...this.fund(),
      ...value,
      key: value.key ?? undefined,
      displayName: value.displayName ?? undefined,
      description: value.description ?? undefined,
      checkCronInterval: value.checkCronInterval ?? undefined,
      isPublic: !!value.isPublic,
      isDisabled: !!value.isDisabled,
      isHidden: !!value.isHidden,
      isUnderConstruction: !!value.isUnderConstruction,
      owner: value.owner ?? undefined,
      ordering: value.ordering ?? 0,
    });
  }
}
