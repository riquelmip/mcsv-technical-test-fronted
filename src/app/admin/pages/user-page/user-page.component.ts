import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import {
  GetAllUsersGeneralResponse,
  GetAllUsersResponse,
} from '../../interfaces/get-all-users.interface';
import { SharedService } from '../../../shared/services/shared.service';
import { CommonModule } from '@angular/common';

interface UserPayload {
  username: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent {
  private readonly baseUrl: string = environment.baseUrl;
  private userService = inject(UserService);
  private sharedService = inject(SharedService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly lastRouteKey: string = environment.last_route;
  userForm: FormGroup = this.fb.group({});

  public userList: GetAllUsersResponse[] = [];

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        id: [0],
        username: ['', Validators.required],
        password: [''],
        'confirm-password': [''],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
      },
      {
        validators: this.conditionalPasswordValidator(),
      }
    );

    initFlowbite();
    this.getUsers();
  }

  private conditionalPasswordValidator(): (
    group: AbstractControl
  ) => ValidationErrors | null {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirm-password')?.value;

      if (password || confirmPassword) {
        if (!password) {
          return { passwordRequired: true };
        }
        if (!confirmPassword) {
          return { confirmPasswordRequired: true };
        }
        if (password !== confirmPassword) {
          return { passwordMismatch: true };
        }
      }

      return null;
    };
  }

  getUsers(): void {
    this.loading.show();
    this.userService.getUsers().subscribe({
      next: (response: GetAllUsersGeneralResponse) => {
        this.loading.hide();
        if (!response.isSuccess) {
          this.sharedService.errorAlert(response.message);
          return;
        }
        this.userList = response.data;
      },
      error: (message: any) => {
        this.loading.hide();
        this.sharedService.errorAlert(message);
      },
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

    // Crear el payload con el tipo correcto
    const payload: UserPayload = {
      username: this.userForm.value.username,
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
    };

    // Añadir password solo si existe
    if (this.userForm.value.password) {
      payload.password = this.userForm.value.password;
    }

    this.loading.show();
    this.userService
      .createUser(
        payload.username,
        payload.password || '',
        payload.name,
        payload.email,
        payload.role
      )
      .subscribe({
        next: (response) => {
          this.loading.hide();
          if (!response.isSuccess) {
            this.sharedService.errorAlert(response.message);
            return;
          }
          this.sharedService.successAlert(response.message);
          this.getUsers();

          this.sharedService.closeModal('addUserModal');
        },
        error: (message) => {
          this.loading.hide();
          this.sharedService.errorAlert(message);
        },
      });
  }
}
