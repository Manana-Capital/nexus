import { Component } from '@angular/core';

@Component({
  selector: 'nx-external-rest-api',
  template: `<nx-external-view [targetUrl]="'https://kotas.host/swagger/'"></nx-external-view>`,
})
export class ExternalRestApiComponent {
  constructor() {
  }
}
