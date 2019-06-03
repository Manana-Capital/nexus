import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'nx-exception-401',
  template: `<nx-exception type="401" style="min-height: 500px; height: 80%;"></nx-exception>`,
})
export class Exception401Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
