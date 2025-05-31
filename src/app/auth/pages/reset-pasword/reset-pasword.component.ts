import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordGeneralResponse } from '../../interfaces/reset-password.interface';

@Component({
  selector: 'app-reset-pasword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './reset-pasword.component.html',
  styleUrl: './reset-pasword.component.css',
})
export class ResetPaswordComponent {
  private sharedService = inject(SharedService);
  private authService = inject(AuthService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  showSearchParams: boolean = false;
  token: string | null = null;
  resetPasswordForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    // Obtener el token de los query params al cargar el componente
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.sharedService.errorAlert('No se ha proporcionado un token válido');
      this.router.navigateByUrl('/auth/login');
    }
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const formValues = this.resetPasswordForm.value;
      const password = formValues.password;
      const confirmPassword = formValues.confirmPassword;

      // Verificar que el password y la confirmación sean iguales
      if (password !== confirmPassword) {
        this.sharedService.errorAlert('Las contraseñas no coinciden');
        return;
      }

      this.loading.show();
      this.authService.resetPassword(this.token!, password).subscribe({
        next: (response: ResetPasswordGeneralResponse) => {
          this.loading.hide();
          if (!response.is_success) {
            this.sharedService.errorAlert(response.message);
            return;
          }

          this.sharedService.successAlert(response.message);
          this.router.navigateByUrl('/auth/login');
          this.loading.hide();
        },
        error: (message: any) => {
          this.loading.hide();
          this.sharedService.errorAlert(message);
        },
      });
    } else {
      this.sharedService.errorAlert(
        'Por favor, complete los campos requeridos'
      );
    }
  }
}
