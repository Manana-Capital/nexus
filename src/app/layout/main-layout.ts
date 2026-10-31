import { BreakpointObserver } from '@angular/cdk/layout';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { map, timer, switchMap, catchError, of } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { AuthService } from '../core/auth/auth.service';

const PRICE_REFRESH_MS = 5 * 60 * 1000;

@Component({
  selector: 'nx-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CurrencyPipe, NzIconModule, NzMenuModule, NzAvatarModule, NzDropdownModule, NzButtonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly breakpoints = inject(BreakpointObserver);

  protected readonly isSmall = toSignal(this.breakpoints.observe('(max-width: 767px)').pipe(map((x) => x.matches)), { initialValue: false });
  private readonly menuToggled = signal<boolean | null>(null);

  /** Menu is open on large screens and on request on small ones, where it overlays the page. */
  protected readonly menuOpen = computed(() => this.menuToggled() ?? !this.isSmall());

  protected readonly prices = toSignal(
    timer(0, PRICE_REFRESH_MS).pipe(switchMap(() => this.api.prices().pipe(catchError(() => of(null))))),
    { initialValue: null },
  );

  protected readonly initials = computed(() => {
    const user = this.auth.user();
    return `${user?.given_name?.[0] ?? ''}${user?.family_name?.[0] ?? ''}`.toUpperCase() || 'U';
  });

  protected toggleMenu(): void {
    this.menuToggled.set(!this.menuOpen());
  }

  protected onNavigate(): void {
    if (this.isSmall()) {
      this.menuToggled.set(false);
    }
  }
}
