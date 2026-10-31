import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

export interface NexusUser {
  sub: string;
  id: number;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  role: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidc = inject(OidcSecurityService);
  private readonly router = inject(Router);

  private readonly checked = signal(false);

  readonly isAuthenticated = toSignal(this.oidc.isAuthenticated$.pipe(map((x) => x.isAuthenticated)), { initialValue: false });

  private readonly userData = toSignal(this.oidc.userData$.pipe(map((x) => x.userData)), { initialValue: null });

  readonly user = computed<NexusUser | null>(() => {
    const data = this.userData();
    if (!this.isAuthenticated() || !data?.sub) {
      return null;
    }
    const role = Array.isArray(data.role) ? data.role : data.role ? [data.role] : [];
    return { ...data, id: Number(data.sub), role };
  });

  /** Answer is known once the stored session and a possible login callback were processed. */
  readonly ready = this.checked.asReadonly();

  hasRole(role: string): boolean {
    return this.user()?.role.includes(role) ?? false;
  }

  /** Processes the redirect back from the login page, restores an existing session otherwise. */
  init() {
    return this.oidc.checkAuth().pipe(
      map((result) => {
        this.checked.set(true);
        const search = window.location.search;
        if (search.includes('code=') || search.includes('error=')) {
          // the callback parameters don't belong in the address anymore
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          this.router.navigateByUrl('/dashboard');
        }
        return result;
      }),
    );
  }

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }
}
