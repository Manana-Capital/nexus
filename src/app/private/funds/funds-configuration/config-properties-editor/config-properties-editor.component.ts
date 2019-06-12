import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConfigProperty} from '@core/backend/generated/defs/ConfigProperty';

@Component({
  selector: 'nx-config-properties-editor',
  templateUrl: './config-properties-editor.component.html',
  styleUrls: ['./config-properties-editor.component.less']
})
export class ConfigPropertiesEditorComponent implements OnInit, OnChanges {

  @Input()
  get data(): {} {
    return this._data;
  }
  set data(val: {}) {
    console.log('SETTINGS data', val, this._data, this.properties);
    if (!val) {
      this._data = {};
      return;
    }
    this._data = val;
  }

  @Input()
  properties: ConfigProperty[] = [];

  _data: {} = {};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('STATE', this._data, this.properties, changes);
  }

}
