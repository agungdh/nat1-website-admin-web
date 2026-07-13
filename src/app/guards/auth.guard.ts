import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export function authGuard() {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated() === true) {
    return true;
  }

  if (authService.isAuthenticated() === false) {
    router.navigate(['/login']);
    return false;
  }

  return authService.checkAuth().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
}
