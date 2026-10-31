import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export function errorMessage(error: HttpErrorResponse): string {
  const backend = error.error?.errors?.[0]?.message;
  switch (error.status) {
    case 400:
    case 405:
    case 406:
      return backend ?? 'Bad input, please correct parameters and repeat';
    case 401:
      return 'Unauthorized, please login first';
    case 403:
      return backend ?? 'Forbidden, you are not allowed (missing role)';
    case 404:
      return "Not found, item doesn't exist";
    case 500:
      return 'Server error, contact support';
    default:
      return 'Server error, please try again';
  }
}

/** Shows failures of API calls to the user. The error continues, so callers can end their loading state. */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const message = inject(NzMessageService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (request.url.startsWith(environment.backendUrl) && request.url.includes('/api/')) {
        message.error(errorMessage(error), { nzDuration: 6000, nzPauseOnHover: true });
        if (error.status === 401) {
          router.navigateByUrl('/401');
        }
      }
      return throwError(() => error);
    }),
  );
};
