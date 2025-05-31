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
import { Router } from '@angular/router';
import { ForgotPasswordGeneralResponse } from '../../interfaces/forgot-password.interface';

@Component({
  selector: 'app-forgot-pasword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './forgot-pasword.component.html',
  styleUrl: './forgot-pasword.component.css',
})
export class ForgotPaswordComponent {
  private sharedService = inject(SharedService);
  private authService = inject(AuthService);
  private loading = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  showSearchParams: boolean = false;

  forgotPasswordForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  forgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      const formValues = this.forgotPasswordForm.value;
      const email = formValues.email;

      this.sendEmail(email);
    } else {
      this.sharedService.errorAlert(
        'Por favor, complete los campos requeridos'
      );
    }
  }

  sendEmail(email: string): void {
    this.loading.show();
    this.authService.forgotPassword(email).subscribe({
      next: (response: ForgotPasswordGeneralResponse) => {
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
  }
}
