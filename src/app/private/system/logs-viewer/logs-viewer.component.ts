import { Component, OnInit } from '@angular/core';
import {SystemService} from '@core/backend/generated/controllers/System';
import {NxLogEvent} from '@core/backend/generated/defs/NxLogEvent';

@Component({
  selector: 'nx-logs-viewer',
  templateUrl: './logs-viewer.component.html',
  styleUrls: ['./logs-viewer.component.less']
})
export class LogsViewerComponent implements OnInit {

  _loading = true;
  _logs: NxLogEvent[] = [];
  _visibleLogs: NxLogEvent[] = [];

  _selectedLog: NxLogEvent;
  _isDetailVisible = false;

  _levels = [
    { label: 'Errors', value: 'error', checked: false },
    { label: 'Warnings', value: 'warning', checked: false },
    { label: 'Information', value: 'information', checked: false },
    { label: 'Debug', value: 'debug', checked: false },
    { label: 'Verbose', value: 'verbose', checked: false },
  ];

  constructor(private system: SystemService) { }

  ngOnInit() {
    this.loadLogs();
  }

  refreshData() {
    this.loadLogs();
  }

  private loadLogs() {
    this._loading = true;
    this.system.logs()
      .subscribe(data => {
        this._logs = data;
        this.filterLogs();
        this._loading = false;
      });
  }

  showDetail(log: NxLogEvent) {
    this._selectedLog = log;
    this._isDetailVisible = true;
  }

  filterLogs(): void {
    const selected = this._levels.filter(x => x.checked).map(x => x.value);
    if (selected.length <= 0) {
      // display all logs
      this._visibleLogs = this._logs;
      return;
    }

    // @ts-ignore
    this._visibleLogs = this._logs.filter(x => selected.indexOf(x.level) >= 0);
  }
}
