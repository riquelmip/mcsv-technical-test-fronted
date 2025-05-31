import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LastRouteService {
  private readonly lastRouteKey: string = environment.last_route;

  constructor() {}

  setLastRoute(route: string): void {
    localStorage.setItem(this.lastRouteKey, route);
  }

  getLastRoute(): string | null {
    return localStorage.getItem(this.lastRouteKey);
  }

  clearLastRoute(): void {
    localStorage.removeItem(this.lastRouteKey);
  }
}
