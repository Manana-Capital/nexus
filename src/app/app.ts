import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayout } from './layout/main-layout';

@Component({
  selector: 'nx-root',
  imports: [MainLayout],
  template: `<nx-main-layout />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
