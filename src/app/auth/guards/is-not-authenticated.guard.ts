import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

// PublicGuard - PrivateGuard

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //SI ESTÁ AUTENTICADO
  if (authService.authStatus() === AuthStatus.authenticated) {
    //router.navigateByUrl('/ui-components/dashboard');
    return false;
  }

  return true;
};
