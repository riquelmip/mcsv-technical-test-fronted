import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { AuthRoutingModule } from '../../auth-routing.module';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../admin/services/user.service';
import { SharedService } from '../../../shared/services/shared.service';
import { CustomerService } from '../../../admin/services/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

interface UserPayload {
  username: string;
  name: string;
  email: string;
  password?: string;
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, AuthRoutingModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  userForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        id: [0],
        username: ['', Validators.required],
        password: ['', Validators.required],
        'confirm-password': ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    initFlowbite();
    this.initializeTheme();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm-password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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

  onCreateUser(): void {
    if (this.userForm.invalid) {
      const errors = this.userForm.errors;
      if (errors?.['passwordRequired']) {
        this.sharedService.errorAlert(
          'Si ingresa una contraseña de confirmación, debe ingresar la contraseña principal.'
        );
        return;
      }
      if (errors?.['confirmPasswordRequired']) {
        this.sharedService.errorAlert(
          'Si ingresa una contraseña, debe confirmarla.'
        );
        return;
      }
      if (errors?.['passwordMismatch']) {
        this.sharedService.errorAlert('Las contraseñas no coinciden.');
        return;
      }

      this.sharedService.errorAlert(
        'Por favor, llene todos los campos correctamente.'
      );
      return;
    }

    const payload: UserPayload = {
      username: this.userForm.value.username,
      name: `${this.userForm.value.firstName} ${this.userForm.value.lastName}`,
      email: this.userForm.value.email,
      password: this.userForm.value.password || undefined,
    };

    this.loading.show();
    this.userService
      .createUserAuth(
        payload.username,
        payload.password || '',
        payload.name,
        payload.email
      )
      .subscribe({
        next: (response) => {
          if (!response.isSuccess) {
            this.loading.hide();
            this.sharedService.errorAlert(response.message);
            return;
          }

          const user = response.data;
          const userId = user.userId;

          // Crear cliente con userId
          const customerPayload = {
            userId: userId,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            phone: this.userForm.value.phone,
          };

          this.customerService.createCustomer(customerPayload).subscribe({
            next: (customerResponse) => {
              this.loading.hide();
              this.sharedService.successAlert(
                'Usuario y cliente creados exitosamente.'
              );
              this.router.navigate(['/auth/login']);
            },
            error: (err) => {
              this.loading.hide();
              this.sharedService.errorAlert(
                `Usuario creado, pero hubo un error al registrar el cliente: ${err}`
              );
            },
          });
        },
        error: (err) => {
          this.loading.hide();
          this.sharedService.errorAlert(`Error al crear usuario: ${err}`);
        },
      });
  }
}
