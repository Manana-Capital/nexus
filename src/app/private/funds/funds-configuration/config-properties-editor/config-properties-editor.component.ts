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
    if (!val) {
      const valEmpty = {};
      this.initializeUndefinedComplexFields(valEmpty);
      this._data = valEmpty;
      return;
    }
    this.initializeUndefinedComplexFields(val);
    this._data = val;
  }

  @Input()
  get properties(): ConfigProperty[] {
    return this._properties;
  }
  set properties(val: ConfigProperty[]) {
    this._properties = val;
    this.initializeUndefinedComplexFields(this._data);
  }

  _data: {} = {};
  _properties: ConfigProperty[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  private initializeUndefinedComplexFields(data: {}) {
    // we need to set initial fields if prop is complex (3)
    if (!!data && !!this._properties) {
      for (const prop of this._properties) {
        // @ts-ignore
        if (prop.type === 3 && !data[prop.name]) {
          data[prop.name] = {};
        }
      }
    }
  }
}
