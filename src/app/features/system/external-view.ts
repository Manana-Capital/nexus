import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { environment } from '../../../environments/environment';

/** Backend pages that have their own UI. */
@Component({
  selector: 'nx-external-view',
  imports: [NzButtonModule, NzIconModule],
  template: `
    <div class="bar">
      <strong>{{ name() }}</strong>
      <a nz-button nzType="link" [href]="url()" target="_blank" rel="noopener"><span nz-icon nzType="export"></span> Open in a new tab</a>
    </div>
    <iframe [src]="safeUrl()" [title]="name()"></iframe>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    .bar { display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; background: var(--nx-surface); border-bottom: 1px solid var(--nx-line); }
    iframe { flex: 1; width: 100%; border: 0; background: #fff; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalView {
  private readonly sanitizer = inject(DomSanitizer);

  readonly path = input.required<string>();
  readonly name = input.required<string>();

  protected readonly url = computed(() => environment.backendUrl + this.path());
  protected readonly safeUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.url()));
}
