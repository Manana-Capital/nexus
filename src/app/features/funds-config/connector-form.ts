import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ConnectorDefinitionDto, FundConnectorDto } from '../../core/api/model';
import { ConfigPropertiesEditor } from './config-properties-editor';
import { ConnectorConfig, findConfigProperties, parseConfiguration, withComplexDefaults } from './connector-config';

@Component({
  selector: 'nx-connector-form',
  imports: [FormsModule, NzAlertModule, NzButtonModule, NzCheckboxModule, NzDividerModule, NzFormModule, NzInputModule, NzSelectModule, ConfigPropertiesEditor],
  // ngForm cancels the native submit, which would otherwise send the inputs to the address bar
  template: `
    <form nz-form nzLayout="vertical" autocomplete="off" (ngSubmit)="save()">
      <nz-form-item>
        <nz-form-label nzRequired>Exchange</nz-form-label>
        <nz-form-control>
          <nz-select class="full" nzShowSearch name="exchange" nzPlaceHolder="Choose an exchange" [ngModel]="exchangeName()" (ngModelChange)="exchangeName.set($event)">
            @for (definition of definitions(); track definition.exchangeName) {
              <nz-option [nzLabel]="definition.exchangeName ?? ''" [nzValue]="definition.exchangeName"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzFor="connector-display-name" nzRequired>Display name</nz-form-label>
        <nz-form-control>
          <input nz-input id="connector-display-name" name="displayName" autocomplete="off" [ngModel]="displayName()" (ngModelChange)="displayName.set($event)" />
        </nz-form-control>
      </nz-form-item>

      <div class="flags">
        <label nz-checkbox name="isDisabled" [ngModel]="isDisabled()" (ngModelChange)="isDisabled.set($event)">Disabled</label>
        <label nz-checkbox name="isLending" [ngModel]="isLending()" (ngModelChange)="isLending.set($event)">Lending enabled</label>
        <label nz-checkbox name="isMarketMaker" [ngModel]="isMarketMaker()" (ngModelChange)="isMarketMaker.set($event)">Market maker enabled</label>
      </div>

      <nz-divider nzText="Configuration"></nz-divider>

      @if (config(); as data) {
        <nx-config-properties-editor [properties]="properties()" [data]="data" (dataChange)="setConfig($event)" />
      } @else {
        <nz-alert class="unreadable" nzType="error" nzShowIcon nzMessage="The stored configuration can't be read" nzDescription="Saving is blocked, it would overwrite the stored credentials."></nz-alert>
      }

      <button nz-button nzType="primary" type="submit" [nzLoading]="saving()" [disabled]="!canSave()">Save connector</button>
    </form>
  `,
  styles: `
    :host { display: block; }
    .full { width: 100%; }
    .flags { display: flex; flex-wrap: wrap; gap: 8px 16px; }
    .flags label { margin-left: 0; }
    .unreadable { display: block; margin-bottom: 16px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectorForm {
  readonly connector = input<FundConnectorDto | null>(null);
  readonly definitions = input<ConnectorDefinitionDto[]>([]);
  readonly saving = input(false);
  readonly saved = output<FundConnectorDto>();

  protected readonly exchangeName = linkedSignal(() => this.connector()?.exchangeName ?? null);
  protected readonly displayName = linkedSignal(() => this.connector()?.displayName ?? '');
  protected readonly isDisabled = linkedSignal(() => this.connector()?.isDisabled ?? false);
  protected readonly isLending = linkedSignal(() => this.connector()?.isLendingEnabled ?? false);
  protected readonly isMarketMaker = linkedSignal(() => this.connector()?.isMarketMakerEnabled ?? false);
  protected readonly config = linkedSignal<ConnectorConfig | null>(() => parseConfiguration(this.connector()?.configuration));

  protected readonly properties = computed(() => findConfigProperties(this.definitions(), this.exchangeName()));
  protected readonly canSave = computed(() => !!this.exchangeName() && !!this.displayName().trim() && this.config() !== null);

  protected setConfig(config: ConnectorConfig): void {
    this.config.set(config);
  }

  protected save(): void {
    const config = this.config();
    if (!config || !this.canSave() || this.saving()) {
      return;
    }
    this.saved.emit({
      ...this.connector(),
      exchangeName: this.exchangeName() ?? undefined,
      displayName: this.displayName(),
      isDisabled: this.isDisabled(),
      isLendingEnabled: this.isLending(),
      isMarketMakerEnabled: this.isMarketMaker(),
      configuration: withComplexDefaults(this.properties(), config),
    });
  }
}
