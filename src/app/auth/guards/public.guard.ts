import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LastRouteService } from '../../shared/services/last-route.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const lastRouteService = inject(LastRouteService); // Inyecta el servicio LastRouteService
  const lastRoute = state.url;
  lastRouteService.setLastRoute(lastRoute);
  return true;
};
