import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LastRouteService } from '../../shared/services/last-route.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const lastRouteService = inject(LastRouteService); // Inyecta el servicio LastRouteService

  // Obtén la ruta a la que el usuario intenta acceder
  const targetRoute = state.url;
  console.log('Ruta a la que intento acceder:', targetRoute);

  // Si el usuario está autenticado, permitir acceso
  if (authService.authStatus() === AuthStatus.authenticated) {
    lastRouteService.setLastRoute(targetRoute);
    return true;
  }

  // Si no está autenticado, guardar la ruta e ir al login
  lastRouteService.setLastRoute(targetRoute);
  router.navigateByUrl('/auth/login');
  return false;
};
