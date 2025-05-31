import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GetAllUsersGeneralResponse } from '../interfaces/get-all-users.interface';
import { CreateUserGeneralResponse } from '../interfaces/create-user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getUsers(): Observable<GetAllUsersGeneralResponse> {
    const url = `${this.baseUrl}/mcsv-auth/users/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetAllUsersGeneralResponse>(url, {}, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  createUser(
    username: string,
    password: string,
    name: string,
    email: string,
    role: string
  ): Observable<CreateUserGeneralResponse> {
    const url = `${this.baseUrl}/mcsv-auth/users/create`;
    const token = localStorage.getItem('token') || '';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post(
        url,
        {
          username,
          password,
          name,
          email,
          roles: {
            list: [role],
          },
        },
        { headers }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  // deleteProduct(id: number): Observable<DeleteProductGeneralResponse> {
  //   id = parseInt(id.toString(), 10);
  //   const url = `${this.baseUrl}/admin/products/delete`;
  //   const token = localStorage.getItem('token') || '';
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //   };

  //   const formData = new FormData();
  //   formData.append('id', id.toString());

  //   return from(axios.post(url, formData, { headers })).pipe(
  //     map((response) => response.data),
  //     catchError((error) => {
  //       return throwError(
  //         () => error.response?.data.message || 'Error desconocido'
  //       );
  //     })
  //   );
  // }

  // getProduct(id: number): Observable<CreateProductGeneralResponse> {
  //   const url = `${this.baseUrl}/admin/products/get-by-id`;
  //   const token = localStorage.getItem('token') || '';
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //   };

  //   const formData = new FormData();
  //   formData.append('id', id.toString());

  //   return from(axios.post(url, formData, { headers })).pipe(
  //     map((response) => response.data),
  //     catchError((error) => {
  //       return throwError(
  //         () => error.response?.data.message || 'Error desconocido'
  //       );
  //     })
  //   );
  // }

  // getAllByProductType(
  //   productType: number
  // ): Observable<GetProductsGeneralResponse> {
  //   const url = `${this.baseUrl}/admin/products/get-all-by-type`;
  //   const token = localStorage.getItem('token') || '';
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //   };

  //   const formData = new FormData();
  //   formData.append('type', productType.toString());

  //   return from(axios.post(url, formData, { headers })).pipe(
  //     map((response) => response.data),
  //     catchError((error) => {
  //       return throwError(
  //         () => error.response?.data.message || 'Error desconocido'
  //       );
  //     })
  //   );
  // }

  // generatePdfReport(productType: number): Observable<any> {
  //   const url = `${this.baseUrl}/admin/products/get-inventory-report`;
  //   const token = localStorage.getItem('token') || '';
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //   };

  //   const formData = new FormData();
  //   formData.append('type', productType.toString());

  //   return from(
  //     axios.post(url, formData, {
  //       headers,
  //       responseType: 'blob',
  //     })
  //   ).pipe(
  //     map((response) => {
  //       const blob = new Blob([response.data], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'inventory_report.pdf';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);

  //       window.URL.revokeObjectURL(url);

  //       return response.data;
  //     }),
  //     catchError((error) => {
  //       return throwError(
  //         () => error.response?.data.message || 'Error desconocido'
  //       );
  //     })
  //   );
  // }
}
