import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CreateCustomerResponse,
  GetAllCustomersResponse,
  GetCustomerByIdResponse,
  GetCustomerByUserIdResponse,
} from '../interfaces/customer.interfaces';
import {
  AddressPayload,
  CreateAddressResponse,
} from '../interfaces/address.interface';

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

  getCustomerByUserId(userId: number): Observable<GetCustomerByUserIdResponse> {
    const url = `${this.baseUrl}/mcsv-general/customers/get-by-user-id`;
    const token = localStorage.getItem('token') || '';
    // mandar el usuario por form data
    const body = new FormData();
    body.append('userId', userId.toString());

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<GetCustomerByUserIdResponse>(url, body, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(
          () => error.response?.data.message || 'Error desconocido'
        );
      })
    );
  }

  createAddress(address: AddressPayload): Observable<CreateAddressResponse> {
    const url = `${this.baseUrl}/mcsv-general/addresses/create`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      customerId: address.customerId,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      status: address.status,
    };

    return from(
      axios.post<CreateAddressResponse>(url, payload, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error desconocido')
      )
    );
  }
}
