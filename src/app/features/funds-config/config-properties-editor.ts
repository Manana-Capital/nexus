import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { ConfigProperty } from '../../core/api/model';
import { configKind, ConnectorConfig, isSecretProperty } from './connector-config';

/** Edits a connector configuration by its definition, nested sections use the same editor. */
@Component({
  selector: 'nx-config-properties-editor',
  imports: [FormsModule, NzDividerModule, NzFormModule, NzInputModule, NzInputNumberModule],
  template: `
    @for (property of properties(); track property.name) {
      @switch (kind(property)) {
        @case ('string') {
          <nz-form-item>
            <nz-form-label [nzFor]="id(property)">{{ property.name }}</nz-form-label>
            <nz-form-control>
              <input
                nz-input
                [id]="id(property)"
                [name]="id(property)"
                [type]="secret(property) ? 'password' : 'text'"
                [attr.autocomplete]="secret(property) ? 'new-password' : 'off'"
                spellcheck="false"
                [ngModel]="text(property)"
                [ngModelOptions]="{ standalone: true }"
                (ngModelChange)="set(property, $event)"
              />
            </nz-form-control>
          </nz-form-item>
        }
        @case ('number') {
          <nz-form-item>
            <nz-form-label [nzFor]="id(property)">{{ property.name }}</nz-form-label>
            <nz-form-control>
              <nz-input-number class="number" [nzId]="id(property)" [ngModel]="number(property)" [ngModelOptions]="{ standalone: true }" (ngModelChange)="set(property, $event)"></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        }
        @case ('complex') {
          <nz-divider nzDashed [nzText]="property.name"></nz-divider>
          <nx-config-properties-editor [path]="id(property)" [properties]="property.children ?? []" [data]="section(property)" (dataChange)="set(property, $event)" />
        }
        @default {
          <p class="nx-muted">{{ property.name }}: can't be edited here, the stored value stays as it is.</p>
        }
      }
    }
  `,
  styles: `
    :host { display: block; }
    .number { width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigPropertiesEditor {
  readonly properties = input<ConfigProperty[]>([]);
  readonly data = input<ConnectorConfig>({});
  readonly path = input('connector-config');
  readonly dataChange = output<ConnectorConfig>();

  protected readonly kind = configKind;

  protected id(property: ConfigProperty): string {
    return `${this.path()}-${property.name}`;
  }

  protected secret(property: ConfigProperty): boolean {
    return isSecretProperty(property.name);
  }

  protected text(property: ConfigProperty): string {
    const value = this.value(property);
    return value === undefined || value === null ? '' : String(value);
  }

  protected number(property: ConfigProperty): number | null {
    const value = this.value(property);
    return typeof value === 'number' ? value : null;
  }

  protected section(property: ConfigProperty): ConnectorConfig {
    return (this.value(property) as ConnectorConfig | undefined) ?? {};
  }

  protected set(property: ConfigProperty, value: unknown): void {
    this.dataChange.emit({ ...this.data(), [property.name ?? '']: value });
  }

  private value(property: ConfigProperty): unknown {
    return this.data()[property.name ?? ''];
  }
}
