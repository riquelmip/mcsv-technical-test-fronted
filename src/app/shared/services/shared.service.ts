import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  errorAlert(message: any) {
    if (message == undefined || message == '' || message == null)
      message = 'Error de servidor';

    Swal.fire({
      title: 'Error!',
      html: message,
      icon: 'error',
      confirmButtonColor: '#0085db',
    });
  }

  successAlert(message: any) {
    Swal.fire({
      title: 'Éxito!',
      html: message,
      icon: 'success',
      confirmButtonColor: '#0085db',
    });
  }

  isValidField(myForm: FormGroup, field: string): boolean | null {
    return myForm.controls[field].errors && myForm.controls[field].touched;
  }

  getFieldError(myForm: FormGroup, field: string): string | null {
    if (!myForm.controls[field]) return null;

    const errors = myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'email':
          return 'Ingrese un correo válido';
        case 'mismatch':
          return 'Las contraseñas no coinciden';
      }
    }

    return null;
  }

  confirmAlert(
    message: string,
    confirmButtonText: string,
    cancelButtonText: string,
    confirmCallback: any,
    cancelCallback: any
  ) {
    Swal.fire({
      title: 'Confirmar',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0085db',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      } else {
        cancelCallback();
      }
    });
  }

  closeModal(modalId: string): void {
    const closeBtn = document.querySelector(`[data-modal-hide="${modalId}"]`);
    if (closeBtn) {
      (closeBtn as HTMLElement).click();
    }
  }
}
