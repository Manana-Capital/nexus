import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ApiService } from '../../core/api/api.service';
import { NxLogEvent } from '../../core/api/model';
import { filterLogs, lastPage, LOG_LEVEL_OPTIONS, logLevelGroup, pageOf } from './logs-logic';

@Component({
  selector: 'nx-logs-viewer',
  imports: [DatePipe, FormsModule, NzAlertModule, NzButtonModule, NzCheckboxModule, NzIconModule, NzModalModule, NzPaginationModule, NzSkeletonModule, NzTooltipModule],
  templateUrl: './logs-viewer.html',
  styleUrl: './logs-viewer.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsViewer {
  private readonly api = inject(ApiService);

  protected readonly levelOptions = LOG_LEVEL_OPTIONS;
  protected readonly pageSizes = [10, 20, 50, 100, 1000];

  protected readonly loading = signal(true);
  protected readonly logs = signal<NxLogEvent[]>([]);
  protected readonly levels = signal<string[]>([]);
  protected readonly pageSize = signal(20);
  private readonly requestedPage = signal(1);
  protected readonly detail = signal<NxLogEvent | null>(null);
  protected readonly detailVisible = signal(false);

  protected readonly visible = computed(() => filterLogs(this.logs(), this.levels()));
  // a refresh or a filter can leave less pages than the one being viewed
  protected readonly page = computed(() => Math.min(this.requestedPage(), lastPage(this.visible().length, this.pageSize())));
  protected readonly rows = computed(() => pageOf(this.visible(), this.page(), this.pageSize()));

  protected readonly levelGroup = logLevelGroup;

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.logs().subscribe({
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected selectLevels(levels: string[]): void {
    this.levels.set(levels);
    this.requestedPage.set(1);
  }

  protected selectPage(page: number): void {
    this.requestedPage.set(page);
  }

  protected selectPageSize(size: number): void {
    this.pageSize.set(size);
    this.requestedPage.set(1);
  }

  protected showDetail(log: NxLogEvent): void {
    this.detail.set(log);
    this.detailVisible.set(true);
  }
}
