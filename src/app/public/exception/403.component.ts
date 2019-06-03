import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'nx-exception-403',
  template: `<nx-exception type="403" style="min-height: 500px; height: 80%;"></nx-exception>`,
})
export class Exception403Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
