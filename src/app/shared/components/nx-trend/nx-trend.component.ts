import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'nx-trend',
  templateUrl: './nx-trend.component.html',
  styleUrls: ['./nx-trend.component.less']
})
export class NxTrendComponent implements OnInit {

  @Input()
  flag: 'up' | 'down' | '';

  @Input()
  colorful: any;

  constructor() { }

  ngOnInit() {
  }

}
