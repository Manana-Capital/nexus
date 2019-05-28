import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'nx-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.less']
})
export class NavigationMenuComponent implements OnInit {

  @Input()
  isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
