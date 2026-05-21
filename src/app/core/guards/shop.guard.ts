import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const shopGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.userRole() === 'shop') {
    return true;
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
  } else {
    router.navigate(['/']);
  }
  return false;
};
