import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzMenuItemDirective} from 'ng-zorro-antd';

@Component({
  selector: 'nx-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.less']
})
export class NavigationMenuComponent implements OnInit {

  @Input()
  isCollapsed = false;

  @Output()
  selected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onMenuClick($event: NzMenuItemDirective) {
    this.selected.emit();
  }
}
