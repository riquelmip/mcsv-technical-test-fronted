import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { AuthService } from './auth/services/auth.service';
import { LastRouteService } from './shared/services/last-route.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'quizzes-game-frontend';

  // INYECCIONES
  private authService = inject(AuthService);
  private router = inject(Router);
  private lastRouteService = inject(LastRouteService);

  // SIGNAL COMPUTADA PARA VERIFICAR AUTH
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });

  constructor() {}

  ngOnInit(): void {
    // Inicializa Flowbite en cada cambio de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Llama a initFlowbite tras un pequeño retraso para asegurar que el DOM esté cargado
        setTimeout(() => initFlowbite(), 0);
      }
    });
  }

  // EFECTO DISPARADO CUANDO ALGUNA SEÑAL CAMBIA EN AUTHSTATUS
  public authStatusChangedEffect = effect(() => {
    console.log('authStatusChangedEffect:', this.authService.authStatus());

    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        console.log('User authenticated');
        const lastRoute = this.lastRouteService.getLastRoute();
        if (lastRoute) {
          this.router.navigateByUrl(lastRoute);
        }
        return;

      case AuthStatus.notAuthenticated:
        console.log('User not authenticated');

        // Verifica si la ruta es pública
        this.router.events.subscribe((event) => {
          // si la ruta es la del login succes con oauth2 /public/oauth2/success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBVVRIMEpXVC1CQUNLRU5EIiwic3ViIjoicmlxdWVsbWlwIiwiYXV0aG9yaXRpZXMiOiJVU0VSIiwiaWF0IjoxNzMyODEzMzg5LCJleHAiOjE3MzI4OTk3ODksImp0aSI6Ijk5MTYwODMxLWU3ZTctNDRkYi1iN2FhLTZiN2QyNGE3YjZkOCIsIm5iZiI6MTczMjgxMzM4OX0.e_x6mowCkZ8qFLUUX9aLwN-KDe1MbWQq-nJgfr5PstA dejarlo pasar y extraer el token de la url ?token=, guardar el token y redirigir a la ruta de inicioq
          if (event instanceof NavigationEnd) {
            const currentUrl = event.url;
            if (currentUrl.includes('public/oauth2/success')) {
              //los params en la url viene asi: token=token&username=username
              const token = currentUrl.split('?token=')[1].split('&')[0];
              const username = currentUrl.split('&username=')[1];
              console.log('Token:', token);
              console.log('Username:', username);
              //guardar lastRoute
              this.lastRouteService.setLastRoute('/admin/home');
              this.authService.setAuthentication(username, token);
            }
          }

          if (event instanceof NavigationEnd) {
            const currentUrl = event.url;
            if (!currentUrl.includes('public')) {
              this.router.navigateByUrl('/auth/login');
            }
          }
        });
        return;
    }
  });
}
