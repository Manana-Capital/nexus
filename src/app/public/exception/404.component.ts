import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'nx-exception-404',
  template: `<nx-exception type="404" style="min-height: 500px; height: 80%;"></nx-exception>`,
})
export class Exception404Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
