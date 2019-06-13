import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'nx-exception-500',
  template: `<nx-exception type="500" style="min-height: 500px; height: 80%;"></nx-exception>`,
})
export class Exception500Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
