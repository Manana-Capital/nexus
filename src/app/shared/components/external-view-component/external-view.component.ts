import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'nx-external-view',
  templateUrl: './external-view.component.html',
  styleUrls: ['./external-view.component.less']
})
export class ExternalViewComponent implements OnInit {

  @Input()
  targetUrl = '';

  url: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

}
