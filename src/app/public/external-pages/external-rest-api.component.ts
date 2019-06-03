import { Component } from '@angular/core';
import {environment} from '@env/environment';

@Component({
  selector: 'nx-external-rest-api',
  template: `<nx-external-view [targetUrl]="url"></nx-external-view>`,
})
export class ExternalRestApiComponent {
  url: string;

  constructor() {
    this.url = environment.BACKEND_URL + 'swagger/';
  }
}
