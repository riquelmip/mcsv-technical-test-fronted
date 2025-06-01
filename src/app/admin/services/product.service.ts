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
import { GetAllProductsResponse } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getAllProducts(): Observable<GetAllProductsResponse> {
    const url = `${this.baseUrl}/mcsv-general/products/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(axios.post<GetAllProductsResponse>(url, {}, { headers })).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error desconocido')
      )
    );
  }

  getProductById(id: number): Observable<GetCustomerByIdResponse> {
    const url = `${this.baseUrl}/mcsv-general/products/get-by-id`;
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
}
