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
import {
  CreateOrderResponse,
  OrderPayload,
} from '../interfaces/order.interface';
import { PayOrderResponse } from '../interfaces/pay.interface';
import { GetOrdersByCustomerResponse } from '../interfaces/getOrders.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  createOrder(payload: OrderPayload): Observable<CreateOrderResponse> {
    const url = `${this.baseUrl}/mcsv-general/orders/create`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(
      axios.post<CreateOrderResponse>(url, payload, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(() => error.response?.data.message || 'Error creando orden')
      )
    );
  }

  getAllOrders(): Observable<GetAllCustomersResponse> {
    const url = `${this.baseUrl}/mcsv-general/orders/get-all`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return from(axios.post<GetAllCustomersResponse>(url, {}, { headers })).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(
          () => error.response?.data.message || 'Error obteniendo órdenes'
        )
      )
    );
  }

  getOrdersByCustomerId(
    customerId: number
  ): Observable<GetOrdersByCustomerResponse> {
    const url = `${this.baseUrl}/mcsv-general/orders/get-by-customer`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = new FormData();
    params.append('customerId', customerId.toString());

    return from(
      axios.post<GetOrdersByCustomerResponse>(url, params, { headers })
    ).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(
          () =>
            error.response?.data.message ||
            'Error obteniendo órdenes por cliente'
        )
      )
    );
  }

  payOrder(orderId: number): Observable<PayOrderResponse> {
    const url = `${this.baseUrl}/mcsv-general/payments/create`;
    const token = localStorage.getItem('token') || '';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = new FormData();
    params.append('orderId', orderId.toString());

    return from(axios.post<PayOrderResponse>(url, params, { headers })).pipe(
      map((response) => response.data),
      catchError((error) =>
        throwError(
          () => error.response?.data.message || 'Error pagando la orden'
        )
      )
    );
  }
}
