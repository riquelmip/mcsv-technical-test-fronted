import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  LoginResponse,
  LoginResponseData,
} from '../../interfaces/login.interface';

import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { initFlowbite } from 'flowbite';
import { GetUserResponse } from '../../interfaces/get-user.interface';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly baseUrl: string = environment.baseUrl;
  private sharedService = inject(SharedService);
  private authService = inject(AuthService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  private socialAuthService = inject(SocialAuthService);
  private socialUser: SocialUser | null = null;
  socialAuthSubscription!: Subscription;
  loginForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    // Inicializar el formulario
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Inicializar Flowbite y el tema
    initFlowbite();
    this.initializeTheme();

    // Verificar si el usuario ya está autenticado
    this.socialAuthSubscription = this.socialAuthService.authState.subscribe(
      (user) => {
        this.socialUser = user;
        console.log('user', user);
        this.authService.loginWithGoogle(user).subscribe({
          next: (response: LoginResponse) => {
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }

            const loginResponse: LoginResponseData = response.data;
            this.authService.setAuthentication(
              loginResponse.username,
              loginResponse.jwt
            );
            // Eliminar el last_route del localStorage
            localStorage.removeItem(this.lastRouteKey);

            // Hacer consulta para obtener el usuario
            this.authService
              .getUser(loginResponse.username, loginResponse.jwt)
              .subscribe({
                next: (response: GetUserResponse) => {
                  if (!response.isSuccess) {
                    this.sharedService.errorAlert(response.message);
                    return;
                  }
                  const user = response.data;
                  this.authService.setRole(user.roles[0].roleName);
                  this.authService.setUsernameLS(user.username);
                },
                error: (message: any) => {
                  this.sharedService.errorAlert(message);
                },
              });

            // Redirigir a la página de inicio
            this.router.navigateByUrl('/admin/home');
          },
          error: (message: any) => {
            this.sharedService.errorAlert(message);
          },
        });
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse del observable
    this.socialAuthSubscription.unsubscribe();
  }

  initializeTheme(): void {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Change the icons inside the button based on previous settings
    const themeToggleDarkIcon = document.getElementById(
      'theme-toggle-dark-icon'
    );
    const themeToggleLightIcon = document.getElementById(
      'theme-toggle-light-icon'
    );

    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      themeToggleLightIcon!.classList.remove('hidden');
    } else {
      themeToggleDarkIcon!.classList.remove('hidden');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn!.addEventListener('click', () => {
      // Toggle icons inside button
      themeToggleDarkIcon!.classList.toggle('hidden');
      themeToggleLightIcon!.classList.toggle('hidden');

      // If set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        }

        // If NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const username = formValues.username;
      const password = formValues.password;

      console.log('username:', username);
      console.log('password:', password);

      // Llamar al método authenticated para hacer la petición al backend
      this.authenticated(username, password);
    } else {
      this.sharedService.errorAlert(
        'Por favor, complete los campos requeridos'
      );
    }
  }

  authenticated(username: string, password: string): void {
    this.loading.show();
    this.authService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }

        const loginResponse: LoginResponseData = response.data;
        this.authService.setAuthentication(
          loginResponse.username,
          loginResponse.jwt
        );
        // Eliminar el last_route del localStorage
        localStorage.removeItem(this.lastRouteKey);

        // Hacer consulta para obtener el usuario
        this.authService.getUser(username, loginResponse.jwt).subscribe({
          next: (response: GetUserResponse) => {
            if (!response.isSuccess) {
              this.sharedService.errorAlert(response.message);
              return;
            }
            const user = response.data;
            this.authService.setRole(user.roles[0].roleName);
            this.authService.setUsernameLS(user.username);
          },
          error: (message: any) => {
            this.sharedService.errorAlert(message);
          },
        });

        // Redirigir a la página de inicio
        this.router.navigateByUrl('/admin/home');
        this.loading.hide();
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
    });
  }

  // PARA SIGN IN WITH GOOGLE
  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
}
