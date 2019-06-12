import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FundConnectorDto} from '@core/backend/generated/defs/FundConnectorDto';
import {ConnectorDefinitionDto} from '@core/backend/generated/defs/ConnectorDefinitionDto';
import {ConfigProperty} from '@core/backend/generated/defs/ConfigProperty';

@Component({
  selector: 'nx-connector-form',
  templateUrl: './connector-form.component.html',
  styleUrls: ['./connector-form.component.less']
})
export class ConnectorFormComponent implements OnInit {
  @Input()
  set connector(data: FundConnectorDto) {
    if (!data) {
      return;
    }
    this._connector = data;

    try {
      if (typeof this._connector.configuration === 'string') {
        this._connector.configuration = JSON.parse(this._connector.configuration);
      }
    } catch (e) {
      console.log('Failed to parse configuration for ' + data.displayName, e);
    }
  }

  @Input()
  definitions: ConnectorDefinitionDto[] = [];

  @Output()
  saved: EventEmitter<FundConnectorDto> = new EventEmitter();

  _connector: FundConnectorDto = {};

  constructor() { }

  ngOnInit() {
  }

  save() {
    this.saved.emit(this._connector);
  }

  findDefinition(exchangeName: string): ConfigProperty[] {
    if (!exchangeName || !this.definitions) {
      return [];
    }

    return this.definitions
      .find(x => x.exchangeName.toLowerCase() === exchangeName.toLowerCase())
      .configProperties;
  }
}
