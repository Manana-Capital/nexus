import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { ECharts, EChartsCoreOption, init, use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

use([LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

/** Canvas chart that follows the size of its container, so it can never push the page wider. */
@Component({
  selector: 'nx-chart',
  template: `<div #canvas class="canvas" [style.height.px]="height()" role="img" [attr.aria-label]="label()"></div>`,
  styles: `
    :host { display: block; min-width: 0; width: 100%; }
    .canvas { width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxChart implements OnDestroy {
  readonly option = input.required<EChartsCoreOption>();
  readonly height = input(380);
  readonly label = input('Chart');

  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('canvas');
  private readonly host = inject(ElementRef<HTMLElement>);
  private chart?: ECharts;
  private observer?: ResizeObserver;

  constructor() {
    afterRenderEffect(() => {
      const option = this.option();
      if (!this.chart) {
        this.chart = init(this.canvas().nativeElement);
        this.observer = new ResizeObserver(() => this.chart?.resize());
        this.observer.observe(this.host.nativeElement);
      }
      this.chart.setOption(option, { notMerge: true });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.chart?.dispose();
  }
}
