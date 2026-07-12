import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authGuard() {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}
