import { Component } from '@angular/core';
import {environment} from '@env/environment';

@Component({
  selector: 'nx-background-jobs',
  template: `<nx-external-view [targetUrl]="url"></nx-external-view>`,
})
export class ExternalBackgroundJobsComponent {

  url: string;

  constructor() {
    this.url = environment.BACKEND_URL + 'background/';
  }
}
