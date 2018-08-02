import { Component } from '@angular/core';

@Component({
  selector: 'nx-background-jobs',
  template: `<nx-external-view [targetUrl]="'https://kotas.host/background/'"></nx-external-view>`,
})
export class ExternalBackgroundJobsComponent {
  constructor() {
  }
}
