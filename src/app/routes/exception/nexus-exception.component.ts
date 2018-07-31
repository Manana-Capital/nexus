import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'nx-exception',
  template: `
  <div class="img-block">
    <div class="img" [ngStyle]="{'background-image': 'url(' + _img + ')'}"></div>
  </div>
  <div class="cont">
    <h1 [innerHTML]="_title"></h1>
    <div class="desc" [innerHTML]="_desc"></div>
    <ng-template #defaultActions>
      <button nz-button [routerLink]="['/']" [nzType]="'primary'">Back</button>
      <ng-content></ng-content>
    </ng-template>
    <div class="actions" *ngIf="actions; else defaultActions">
      <ng-template [ngTemplateOutlet]="actions"></ng-template>
      <ng-content></ng-content>
    </div>
  </div>
  `,
  host: { '[class.ad-exception]': 'true' },
  preserveWhitespaces: false,
})
export class NexusExceptionComponent {
  _img = '';
  _title = '';
  _desc = '';

  @Input()
  set type(value: 403 | 404 | 500) {
    const item = {
      401: {
        img:
          'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
        title: '401',
        desc: 'Sorry, you don\'t have access to this page (unauthorized). Please login.',
      },
      403: {
        img:
          'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
        title: '403',
        desc: 'Sorry, you don\'t have access to this page (missing role).',
      },
      404: {
        img:
          'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
        title: '404',
        desc: 'Sorry, the page you visited does not exist.',
      },
      500: {
        img:
          'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
        title: '500',
        desc: 'Sorry, server error.',
      },
    }[value];

    if (!item) return;

    this._img = item.img;
    this._title = item.title;
    this._desc = item.desc;
  }

  @Input()
  set img(value) {
    this._img = value;
  }
  @Input()
  set title(value) {
    this._title = value;
  }
  @Input()
  set desc(value) {
    this._desc = value;
  }

  @ContentChild('actions') actions: TemplateRef<any>;
}
