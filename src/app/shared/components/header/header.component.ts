import { Component, inject, OnInit, AfterViewChecked } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth-status.enum';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Flowbite } from '../../decorators/flowbite.decorator';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public username: string = '';
  public role: string = '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateThemeOnRouteChange();
      });
  }

  ngOnInit(): void {
    this.updateThemeOnRouteChange();

    // Get username from local storage
    this.username = this.authService.getUsernameLS();
    // Get role from local storage
    this.role = this.authService.getRolFromLocalStorage();
  }

  ngAfterViewChecked(): void {
    this.updateThemeOnRouteChange();
  }

  private updateThemeOnRouteChange(): void {
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
  }

  checkStatusAuth(): boolean {
    return this.authService.authStatus() === AuthStatus.authenticated;
  }

  logout() {
    this.authService.logoutAndRedirect();
    this.sharedService.successAlert('Se ha deslogueado correctamente');
  }

  toggleTheme(): void {
    const themeToggleDarkIcon = document.getElementById(
      'theme-toggle-dark-icon'
    );
    const themeToggleLightIcon = document.getElementById(
      'theme-toggle-light-icon'
    );

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
    } else {
      // If NOT set via local storage previously
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  }
}
