import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  req = req.clone({ withCredentials: true });

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        authService.isAuthenticated.set(false);
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
