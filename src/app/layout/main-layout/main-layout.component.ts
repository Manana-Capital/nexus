import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'nx-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less']
})
export class MainLayoutComponent {
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}
