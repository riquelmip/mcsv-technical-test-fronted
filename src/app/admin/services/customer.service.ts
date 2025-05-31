import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CreateCustomerResponse,
  GetAllCustomersResponse,
  GetCustomerByIdResponse,
} from '../interfaces/customer.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getAllCustomers(): Observable<GetAllCustomersResponse> {
    const url = `${this.baseUrl}/mcsv-general/customers/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(axios.post<GetAllCustomersResponse>(url, {}, { headers })).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error desconocido')
      )
    );
  }

  getCustomerById(id: number): Observable<GetCustomerByIdResponse> {
    const url = `${this.baseUrl}/mcsv-general/customers/get-by-id`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = new URLSearchParams();
    params.append('id', id.toString());

    return from(
      axios.post<GetCustomerByIdResponse>(
        `${url}?${params.toString()}`,
        {},
        { headers }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error desconocido')
      )
    );
  }

  createCustomer(customer: {
    userId: number;
    firstName: string;
    lastName: string;
    phone: string;
  }): Observable<CreateCustomerResponse> {
    const url = `${this.baseUrl}/mcsv-general/customers/create`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<CreateCustomerResponse>(url, customer, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error desconocido')
      )
    );
  }
}
