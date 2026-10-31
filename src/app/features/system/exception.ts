import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../core/auth/auth.service';

const TEXTS: Record<number, string> = {
  401: "You don't have access to this page. Please log in.",
  403: "You don't have access to this page (missing role).",
  404: 'The page you visited does not exist.',
  500: 'Server error, please try again later.',
};

@Component({
  selector: 'nx-exception',
  imports: [RouterLink, NzButtonModule],
  template: `
    <div class="box">
      <h1>{{ code() }}</h1>
      <p>{{ text() }}</p>
      <a nz-button routerLink="/" nzType="default">Back to dashboard</a>
      @if (code() === 401 && !auth.user()) {
        <button nz-button nzType="primary" (click)="auth.login()">Login</button>
      }
    </div>
  `,
  styles: `
    .box { padding: 80px 24px; text-align: center; }
    h1 { font-size: 56px; font-weight: 300; margin: 0; color: var(--nx-ink-3); }
    p { margin: 8px 0 24px; color: var(--nx-ink-2); }
    button { margin-left: 8px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exception {
  protected readonly auth = inject(AuthService);
  readonly code = input(404);
  protected readonly text = computed(() => TEXTS[this.code()] ?? TEXTS[500]);
}
